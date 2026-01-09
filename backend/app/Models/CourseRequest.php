<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id',
        'course_id',
        'title',
        'description',
        'status',
        'video_url',
        'admin_note',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
