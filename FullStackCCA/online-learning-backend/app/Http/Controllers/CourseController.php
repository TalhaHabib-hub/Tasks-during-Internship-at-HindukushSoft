<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    // Public: list approved courses, filterable by category/search
    public function index(Request $request)
    {
        $query = Course::with(['instructor', 'category'])->where('status', 'approved');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->latest()->get());
    }
    // Instructor: dashboard stats (enrollment counts per course)
public function stats(Request $request)
{
    $courses = Course::where('instructor_id', $request->user()->id)
        ->withCount('enrollments')
        ->with('category')
        ->latest()
        ->get();

    return response()->json($courses);
}
    // Admin: list all courses regardless of status
public function allCourses()
{
    return response()->json(Course::with(['instructor', 'category'])->latest()->get());
}

    // Public: course details
    public function show($id)
    {
        $course = Course::with(['instructor', 'category', 'lessons'])->findOrFail($id);
        return response()->json($course);
    }

    // Instructor: list own courses
    public function myCourses(Request $request)
    {
        return response()->json(
            Course::where('instructor_id', $request->user()->id)->with('category')->latest()->get()
        );
    }

    // Instructor: create course
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
        }

        $course = Course::create([
            'instructor_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'description' => $request->description,
            'thumbnail' => $thumbnailPath,
            'price' => $request->price,
            'status' => 'pending',
        ]);

        return response()->json($course, 201);
    }

    // Instructor: update own course
   public function update(Request $request, $id)
    {
        $course = Course::where('id', $id)->where('instructor_id', $request->user()->id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'price' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['category_id', 'title', 'description', 'price']);

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                \Storage::disk('public')->delete($course->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('course-thumbnails', 'public');
        }

        $course->update($data);

        return response()->json($course);
    }

    // Instructor: delete own course
    public function destroy(Request $request, $id)
    {
        $course = Course::where('id', $id)->where('instructor_id', $request->user()->id)->firstOrFail();
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }

    // Admin: approve course
    public function approve($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'approved']);
        return response()->json($course);
    }

    // Admin: reject course
    public function reject($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'rejected']);
        return response()->json($course);
    }
}