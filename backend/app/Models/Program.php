<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Program extends Model
{
    protected $table = 'programs';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','title','level','description','subjects','icon','order'];

    protected function casts(): array
    {
        return ['subjects' => 'array'];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->id = $m->id ?: (string) Str::uuid());
    }
}
