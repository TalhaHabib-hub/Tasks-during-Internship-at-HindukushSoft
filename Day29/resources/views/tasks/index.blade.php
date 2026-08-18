<!DOCTYPE html>
<html>
<head>
    <title>Tasks</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <h1>Task List</h1>
    <a href="{{ route('tasks.create') }}">+ Add New Task</a>

    @if (session('success'))
        <p style="color: green">{{ session('success') }}</p>
    @endif

    <table border="1" cellpadding="8">
        <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Completed?</th>
            <th>Actions</th>
        </tr>
        @foreach ($tasks as $task)
            <tr>
                <td>{{ $task->title }}</td>
                <td>{{ $task->description }}</td>
                <td>{{ $task->is_completed ? 'Yes' : 'No' }}</td>
                <td>
                    <a href="{{ route('tasks.edit', $task->id) }}">Edit</a>
                    <form action="{{ route('tasks.destroy', $task->id) }}" method="POST" style="display:inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" onclick="return confirm('Delete this task?')">Delete</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </table>

    {{ $tasks->links() }}
</body>
</html>