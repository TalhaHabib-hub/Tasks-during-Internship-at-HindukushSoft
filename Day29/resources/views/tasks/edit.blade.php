<!DOCTYPE html>
<html>
<head>
    <title>Edit Task</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <h1>Edit Task</h1>
    <form action="{{ route('tasks.update', $task->id) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Title:</label><br>
        <input type="text" name="title" value="{{ old('title', $task->title) }}"><br>
        @error('title')
            <p style="color: red">{{ $message }}</p>
        @enderror
        <br>

        <label>Description:</label><br>
        <textarea name="description">{{ old('description', $task->description) }}</textarea><br>
        <br>

        <label>
            <input type="checkbox" name="is_completed" value="1" {{ $task->is_completed ? 'checked' : '' }}>
            Completed
        </label><br><br>

        <button type="submit">Update Task</button>
    </form>
    <a href="{{ route('tasks.index') }}">Back to list</a>
</body>
</html>