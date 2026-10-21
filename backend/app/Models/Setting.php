<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';
    protected $fillable = [
        'key','brand_name','tagline','logo_url','hero_badge',
        'hero_title','hero_subtitle','hero_image','hero_cta','marquee_text',
        'about_eyebrow','about_title','about_description','about_image',
        'about_points','stats','whatsapp','whatsapp_message','email',
        'instagram','address','footer_text','footer_copyright','wa_reply_template',
    ];

    protected function casts(): array
    {
        return [
            'about_points' => 'array',
            'stats'        => 'array',
        ];
    }
}
