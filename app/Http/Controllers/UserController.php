<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all(); // or User::paginate(10) for pagination
        return view('admin.users.index', compact('users'));
    }
}
