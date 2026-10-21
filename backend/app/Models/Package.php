<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Package extends Model
{
    protected $table = 'packages';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id','name','sessions','price','price_sd','price_smp','price_sma',
        'duration','description','features','popular','order',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'popular'  => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->id = $m->id ?: (string) Str::uuid());
    }
}
