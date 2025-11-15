<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $auth = $request->user();
        if (!$auth || $auth->role !== 'admin') {
            return response()->json(['error' => 'Sem permissões'], 403);
        }
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,manager,operator'
        ]);
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|different:current_password'
        ]);
        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json(['error' => 'Password atual incorreta'], 422);
        }
        $user->password = bcrypt($data['new_password']);
        $user->save();
        return response()->json(['message' => 'Password alterada']);
    }
}
