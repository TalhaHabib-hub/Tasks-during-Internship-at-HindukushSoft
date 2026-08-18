<!DOCTYPE html>
<html>
<head>
    <title>Add Task</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <h1>Add New Task</h1>
    <form action="{{ route('tasks.store') }}" method="POST">
        @csrf
        <label>Title:</label><br>
        <input type="text" name="title" value="{{ old('title') }}"><br>
        @error('title')
            <p style="color: red">{{ $message }}</p>
        @enderror
        <br>

        <label>Description:</label><br>
        <textarea name="description">{{ old('description') }}</textarea><br>
        <br>

        <button type="submit">Save Task</button>
    </form>
    <a href="{{ route('tasks.index') }}">Back to list</a>
</body>
</html>