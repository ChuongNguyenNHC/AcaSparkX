<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LessonRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class RatingController extends Controller
{
    public function rateLesson(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lesson_id' => 'required|exists:lessons,id',
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid rating data',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();

        $rating = LessonRating::updateOrCreate(
            ['user_id' => $userId, 'lesson_id' => $request->lesson_id],
            ['stars' => $request->stars, 'comment' => $request->comment]
        );

        $lesson = \App\Models\Lesson::find($request->lesson_id);

        // Invalidate Cache for this course and user
        $courseId = $lesson->course_id;
        Cache::store('file')->forget("course_details_{$courseId}_{$userId}");
        Cache::store('file')->forget("course_details_{$courseId}_guest");

        $newAvg = round($lesson->ratings()->avg('stars') ?? 0, 1);

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn bạn đã đánh giá!',
            'data' => [
                'rating' => $rating,
                'avg_rating' => $newAvg,
                'user_rating' => $request->stars
            ]
        ]);
    }
}
