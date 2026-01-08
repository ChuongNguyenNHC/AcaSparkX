<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('status')->default('pending');
            $table->string('video_url')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_requests');
    }
};
