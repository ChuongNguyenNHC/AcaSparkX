<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\TeacherCourseController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\TeacherContentController;
use App\Http\Controllers\Api\CourseRequestController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminCourseController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\AdminTagController;
use App\Http\Controllers\Api\CvRequestController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/public/categories', [CourseController::class, 'getCategories']);
Route::get('/public/tags', [CourseController::class, 'getTags']);

Route::post('/chatbot/consult', [ChatbotController::class, 'consult']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);
    Route::post('/lessons/rate', [RatingController::class, 'rateLesson']);
    Route::post('/chatbot/quiz', [ChatbotController::class, 'generateQuiz']);


    // Student Routes
    Route::post('/student/cv-request', [CvRequestController::class, 'store']);

    /*
    |-- Teacher Routes
    */
    Route::prefix('teacher')->group(function () {
        // Content & Lesson Management
        Route::get('/courses', [TeacherContentController::class, 'index']);
        Route::get('/courses/{courseId}/lessons', [TeacherContentController::class, 'getLessons']);
        Route::post('/lessons', [TeacherContentController::class, 'store']);
        Route::post('/lessons/{id}', [TeacherContentController::class, 'update']);
        Route::delete('/lessons/{id}', [TeacherContentController::class, 'destroy']);

        // Course Management
        Route::post('/courses', [TeacherCourseController::class, 'storeCourse']);
        Route::put('/courses/{id}', [TeacherCourseController::class, 'updateCourse']);
        Route::delete('/courses/{id}', [TeacherCourseController::class, 'destroyCourse']);
        Route::get('/stats', [TeacherCourseController::class, 'getStats']);

        // Course Requests
        Route::get('/requests', [CourseRequestController::class, 'index']);
        Route::post('/requests', [CourseRequestController::class, 'store']);
    });

    /*
    |-- Admin Routes
    */
    Route::prefix('admin')->group(function () {
        // User Management
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::patch('/users/{id}/role', [AdminUserController::class, 'updateRole']);
        Route::patch('/users/{id}/status', [AdminUserController::class, 'updateStatus']);

        // Dashboard Stats
        Route::get('/stats', [AdminDashboardController::class, 'getStats']);

        // Course Management
        Route::get('/courses', [AdminCourseController::class, 'index']);
        Route::post('/courses', [AdminCourseController::class, 'store']);
        Route::patch('/courses/{id}/approve', [AdminCourseController::class, 'approve']);
        Route::patch('/courses/{id}/reject', [AdminCourseController::class, 'reject']);
        Route::patch('/courses/{id}/hide', [AdminCourseController::class, 'hide']);
        Route::patch('/courses/{id}/unhide', [AdminCourseController::class, 'unhide']);
        Route::post('/courses/{id}', [AdminCourseController::class, 'update']);
        Route::get('/teachers-list', [AdminCourseController::class, 'getTeachers']);

        // Categories & Tags
        Route::apiResource('/categories', AdminCategoryController::class);
        Route::apiResource('/tags', AdminTagController::class);

        // Course Requests
        Route::get('/requests', [CourseRequestController::class, 'indexAdmin']);
        Route::patch('/requests/{id}/approve', [CourseRequestController::class, 'approve']);
        Route::patch('/requests/{id}/reject', [CourseRequestController::class, 'reject']);

        // CV Requests (Teacher Upgrade)
        Route::get('/cv-requests', [CvRequestController::class, 'indexAdmin']);
        Route::patch('/cv-requests/{id}/approve', [CvRequestController::class, 'approve']);
        Route::patch('/cv-requests/{id}/reject', [CvRequestController::class, 'reject']);
    });
});