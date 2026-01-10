<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TeacherContentController extends Controller
{
    // List courses assigned to the current teacher
    public function index(Request $request)
    {
        // Assuming courses have an 'instructor_id' field.
        // If teacher can add to ANY course, logic might change, but typically they manage their own or assigned ones.
        // Based on "teacher đăng video trong các khóa học cụ thể đó" & "admin phụ trách việc tạo khóa học"
        // We assume Admin creates course and assigns instructor_id to Teacher.

        $courses = Course::where('instructor_id', $request->user()->id)
            ->where('status', '!=', 'hidden') // Hide hidden courses from teacher
            ->with('lessons') // Eager load lessons
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $courses
        ]);
    }

    // Get lessons for a specific course (optional, if not eager loaded above)
    public function getLessons($courseId)
    {
        $lessons = Lesson::where('course_id', $courseId)
            ->with('attachments')
            ->orderBy('order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $lessons
        ]);
    }

    // Store a new lesson with video and attachments
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_file' => 'required|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:102400', // Max 100MB
            'attachments.*' => 'nullable|file|max:10240', // Max 10MB per attachment
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        // 1. Handle Video Upload
        if ($request->hasFile('video_file')) {
            $video = $request->file('video_file');
            $videoName = time() . '_' . Str::slug($request->title) . '.' . $video->getClientOriginalExtension();
            // Store in public/videos for direct access
            $video->move(public_path('videos'), $videoName);
            $videoUrl = '/videos/' . $videoName;
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng tải lên video bài học'
            ], 422);
        }

        // 2. Create Lesson
        // Calculate order: last lesson order + 1
        $lastOrder = Lesson::where('course_id', $request->course_id)->max('order') ?? 0;

        $lesson = Lesson::create([
            'course_id' => $request->course_id,
            'title' => $request->title,
            'description' => $request->description,
            'video_url' => $videoUrl,
            'order' => $lastOrder + 1,
            'id' => (string) Str::uuid(),
        ]);

        // 3. Handle Attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $fileName = $file->getClientOriginalName();
                $path = $file->store('attachments', 'public'); // Store in storage/app/public/attachments

                LessonAttachment::create([
                    'id' => (string) Str::uuid(),
                    'lesson_id' => $lesson->id,
                    'file_name' => $fileName,
                    'file_path' => '/storage/' . $path, // Access via storage link
                    'file_type' => $file->getClientOriginalExtension(),
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm bài học thành công',
            'data' => $lesson->load('attachments')
        ], 201);
    }

    // Update lesson
    public function update(Request $request, $id)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json(['status' => 'error', 'message' => 'Bài học không tồn tại'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_file' => 'nullable|file|mimetypes:video/mp4,video/quicktime|max:102400',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // Update video if new file provided
        if ($request->hasFile('video_file')) {
            // Delete old video if exists (optional logic)
            // Upload new
            $video = $request->file('video_file');
            $videoName = time() . '_' . Str::slug($request->title) . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('videos'), $videoName);
            $lesson->video_url = '/videos/' . $videoName;
        }

        $lesson->title = $request->title;
        $lesson->description = $request->description;
        $lesson->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật bài học thành công',
            'data' => $lesson
        ]);
    }

    // Delete lesson
    public function destroy($id)
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['status' => 'error', 'message' => 'Bài học không tồn tại'], 404);
        }

        // Ideally delete video file and attachments here too

        $lesson->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa bài học thành công'
        ]);
    }
}
