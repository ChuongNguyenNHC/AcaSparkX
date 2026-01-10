<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('email', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by Role
        if ($request->has('role') && $request->role && $request->role !== 'all') {
            // Handle special 'pending' case if logic differs, or just standard roles
            if ($request->role === 'student_only') {
                $query->where('role', 'student')->where('status', '!=', 'pending_teacher');
            } else if ($request->role === 'pending_teacher') {
                $query->where('status', 'pending_teacher');
            } else {
                $query->where('role', $request->role);
            }
        }

        // Filter by Status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($users);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    /**
     * Determine user role (Promote/Demote)
     */
    public function updateRole(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $newRole = $request->input('role');

        if (!in_array($newRole, ['student', 'teacher', 'admin'])) {
            return response()->json(['message' => 'Invalid role'], 400);
        }

        // Prevent modifying other admins if needed, or self-demotion checks could go here

        $user->role = $newRole;
        // If promoting to teacher, ensure status is active
        if ($newRole === 'teacher' && $user->status === 'pending_teacher') {
            $user->status = 'active';
        }

        $user->save();

        return response()->json(['message' => 'User role updated', 'user' => $user]);
    }

    /**
     * Toggle User Status (Ban/Activate)
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $newStatus = $request->input('status');

        if (!in_array($newStatus, ['active', 'banned'])) {
            return response()->json(['message' => 'Invalid status'], 400);
        }

        // Prevent banning admins
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot ban an admin user'], 403);
        }

        $user->status = $newStatus;
        $user->save();

        return response()->json(['message' => 'User status updated', 'user' => $user]);
    }
}
