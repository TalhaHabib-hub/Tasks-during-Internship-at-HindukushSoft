<?php
namespace App\Http\Controllers;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::latest()->get();
        return response()->json(['data' => $tasks], 200);
    }

    public function store(StoreTaskRequest $request)
    {
        // validation already happened automatically before we get here
        $task = Task::create($request->validated());
        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task
        ], 201);
    }

    public function destroy($id)
    {
        try {
            $task = Task::findOrFail($id); // throws error if not found
            $task->delete();
            return response()->json(['message' => 'Task deleted'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Task not found'], 404);
        } catch (\Exception $e) {
            Log::error($e->getMessage()); // log real error for you, hide it from user
            return response()->json(['message' => 'Something went wrong on our end'], 500);
        }
    }
}