<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseRequestController extends Controller
{
    public function index(Request $request)
    {
        // Get requests for the current user
        $requests = CourseRequest::where('instructor_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $requests
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $courseRequest = CourseRequest::create([
            'instructor_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Yêu cầu tạo khóa học đã được gửi',
            'data' => $courseRequest
        ], 201);
    }
}
