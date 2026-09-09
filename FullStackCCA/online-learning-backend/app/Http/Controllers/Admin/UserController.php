<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Admin: list all users
    public function index()
    {
        return response()->json(User::latest()->get());
    }

    // Admin: block/unblock a user
    public function toggleBlock($id)
    {
        $user = User::findOrFail($id);
        $user->status = $user->status === 'active' ? 'blocked' : 'active';
        $user->save();

        return response()->json($user);
    }

    // Admin: delete a user
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted']);
    }
    // Admin: change a user's role
public function updateRole(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'role' => 'required|in:admin,instructor,student',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::findOrFail($id);
    $user->role = $request->role;
    $user->save();

    return response()->json($user);
}
}