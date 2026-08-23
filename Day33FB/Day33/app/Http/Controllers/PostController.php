<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return Post::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'category' => 'required|string',
            'status' => 'required|string',
            'content' => 'required|string',
        ]);

        return Post::create($validated);
    }

    public function show(Post $post)
    {
        return $post;
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'category' => 'required|string',
            'status' => 'required|string',
            'content' => 'required|string',
        ]);

        $post->update($validated);
        return $post;
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(['message' => 'Deleted']);
    }
}