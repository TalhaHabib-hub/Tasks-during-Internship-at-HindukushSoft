<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    // Public: list reviews for a course
    public function index($courseId)
    {
        $reviews = Review::where('course_id', $courseId)->with('student:id,name')->latest()->get();
        return response()->json($reviews);
    }

    // Student: add a review (must be enrolled)
    public function store(Request $request, $courseId)
    {
        $enrolled = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $courseId)->exists();

        if (!$enrolled) {
            return response()->json(['message' => 'You must be enrolled to review this course'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $review = Review::create([
            'course_id' => $courseId,
            'student_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'created_at' => now(),
        ]);

        return response()->json($review, 201);
    }
}