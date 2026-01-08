<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ChatbotController;

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
});
