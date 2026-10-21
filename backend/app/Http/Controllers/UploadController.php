<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120', // 5MB max
        ]);

        $file = $request->file('file');
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads', $name, 'public');
        $url  = asset('storage/' . $path);

        return response()->json([
            'url'      => $url,
            'filename' => $name,
            'original' => $file->getClientOriginalName(),
        ], 201);
    }
}
