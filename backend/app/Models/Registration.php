<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Registration extends Model
{
    protected $table = 'registrations';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','name','phone','level','program','package','message','status'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->id = $m->id ?: (string) Str::uuid());
    }
}
