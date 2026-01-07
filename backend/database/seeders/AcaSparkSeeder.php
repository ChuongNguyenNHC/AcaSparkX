<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\LessonRating;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AcaSparkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $instructor = User::first();
        $student = User::first();

        if (!$instructor) {
            $this->command->warn('No users found. Please register a user first before seeding courses.');
            return;
        }

        $courses = [
            [
                'title' => 'Lập trình C# cơ bản đến nâng cao',
                'description' => 'Khóa học giúp bạn làm chủ ngôn ngữ C# và .NET Framework thông qua các dự án thực tế.',
                'thumbnail' => 'https://res.cloudinary.com/djrjaueb0/image/upload/v1767797004/csharp_z1cxkn.jpg',
                'lessons' => [
                    [
                        'title' => 'Giới thiệu về C#',
                        'video_url' => 'https://res.cloudinary.com/demo/video/upload/v1574737230/dog.mp4',
                        'rating' => 4.8,
                        'order' => 1
                    ],
                    [
                        'title' => 'Cài đặt Visual Studio',
                        'video_url' => 'https://res.cloudinary.com/demo/video/upload/v1574737210/elephants.mp4',
                        'rating' => 4.5,
                        'order' => 2
                    ],
                ]
            ],
            [
                'title' => 'Phân tích dữ liệu với Python',
                'description' => 'Học Python từ con số 0 và ứng dụng vào phân tích dữ liệu chuyên nghiệp với Pandas, Numpy.',
                'thumbnail' => 'https://res.cloudinary.com/djrjaueb0/image/upload/v1767797004/python_ptxin7.jpg',
                'lessons' => [
                    [
                        'title' => 'Tại sao chọn Python?',
                        'video_url' => 'https://res.cloudinary.com/demo/video/upload/v1574737190/sea_turtle.mp4',
                        'rating' => 4.9,
                        'order' => 1
                    ],
                ]
            ],
            [
                'title' => 'Lập trình C++ chuyên sâu',
                'description' => 'Khám phá thế giới C++ từ quản lý bộ nhớ đến các kỹ thuật lập trình hệ thuật lập trình hệ thống hiệu năng cao.',
                'thumbnail' => 'https://res.cloudinary.com/djrjaueb0/image/upload/v1767797004/cpp_stcpk4.jpg',
                'lessons' => [
                    [
                        'title' => 'Nguyên lý C++ và quản lý bộ nhớ',
                        'video_url' => 'https://res.cloudinary.com/demo/video/upload/v1574737230/dog.mp4',
                        'rating' => 4.7,
                        'order' => 1
                    ],
                ]
            ]
        ];

        foreach ($courses as $cData) {
            $course = Course::create([
                'instructor_id' => $instructor->id,
                'title' => $cData['title'],
                'description' => $cData['description'],
                'thumbnail' => $cData['thumbnail'],
                'status' => 'published',
            ]);

            foreach ($cData['lessons'] as $lData) {
                $lesson = Lesson::create([
                    'course_id' => $course->id,
                    'title' => $lData['title'],
                    'description' => 'Nội dung chi tiết cho bài học: ' . $lData['title'],
                    'video_url' => $lData['video_url'],
                    'rating' => $lData['rating'],
                    'order' => $lData['order'],
                ]);

                LessonRating::create([
                    'user_id' => $student->id,
                    'lesson_id' => $lesson->id,
                    'stars' => rand(4, 5),
                    'comment' => 'Bài học rất hay và bổ ích!',
                ]);
            }

            Enrollment::create([
                'user_id' => $student->id,
                'course_id' => $course->id,
                'enroll_date' => now(),
                'progress' => 0,
            ]);
        }
    }
}
