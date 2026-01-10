<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Mail\ResetPasswordCodeMail;
class ForgotPasswordController extends Controller
{
    public function sendOtp(Request $request)
    {
        // 1. Kiểm tra email có tồn tại không
        $request->validate(['email' => 'required|email|exists:users,email']);

        // 2. Tạo mã OTP 6 số ngẫu nhiên
        $otp = rand(100000, 999999);

        // 3. Lưu vào bảng password_reset_codes (bảng bạn vừa migrate)
        // Chúng ta dùng updateOrInsert để nếu gửi lại lần 2 sẽ đè lên mã cũ
        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $request->email],
            [
                'otp' => $otp, // Nếu muốn bảo mật hơn hãy dùng Hash::make($otp)
                'created_at' => Carbon::now()
            ]
        );

        // 4. Gửi Mail (Vì bạn để MAIL_MAILER=log nên nó sẽ ghi vào file log)
        Mail::to($request->email)->send(new ResetPasswordCodeMail($otp));

        return response()->json(['message' => 'Mã OTP đã được gửi (Kiểm tra storage/logs/laravel.log)']);
    }

    public function resetPassword(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6',
            'password' => 'required|min:8|confirmed', // password_confirmation phải khớp
        ]);

        // 2. Tìm mã OTP trong bảng password_reset_codes
        $otpData = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('otp', $request->otp) // Nếu lúc gửi bạn dùng Hash::make thì ở đây dùng Hash::check
            ->first();

        // 3. Kiểm tra mã có đúng không
        if (!$otpData) {
            return response()->json(['message' => 'Mã OTP không chính xác.'], 400);
        }

        // 4. Kiểm tra mã có hết hạn chưa (ví dụ 5 phút)
        if (Carbon::parse($otpData->created_at)->addMinutes(5)->isPast()) {
            return response()->json(['message' => 'Mã OTP đã hết hạn.'], 400);
        }

        // 5. Cập nhật mật khẩu mới cho User
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // 6. Xóa mã OTP đã sử dụng để bảo mật
        DB::table('password_reset_codes')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công!']);
    }
}
