<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LessonController extends Controller
{
    // Public: list lessons for a course
    public function index($courseId)
    {
        $lessons = Lesson::where('course_id', $courseId)->orderBy('order')->get();
        return response()->json($lessons);
    }

    // Instructor: add lesson (must own the course). Supports YouTube link OR file upload.
    public function store(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)->where('instructor_id', $request->user()->id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'video_type' => 'required|in:youtube,upload',
            'video_url' => 'required_if:video_type,youtube|nullable|string',
            'video_file' => 'required_if:video_type,upload|nullable|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:512000', // 500MB max
            'content' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $videoPath = null;
        if ($request->video_type === 'upload' && $request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('lesson-videos', 'local'); // private disk
        }

        $lesson = Lesson::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'video_type' => $request->video_type,
            'video_url' => $request->video_type === 'youtube' ? $request->video_url : null,
            'video_path' => $videoPath,
            'content' => $request->content,
            'order' => $request->order ?? 0,
        ]);

        return response()->json($lesson, 201);
    }

    // Instructor: update lesson (must own the parent course)
    public function update(Request $request, $id)
    {
        $lesson = Lesson::with('course')->findOrFail($id);

        if ($lesson->course->instructor_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->only(['title', 'content', 'order', 'video_type', 'video_url']);

        if ($request->video_type === 'upload' && $request->hasFile('video_file')) {
            // Delete old file if replacing
            if ($lesson->video_path) {
                Storage::disk('local')->delete($lesson->video_path);
            }
            $data['video_path'] = $request->file('video_file')->store('lesson-videos', 'local');
            $data['video_url'] = null;
        } elseif ($request->video_type === 'youtube') {
            $data['video_path'] = null;
        }

        $lesson->update($data);

        return response()->json($lesson);
    }

    // Instructor: delete lesson (must own the parent course)
    public function destroy(Request $request, $id)
    {
        $lesson = Lesson::with('course')->findOrFail($id);

        if ($lesson->course->instructor_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($lesson->video_path) {
            Storage::disk('local')->delete($lesson->video_path);
        }

        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted']);
    }

    // Protected: stream an uploaded video, only to enrolled students or the owning instructor
        public function stream(Request $request, $id)
    {
        $lesson = Lesson::with('course')->findOrFail($id);

        if (!$lesson->video_path || $lesson->video_type !== 'upload') {
            return response()->json(['message' => 'No uploaded video for this lesson'], 404);
        }

        $user = $request->user();
        $isInstructor = $lesson->course->instructor_id === $user->id;
        $isEnrolled = Enrollment::where('course_id', $lesson->course_id)->where('student_id', $user->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $path = Storage::disk('local')->path($lesson->video_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'Video file not found'], 404);
        }

        return response()->file($path, [
            'Content-Type' => Storage::disk('local')->mimeType($lesson->video_path),
        ]);
    }
}