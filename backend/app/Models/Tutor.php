<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tutor extends Model
{
    protected $table = 'tutors';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','name','subject','education','photo','bio','order'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->id = $m->id ?: (string) Str::uuid());
    }
}
