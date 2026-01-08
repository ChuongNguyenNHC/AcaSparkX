<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Assignment;
use App\Models\Question;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function consult(Request $request)
    {
        $userMessage = $request->input('message');
        $courses = Course::where('status', 'published')->get(['title', 'description']);

        $context = "Bạn là trợ vấn tuyển sinh cho hệ thống học trực tuyến AcaSparkX. 
        Dưới đây là danh sách các khóa học hiện có: \n";

        foreach ($courses as $course) {
            $context .= "- {$course->title}: {$course->description}\n";
        }

        $context .= "\nHãy trả lời câu hỏi của người dùng một cách chuyên nghiệp và thân thiện: $userMessage";

        return $this->callGemini($context);
    }

    public function generateQuiz(Request $request)
    {
        $lessonId = $request->input('lesson_id');
        Log::info('Chatbot quiz request for lesson:', ['id' => $lessonId]);

        $lesson = Lesson::with(['assignments.questions.options', 'course'])->find($lessonId);

        if (!$lesson) {
            Log::warning('Lesson not found for quiz generation:', ['id' => $lessonId]);
            return response()->json(['error' => 'Lesson not found.'], 404);
        }

        // 1. Kiểm tra số lượng câu hỏi hiện có trong DB
        $existingQuestionsCount = 0;
        $assignment = $lesson->assignments()->has('questions')->first();

        if ($assignment) {
            $existingQuestionsCount = $assignment->questions()->count();
        }

        // - Nếu kho câu hỏi đã "đầy" (>= 15 câu): Lấy ngẫu nhiên 5 câu từ DB ra cho người dùng (Tiết kiệm Token & Tiền).
        // - Nếu kho còn "mỏng" (< 15 câu): Gọi AI tạo thêm để làm dày kho, và trả về đúng 5 câu vừa tạo (để user thấy mới lạ).

        if ($existingQuestionsCount >= 15) {
            Log::info('Quiz questions bank is sufficient. Returning random questions from DB.', ['count' => $existingQuestionsCount]);
            $randomQuestions = $assignment->questions()->inRandomOrder()->take(5)->get();

            $mappedQuestions = $randomQuestions->map(function ($q) {
                return [
                    'question' => $q->content,
                    'options' => $q->options->pluck('content')->toArray(),
                    'answer' => $q->options->values()->search(fn($opt) => $opt->is_correct),
                    'explanation' => $q->explanation
                ];
            });

            return response()->json($mappedQuestions);
        }

        // 3. Nếu chưa đủ quota kho, gọi AI tạo mới
        $prompt = "Bạn là một giảng viên trên hệ thống AcaSparkX. 
        Hãy tạo 5 câu hỏi trắc nghiệm khách quan để kiểm tra kiến thức về bài học sau:
        Tên bài học: {$lesson->title}
        Mô tả: {$lesson->description}
        Thuộc khóa học: {$lesson->course->title}

        Yêu cầu định dạng kết quả trả về là JSON array, mỗi câu hỏi có các trường:
        - question: Nội dung câu hỏi
        - options: Array 4 lựa chọn
        - answer: Index của đáp án đúng (0-3)
        - explanation: Giải thích ngắn gọn tại sao chọn đáp án đó.

        Chỉ trả về JSON, không thêm văn bản khác.";

        $aiResponse = $this->getGeminiData($prompt, true);

        if (is_array($aiResponse) && isset($aiResponse['error'])) {
            if ($existingQuestionsCount > 0) {
                $randomQuestions = $assignment->questions()->inRandomOrder()->take(5)->get();
            }
            return response()->json($aiResponse, 500);
        }

        // 4. Lưu câu hỏi mới vào database
        try {
            DB::transaction(function () use ($lesson, $aiResponse, &$assignment) {
                if (!$assignment) {
                    $assignment = $lesson->assignments()->create([
                        'title' => 'Bài tập ôn tập: ' . $lesson->title,
                        'time_limit' => 10
                    ]);
                }

                foreach ($aiResponse as $item) {
                    // Kiểm tra trùng lặp nội dung câu hỏi trong cùng assignment (tránh spam)
                    $exists = $assignment->questions()->where('content', $item['question'])->exists();
                    if ($exists)
                        continue;

                    $question = $assignment->questions()->create([
                        'content' => $item['question'],
                        'score' => 2.0,
                        'type' => 'multiple_choice',
                        'explanation' => $item['explanation'] ?? ''
                    ]);

                    foreach ($item['options'] as $index => $optText) {
                        $question->options()->create([
                            'content' => $optText,
                            'is_correct' => ($index == $item['answer'])
                        ]);
                    }
                }
            });
            Log::info('Successfully saved/appended AI generated quiz to DB.');
        } catch (\Exception $e) {
            Log::error('Failed to save AI quiz to DB: ' . $e->getMessage());
        }

        //Trả về đúng 5 câu hỏi VỪA ĐƯỢC TẠO
        return response()->json($aiResponse);
    }
    // model gemini-flash-latest
    private function getGeminiData($prompt, $isJson = false)
    {
        $apiKey = config('services.gemini.key');
        $model = 'gemini-flash-latest';
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        if (!$apiKey) {
            return ['error' => 'Gemini API Key not found.'];
        }

        $payload = [
            'contents' => [['parts' => [['text' => $prompt]]]],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 2048,
            ]
        ];

        if ($isJson) {
            $payload['generationConfig']['responseMimeType'] = 'application/json';
        }

        $response = Http::post($url . '?key=' . $apiKey, $payload);

        if ($response->failed()) {
            Log::error('Gemini API Error', ['status' => $response->status(), 'body' => $response->body()]);
            return ['error' => 'Failed to connect to AI service.'];
        }

        $result = $response->json();
        $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$text) {
            return ['error' => 'Invalid response from AI.'];
        }

        if ($isJson) {
            // Tạm lưu độ dài chuỗi để log
            $originalLen = strlen($text);

            // Loại bỏ Byte Order Mark (BOM) nếu có
            if (strpos($text, "\xEF\xBB\xBF") === 0) {
                $text = substr($text, 3);
            }

            // Loại bỏ markdown code blocks
            $cleanText = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($text));
            $cleanText = trim($cleanText);

            $cleanText = preg_replace('/[\x00-\x1F\x7F]/', ' ', $cleanText);

            $decoded = json_decode($cleanText, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $errorMsg = json_last_error_msg();
                Log::error('Gemini JSON Decode Error', [
                    'error' => $errorMsg,
                    'len' => $originalLen,
                    'prefix' => substr($cleanText, 0, 100),
                    'suffix' => substr($cleanText, -100),
                ]);
                return ['error' => 'Failed to parse AI response as JSON: ' . $errorMsg];
            }
            return $decoded;
        }

        return $text;
    }

    private function callGemini($prompt, $isJson = false)
    {
        $data = $this->getGeminiData($prompt, $isJson);

        if (is_array($data) && isset($data['error'])) {
            return response()->json($data, 500);
        }

        if (is_array($data)) {
            return response()->json($data);
        }

        return response()->json(['message' => $data]);
    }
}
