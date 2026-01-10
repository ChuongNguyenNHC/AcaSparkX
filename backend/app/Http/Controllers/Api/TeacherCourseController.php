<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\LessonRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TeacherCourseController extends Controller
{
    /**
     * 1. QUẢN LÝ KHÓA HỌC (COURSE)
     */

    // Danh sách khóa học của tôi
    public function index(Request $request)
    {
        $courses = Course::where('instructor_id', $request->user()->id)
            ->withCount('lessons')
            ->get();
        return response()->json(['status' => 'success', 'data' => $courses]);
    }

    // Thêm khóa học mới
    public function storeCourse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $course = Course::create([
            'id' => (string) Str::uuid(),
            'instructor_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'status' => 'pending' // Chờ admin duyệt
        ]);

        return response()->json(['status' => 'success', 'data' => $course], 201);
    }

    // Cập nhật khóa học
    public function updateCourse(Request $request, $id)
    {
        $course = Course::where('id', $id)->where('instructor_id', $request->user()->id)->firstOrFail();
        $course->update($request->only(['title', 'description', 'category_id']));
        return response()->json(['status' => 'success', 'data' => $course]);
    }

    // Xóa khóa học
    public function destroyCourse(Request $request, $id)
    {
        $course = Course::where('id', $id)->where('instructor_id', $request->user()->id)->firstOrFail();
        $course->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa khóa học']);
    }

    /**
     * 2. QUẢN LÝ BÀI HỌC / NỘI DUNG (LESSON / CONTENT)
     */

    // Lấy bài học kèm số sao đánh giá (Yêu cầu Mục 3)
    public function getLessonsByCourse($courseId)
    {
        $lessons = Lesson::where('course_id', $courseId)
            ->withAvg('ratings', 'rating') // Tính trung bình sao của bài học
            ->orderBy('order', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $lessons]);
    }

    // Thêm nội dung (Lesson) vào khóa học
    public function storeLesson(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string',
            'video_url' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $maxOrder = Lesson::where('course_id', $request->course_id)->max('order');
        $lastOrder = isset($maxOrder) ? $maxOrder : 0;

        $lesson = Lesson::create([
            'id' => (string) Str::uuid(),
            'course_id' => $request->course_id,
            'title' => $request->title,
            'video_url' => $request->video_url,
            'description' => $request->description,
            'order' => $lastOrder + 1
        ]);

        return response()->json(['status' => 'success', 'data' => $lesson], 201);
    }

    /**
     * 3. THỐNG KÊ (Yêu cầu Mục 2)
     */
    public function getStats(Request $request)
    {
        $teacherId = $request->user()->id;

        // Tổng số học viên (Mục 2.2)
        $totalStudents = Enrollment::whereHas('course', function($q) use ($teacherId) {
            $q->where('instructor_id', $teacherId);
        })->count();

        // Đánh giá trung bình toàn bộ (Mục 3)
        $avgRating = LessonRating::whereHas('lesson.course', function($q) use ($teacherId) {
            $q->where('instructor_id', $teacherId);
        })->avg('rating') ?: 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_students' => $totalStudents,
                'average_rating' => round($avgRating, 1),
                'total_income' => $totalStudents * 500000 // Tạm tính thu nhập
            ]
        ]);
    }
}
