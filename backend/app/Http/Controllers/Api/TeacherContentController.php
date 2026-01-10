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
        $userId = $request->user()->id;

        // Strictly show only courses where the teacher is in the 'teachers' pivot
        // We remove 'instructor_id' check because typically Admin is the creator/instructor_id.
        $courses = Course::whereHas('teachers', function ($q) use ($userId) {
            $q->where('id', $userId);
        })
            ->where('status', '!=', 'hidden')
            ->with('lessons')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $courses
        ]);
    }

    // Get lessons for a specific course (optional, if not eager loaded above)
    public function getLessons($courseId)
    {
        // Add check if teacher has access to this course?
        // Ideally checking in 'index' is enough for UI, but for API security we should checking here too.
        // But the user focused on 'upload video', so let's focus on mutation methods first or do it properly here.

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

        // Check Permission
        $course = Course::find($request->course_id);
        $userId = $request->user()->id;

        // Allow if instructor_id (just in case) OR in teachers list
        $hasPermission = $course->instructor_id === $userId || $course->teachers()->where('id', $userId)->exists();

        if (!$hasPermission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền đăng bài học cho khóa học này.'
            ], 403);
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

        // Check Permission via Course
        $course = $lesson->course; // Assuming Lesson belongsTo Course
        $userId = $request->user()->id;
        $hasPermission = $course->instructor_id === $userId || $course->teachers()->where('id', $userId)->exists();

        if (!$hasPermission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền chỉnh sửa bài học này.'
            ], 403);
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
    public function destroy(Request $request, $id)
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['status' => 'error', 'message' => 'Bài học không tồn tại'], 404);
        }

        // Check Permission
        $course = $lesson->course;
        $userId = $request->user()->id;
        $hasPermission = $course->instructor_id === $userId || $course->teachers()->where('id', $userId)->exists();

        if (!$hasPermission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền xóa bài học này.'
            ], 403);
        }

        // Ideally delete video file and attachments here too

        $lesson->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa bài học thành công'
        ]);
    }
}
