<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    // Instructor: create quiz with questions for a lesson
    public function store(Request $request, $lessonId)
    {
        $lesson = Lesson::with('course')->findOrFail($lessonId);

        if ($lesson->course->instructor_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.correct_option' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $quiz = Quiz::create([
            'lesson_id' => $lessonId,
            'title' => $request->title,
        ]);

        foreach ($request->questions as $q) {
            $quiz->questions()->create([
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_option' => $q['correct_option'],
            ]);
        }

        return response()->json($quiz->load('questions'), 201);
    }

    // Student: get quiz + questions (without correct answers exposed)
    public function show($lessonId)
    {
        $quiz = Quiz::where('lesson_id', $lessonId)->with('questions')->firstOrFail();

        // Hide correct_option from response
        $quiz->questions->transform(function ($q) {
            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $q->options,
            ];
        });

        return response()->json($quiz);
    }

    // Student: submit answers, get auto-scored result
    public function submit(Request $request, $quizId)
    {
        $quiz = Quiz::with('questions')->findOrFail($quizId);

        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $answers = $request->answers; // format: { "question_id": "chosen_option", ... }
        $correctCount = 0;

        foreach ($quiz->questions as $question) {
            if (isset($answers[$question->id]) && $answers[$question->id] === $question->correct_option) {
                $correctCount++;
            }
        }

        $totalQuestions = $quiz->questions->count();
        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $request->user()->id,
            'score' => $score,
            'attempted_at' => now(),
        ]);

        return response()->json([
            'score' => $score,
            'correct_answers' => $correctCount,
            'total_questions' => $totalQuestions,
            'attempt' => $attempt,
        ]);
    }
}