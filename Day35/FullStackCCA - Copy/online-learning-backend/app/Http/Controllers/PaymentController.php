<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Student: mock checkout for a paid course
    public function checkout(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)->where('status', 'approved')->firstOrFail();

        $existingEnrollment = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $courseId)->exists();

        if ($existingEnrollment) {
            return response()->json(['message' => 'Already enrolled in this course'], 409);
        }

        // Simulate a successful payment (mock — no real payment gateway)
        $payment = Payment::create([
            'student_id' => $request->user()->id,
            'course_id' => $courseId,
            'amount' => $course->price,
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        // Auto-enroll after successful mock payment
        Enrollment::create([
            'student_id' => $request->user()->id,
            'course_id' => $courseId,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        return response()->json([
            'message' => 'Payment successful, enrolled in course',
            'payment' => $payment,
        ], 201);
    }

    // Student: payment history
    public function history(Request $request)
    {
        $payments = Payment::where('student_id', $request->user()->id)->with('course')->latest()->get();
        return response()->json($payments);
    }
}