<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_teacher', function (Blueprint $table) {
            $table->foreignUuid('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignUuid('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->primary(['course_id', 'teacher_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_teacher');
    }
};
