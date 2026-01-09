<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\TeacherContentController;
use App\Http\Controllers\Api\CourseRequestController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

Route::post('/chatbot/consult', [ChatbotController::class, 'consult']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/lessons/rate', [RatingController::class, 'rateLesson']);
    Route::post('/chatbot/quiz', [ChatbotController::class, 'generateQuiz']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Teacher Routes
    Route::prefix('teacher')->group(function () {
        // Content Management
        Route::get('/courses', [TeacherContentController::class, 'index']);
        Route::get('/courses/{courseId}/lessons', [TeacherContentController::class, 'getLessons']);
        Route::post('/lessons', [TeacherContentController::class, 'store']);
        Route::post('/lessons/{id}', [TeacherContentController::class, 'update']); // Using POST for update with file upload often easier
        Route::delete('/lessons/{id}', [TeacherContentController::class, 'destroy']);

        // Course Requests
        Route::get('/requests', [CourseRequestController::class, 'index']);
        Route::post('/requests', [CourseRequestController::class, 'store']);
    });

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\Api\AdminUserController::class, 'index']);
        Route::put('/users/{id}', [\App\Http\Controllers\Api\AdminUserController::class, 'update']);
        Route::patch('/users/{id}/role', [\App\Http\Controllers\Api\AdminUserController::class, 'updateRole']);
        Route::patch('/users/{id}/status', [\App\Http\Controllers\Api\AdminUserController::class, 'updateStatus']);

        // Dashboard Stats
        Route::get('/stats', [\App\Http\Controllers\Api\AdminDashboardController::class, 'getStats']);

        // Course Management
        Route::get('/courses', [\App\Http\Controllers\Api\AdminCourseController::class, 'index']);
        Route::post('/courses', [\App\Http\Controllers\Api\AdminCourseController::class, 'store']); // Create
        Route::patch('/courses/{id}/approve', [\App\Http\Controllers\Api\AdminCourseController::class, 'approve']);
        Route::patch('/courses/{id}/reject', [\App\Http\Controllers\Api\AdminCourseController::class, 'reject']);
        Route::post('/courses/{id}', [\App\Http\Controllers\Api\AdminCourseController::class, 'update']); // Update with file upload
        Route::get('/teachers-list', [\App\Http\Controllers\Api\AdminCourseController::class, 'getTeachers']);

        // Categories & Tags
        Route::apiResource('/categories', \App\Http\Controllers\Api\AdminCategoryController::class);
        Route::apiResource('/tags', \App\Http\Controllers\Api\AdminTagController::class);
    });
});
