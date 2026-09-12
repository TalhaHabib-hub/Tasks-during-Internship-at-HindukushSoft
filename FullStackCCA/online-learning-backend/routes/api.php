<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\UserController;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses/{course}/announcements', [AnnouncementController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:instructor'])->group(function () {
    Route::post('/instructor/courses/{course}/announcements', [AnnouncementController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::put('/admin/users/{id}/block', [UserController::class, 'toggleBlock']);
    Route::put('/admin/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
});
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::post('/courses/{course}/checkout', [PaymentController::class, 'checkout']);
    Route::get('/student/payments', [PaymentController::class, 'history']);
});
Route::get('/courses/{course}/reviews', [ReviewController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::post('/courses/{course}/reviews', [ReviewController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'role:instructor'])->group(function () {
    Route::post('/instructor/lessons/{lesson}/quiz', [QuizController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/lessons/{lesson}/quiz', [QuizController::class, 'show']);
    Route::post('/quizzes/{id}/submit', [QuizController::class, 'submit']);
});
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'enroll']);
    Route::get('/student/enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::post('/lessons/{id}/complete', [EnrollmentController::class, 'completeLesson']);
    Route::get('/enrollments/{id}/progress', [EnrollmentController::class, 'progress']);
});
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:instructor'])->group(function () {
    Route::post('/instructor/courses/{course}/lessons', [LessonController::class, 'store']);
    Route::put('/instructor/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/instructor/lessons/{id}', [LessonController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lessons/{id}/stream', [LessonController::class, 'stream']);
});
Route::middleware(['auth:sanctum', 'role:instructor'])->group(function () {
    Route::get('/instructor/courses', [CourseController::class, 'myCourses']);
    Route::get('/instructor/stats', [CourseController::class, 'stats']);
    Route::post('/instructor/courses', [CourseController::class, 'store']);
    Route::put('/instructor/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/instructor/courses/{id}', [CourseController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/courses', [CourseController::class, 'allCourses']);
    Route::put('/admin/courses/{id}/approve', [CourseController::class, 'approve']);
    Route::put('/admin/courses/{id}/reject', [CourseController::class, 'reject']);
});
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
   

});