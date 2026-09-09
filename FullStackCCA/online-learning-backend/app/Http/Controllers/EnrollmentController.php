<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    // Student: enroll in a course
    public function enroll(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)->where('status', 'approved')->firstOrFail();

        $existing = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $courseId)->first();

        if ($existing) {
            return response()->json(['message' => 'Already enrolled'], 409);
        }

        $enrollment = Enrollment::create([
            'student_id' => $request->user()->id,
            'course_id' => $courseId,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        return response()->json($enrollment, 201);
    }

    // Student: list own enrollments
    public function myEnrollments(Request $request)
    {
        $enrollments = Enrollment::where('student_id', $request->user()->id)
            ->with('course')->latest()->get();

        return response()->json($enrollments);
    }

    // Student: mark a lesson as completed
    public function completeLesson(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);

        $enrollment = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $lesson->course_id)->firstOrFail();

        $progress = LessonProgress::firstOrCreate(
            ['enrollment_id' => $enrollment->id, 'lesson_id' => $lessonId],
            ['completed_at' => now()]
        );

        if (!$progress->completed_at) {
            $progress->update(['completed_at' => now()]);
        }

        // Check if all lessons are completed -> mark enrollment completed
        $totalLessons = Lesson::where('course_id', $lesson->course_id)->count();
        $completedLessons = LessonProgress::where('enrollment_id', $enrollment->id)
            ->whereNotNull('completed_at')->count();

        if ($totalLessons > 0 && $completedLessons >= $totalLessons) {
            $enrollment->update(['status' => 'completed']);
        }

        return response()->json(['message' => 'Lesson marked as completed', 'progress' => $progress]);
    }

    // Student: get progress % for a course
    public function progress(Request $request, $enrollmentId)
    {
        $enrollment = Enrollment::where('id', $enrollmentId)
            ->where('student_id', $request->user()->id)->firstOrFail();

        $totalLessons = Lesson::where('course_id', $enrollment->course_id)->count();
        $completedLessons = LessonProgress::where('enrollment_id', $enrollment->id)
            ->whereNotNull('completed_at')->count();

        $percentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

        return response()->json([
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'percentage' => $percentage,
            'status' => $enrollment->status,
        ]);
    }
}