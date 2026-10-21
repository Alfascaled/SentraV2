<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show()
    {
        $setting = Setting::where('key', 'site')->first();
        return response()->json($setting);
    }

    public function update(Request $request)
    {
        $setting = Setting::where('key', 'site')->first();

        if (!$setting) {
            $setting = Setting::create(array_merge(['key' => 'site'], $request->all()));
        } else {
            $setting->update($request->all());
        }

        return response()->json($setting->fresh());
    }
}
