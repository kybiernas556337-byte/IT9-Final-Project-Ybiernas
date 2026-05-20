<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::latest()->get(),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,staff,customer']);
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot change your own role.');
        }
        $user->update(['role' => $request->role]);
        return back()->with('success', "Role updated to {$request->role} for {$user->name}.");
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        $user->delete();
        return back()->with('success', "{$user->name} has been deleted.");
    }
}
