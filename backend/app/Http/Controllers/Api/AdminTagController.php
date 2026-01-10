<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminTagController extends Controller
{
    public function index()
    {
        return response()->json(Tag::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:tags']);

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json($tag, 201);
    }

    public function destroy($id)
    {
        Tag::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
