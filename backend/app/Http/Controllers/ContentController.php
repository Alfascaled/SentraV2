<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Program;
use App\Models\Tutor;
use App\Models\Package;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function show(): JsonResponse
    {
        $setting = Setting::where('key', 'site')->first();

        return response()->json([
            'settings' => $setting,
            'programs' => Program::orderBy('order')->get(),
            'tutors'   => Tutor::orderBy('order')->get(),
            'packages' => Package::orderBy('order')->get(),
            'faqs'     => Faq::orderBy('order')->get(),
        ]);
    }
}
