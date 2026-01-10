<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

try {
    echo "--- DATABASE DEBUG ---\n";
    echo "Database: " . DB::connection()->getDatabaseName() . "\n";

    // Check Tables
    $tables = DB::select('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
    echo "Tables found: " . count($tables) . "\n";
    foreach ($tables as $t) {
        echo " - " . $t->tablename . "\n";
    }

    echo "\nChecking 'tags' table: ";
    if (Schema::hasTable('tags')) {
        echo "EXISTS ✅\n";
    } else {
        echo "MISSING ❌\n";

        // Attempt to fix manually
        echo "Attempting to create 'tags' table manually...\n";
        Schema::create('tags', function ($table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });
        echo "'tags' table created.\n";
    }

    echo "\nChecking 'course_tag' table: ";
    if (Schema::hasTable('course_tag')) {
        echo "EXISTS ✅\n";
    } else {
        echo "MISSING ❌\n";

        echo "Attempting to create 'course_tag' table manually...\n";
        Schema::create('course_tag', function ($table) {
            $table->foreignUuid('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->primary(['course_id', 'tag_id']);
        });
        echo "'course_tag' table created.\n";
    }

    echo "\nChecking 'categories' table: ";
    if (Schema::hasTable('categories')) {
        echo "EXISTS ✅\n";
    } else {
        echo "MISSING ❌\n";

        echo "Attempting to create 'categories' table manually...\n";
        Schema::create('categories', function ($table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->timestamps();
        });
        echo "'categories' table created.\n";
    }

    echo "\nChecking 'course_teacher' table: ";
    if (Schema::hasTable('course_teacher')) {
        echo "EXISTS ✅\n";
    } else {
        echo "MISSING ❌\n";

        echo "Attempting to create 'course_teacher' table manually...\n";
        Schema::create('course_teacher', function ($table) {
            $table->foreignUuid('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignUuid('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->primary(['course_id', 'teacher_id']);
            $table->timestamps();
        });
        echo "'course_teacher' table created.\n";
    }

    echo "\n--- DONE ---\n";

} catch (\Throwable $e) {
    echo "\nERROR: " . $e->getMessage() . "\n";
}
