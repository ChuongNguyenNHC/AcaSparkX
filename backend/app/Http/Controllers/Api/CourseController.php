<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Support\Facades\Cache;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::withCount('lessons')
            ->where('status', 'published')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    public function show($id)
    {
        $userId = auth('sanctum')->id();
        $cacheKey = "course_details_{$id}_" . ($userId ?? 'guest');

        $data = Cache::store('file')->remember($cacheKey, 600, function () use ($id, $userId) {
            $course = Course::with([
                'instructor',
                'lessons' => function ($query) use ($userId) {
                    $query->orderBy('order')
                        ->withAvg('ratings as avg_rating', 'stars')
                        ->with([
                            'ratings' => function ($q) use ($userId) {
                                $q->where('user_id', $userId)->select('lesson_id', 'stars');
                            }
                        ]);
                }
            ])->findOrFail($id);

            $lessons = $course->lessons->map(function ($lesson) {
                $lesson->avg_rating = round($lesson->avg_rating ?? 0, 1);
                $lesson->user_rating = $lesson->ratings->first()?->stars ?? 0;
                // Clean up relationships we don't need in the final JSON
                unset($lesson->ratings);
                return $lesson;
            });

            return [
                'course' => $course,
                'lessons' => $lessons
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
