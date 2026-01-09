<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Course::with(['instructor', 'category', 'tags', 'teachers']);

            if ($request->search) {
                $query->where('title', 'like', '%' . $request->search . '%');
            }

            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            return response()->json($query->paginate(10));
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function approve($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'published']); // Assuming 'published' is the active status
        return response()->json(['message' => 'Course approved', 'course' => $course]);
    }

    public function reject($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'rejected']);
        return response()->json(['message' => 'Course rejected', 'course' => $course]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $path = null;
            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('thumbnails', 'public');
            }

            $course = Course::create([
                'title' => $request->title,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'instructor_id' => auth()->id(), // Admin defaults as instructor or we can let them choose
                'thumbnail' => $path,
                'status' => 'draft'
            ]);

            if ($request->has('tags')) {
                // tags can be comma separated string or array
                $tags = is_string($request->tags) ? explode(',', $request->tags) : $request->tags;
                $course->tags()->sync($tags);
            }

            if ($request->has('teachers')) {
                $teachers = is_string($request->teachers) ? explode(',', $request->teachers) : $request->teachers;
                $course->teachers()->sync($teachers);
            }

            return response()->json($course, 201);

        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $course = Course::findOrFail($id);

            $data = $request->only(['title', 'description', 'category_id', 'is_featured', 'status']);

            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('thumbnails', 'public');
                $data['thumbnail'] = $path;
            }

            $course->update($data);

            if ($request->has('tags')) {
                $course->tags()->sync($request->tags);
            }

            if ($request->has('teachers')) {
                $course->teachers()->sync($request->teachers);
            }

            return response()->json([
                'message' => 'Course updated',
                'course' => $course->load(['category', 'tags', 'teachers'])
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getTeachers()
    {
        $teachers = \App\Models\User::where('role', 'teacher')->select('id', 'name', 'email')->get();
        return response()->json($teachers);
    }
}
