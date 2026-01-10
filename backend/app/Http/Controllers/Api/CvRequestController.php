<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CvRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CvRequestController extends Controller
{
    // Student submits a CV request
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cv_image' => 'required|image|mimes:jpeg,png,jpg|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();

            // Check if user already has a pending request
            $existingRequest = CvRequest::where('user_id', $user->id)
                ->where('status', 0)
                ->first();

            if ($existingRequest) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bạn đang có yêu cầu chờ duyệt. Vui lòng đợi quản trị viên xử lý.'
                ], 400);
            }

            $imageUrl = null;
            if ($request->hasFile('cv_image')) {
                $file = $request->file('cv_image');
                $filename = time() . '_' . Str::slug($user->name) . '_cv.' . $file->getClientOriginalExtension();
                $file->move(public_path('cvs'), $filename);
                $imageUrl = '/cvs/' . $filename;
            }

            $cvRequest = CvRequest::create([
                'user_id' => $user->id,
                'image_url' => $imageUrl,
                'status' => 0
            ]);

            // Update user status to indicate pending teacher approval?
            // Existing logic uses 'status' column in users table or just relies on the request table.
            // StudentManagement.jsx filtered by 'pending_teacher' status on User model.
            // So we should probably update User status to 'pending_teacher'.
            $user->status = 'pending_teacher';
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Gửi yêu cầu thành công. Vui lòng đợi xét duyệt.',
                'data' => $cvRequest
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // Admin: List all pending requests
    public function indexAdmin(Request $request)
    {
        $requests = CvRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $requests
        ]);
    }

    // Admin: Approve Request
    public function approve($id)
    {
        $cvRequest = CvRequest::findOrFail($id);

        if ($cvRequest->status != 0) {
            return response()->json(['status' => 'error', 'message' => 'Yêu cầu này đã được xử lý.'], 400);
        }

        $user = User::find($cvRequest->user_id);
        if ($user) {
            $user->role = 'teacher';
            $user->status = 'active'; // Clear 'pending_teacher' status
            $user->save();
        }

        $cvRequest->status = 1;
        $cvRequest->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã duyệt yêu cầu lên Giảng viên.'
        ]);
    }

    // Admin: Reject Request
    public function reject($id)
    {
        $cvRequest = CvRequest::findOrFail($id);

        if ($cvRequest->status != 0) {
            return response()->json(['status' => 'error', 'message' => 'Yêu cầu này đã được xử lý.'], 400);
        }

        $user = User::find($cvRequest->user_id);
        if ($user) {
            $user->status = 'active'; // Revert to active student
            // role remains 'student'
            $user->save();
        }

        $cvRequest->status = 2;
        $cvRequest->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã từ chối yêu cầu.'
        ]);
    }
}
