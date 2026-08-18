<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = DB::table('tasks')->orderBy('created_at', 'desc')->paginate(10);
        return view('tasks.index', compact('tasks'));
    }

    public function create()
    {
        return view('tasks.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        DB::table('tasks')->insert([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task created!');
    }

    public function edit($id)
    {
        $task = DB::table('tasks')->where('id', $id)->first();
        return view('tasks.edit', compact('task'));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
        ]);

        DB::table('tasks')->where('id', $id)->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_completed' => $request->has('is_completed'),
            'updated_at' => now(),
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task updated!');
    }

    public function destroy($id)
    {
        DB::table('tasks')->where('id', $id)->delete();
        return redirect()->route('tasks.index')->with('success', 'Task deleted!');
    }
}