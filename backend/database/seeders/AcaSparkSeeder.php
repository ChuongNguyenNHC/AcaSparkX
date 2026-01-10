<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\LessonRating;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AcaSparkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create initial users
        $admin = User::firstOrCreate(
            ['email' => 'admin@acaspark.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $teacher = User::firstOrCreate(
            ['email' => 'teacher@acaspark.com'],
            [
                'name' => 'Giảng viên 1',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        $student = User::firstOrCreate(
            ['email' => 'student@acaspark.com'],
            [
                'name' => 'Học Viên A',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        // 2. Create Categories
        $categories = [
            'Công Nghệ Thông Tin' => 'Các khóa học về lập trình, mạng máy tính, và phần cứng.',
            'Thiết Kế Đồ Họa' => 'Học về Photoshop, Illustrator, UI/UX Design.',
            'Marketing' => 'Digital Marketing, SEO, Content Marketing.',
            'Ngoại Ngữ' => 'Tiếng Anh, Tiếng Nhật, Tiếng Hàn.',
            'Kỹ Năng Mềm' => 'Giao tiếp, thuyệt trình, quản lý thời gian.'
        ];

        $categoryIds = [];
        foreach ($categories as $name => $desc) {
            $cat = Category::firstOrCreate(
                ['name' => $name],
                [
                    'description' => $desc,
                    'slug' => Str::slug($name)
                ]
            );
            $categoryIds[$name] = $cat->id;
        }

        // 3. Create Tags
        $tagsList = [
            'Web Development',
            'Mobile App',
            'Data Science',
            'Machine Learning',
            'React',
            'VueJS',
            'Laravel',
            'Python',
            'Java',
            'C#',
            'UI/UX',
            'Figma',
            'Photoshop',
            'English'
        ];

        $tagIds = [];
        foreach ($tagsList as $tagName) {
            $tag = Tag::firstOrCreate(
                ['name' => $tagName],
                ['slug' => Str::slug($tagName)]
            );
            $tagIds[] = $tag->id;
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
            ],
            [
                'title' => 'Lập trình PHP từ cơ bản đến nâng cao',
                'description' => 'Khóa học toàn diện về PHP, từ cú pháp cơ bản đến xây dựng ứng dụng web động với Laravel.',
                'thumbnail' => 'https://res.cloudinary.com/djrjaueb0/image/upload/v1767966443/php_course_thumbnail_btvl4f.jpg',
                'lessons' => [
                    [
                        'title' => 'Giới thiệu về PHP',
                        'video_url' => 'https://res.cloudinary.com/demo/video/upload/v1574737230/dog.mp4',
                        'rating' => 4.8,
                        'order' => 1
                    ],
                    [
                        'title' => 'Cài đặt môi trường XAMPP',
                        'video_url' => 'https://res.cloudinary.com/demo/video/upload/v1574737210/elephants.mp4',
                        'rating' => 4.6,
                        'order' => 2
                    ],
                ]
            ]
        ];

<<<<<<< Updated upstream
        foreach ($courses as $cData) {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
            $course = Course::create([
                'instructor_id' => $teacher->id,
                'title' => $cData['title'],
                'description' => $cData['description'],
                'thumbnail' => $cData['thumbnail'],
                'status' => 'published',
            ]);
<<<<<<< Updated upstream
=======
=======
        foreach ($courses as $index => $cData) {
            // Assign a random category if available, or default
            $catKey = array_rand($categoryIds);
            $catId = $categoryIds[$catKey] ?? null;

>>>>>>> Stashed changes
>>>>>>> Stashed changes
            $course = Course::firstOrCreate(
                ['title' => $cData['title']],
                [
                    'instructor_id' => $teacher->id,
                    'description' => $cData['description'],
                    'thumbnail' => $cData['thumbnail'],
                    'status' => 'published',
<<<<<<< Updated upstream
                ]
            );
=======
<<<<<<< Updated upstream
                ]
            );
=======
                    'category_id' => $catId // Link category
                ]
            );
>>>>>>> Stashed changes

            // Sync random tags
            if (!empty($tagIds)) {
                $randomTagKeys = array_rand($tagIds, rand(1, 3)); // 1 to 3 random tags
                $randomTagKeys = is_array($randomTagKeys) ? $randomTagKeys : [$randomTagKeys];
                $tagsToSync = [];
                foreach ($randomTagKeys as $key) {
                    $tagsToSync[] = $tagIds[$key];
                }
                $course->tags()->sync($tagsToSync);
            }
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes

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
