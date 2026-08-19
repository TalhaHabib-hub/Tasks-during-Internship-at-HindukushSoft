<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TalOn</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-900 text-white antialiased">

    <div class="flex justify-end gap-4 p-6">
        @auth
            <a href="{{ route('dashboard') }}" class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                Dashboard
            </a>
        @else
            <a href="{{ route('login') }}" class="px-4 py-2 hover:underline">
                Log in
            </a>
            <a href="{{ route('register') }}" class="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800">
                Register
            </a>
        @endauth
    </div>

    <div class="flex flex-col items-center justify-center px-4" style="height: 70vh;">
        <h1 class="text-4xl font-bold">Welcome to TalOn application</h1>
    </div>

</body>
</html>