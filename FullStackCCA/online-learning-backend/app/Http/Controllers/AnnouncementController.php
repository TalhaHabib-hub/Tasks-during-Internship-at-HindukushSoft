<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    // Enrolled student or owning instructor: list announcements for a course
    public function index(Request $request, $courseId)
    {
        $user = $request->user();

        $isInstructor = Course::where('id', $courseId)->where('instructor_id', $user->id)->exists();
        $isEnrolled = Enrollment::where('course_id', $courseId)->where('student_id', $user->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $announcements = Announcement::where('course_id', $courseId)->latest()->get();
        return response()->json($announcements);
    }

    // Instructor: post an announcement to own course
    public function store(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)->where('instructor_id', $request->user()->id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $announcement = Announcement::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'message' => $request->message,
        ]);

        return response()->json($announcement, 201);
    }
}