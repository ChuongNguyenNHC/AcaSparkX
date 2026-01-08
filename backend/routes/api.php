<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\RatingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/lessons/rate', [RatingController::class, 'rateLesson']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
