<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Registration;
use App\Models\Program;
use App\Models\Tutor;
use App\Models\Package;
use App\Models\Faq;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function summary()
    {
        return response()->json([
            'total'     => Registration::count(),
            'baru'      => Registration::where('status', 'baru')->count(),
            'dihubungi' => Registration::where('status', 'dihubungi')->count(),
            'counts'    => [
                'programs'           => Program::count(),
                'tutors'             => Tutor::count(),
                'packages'           => Package::count(),
                'faqs'               => Faq::count(),
                'registrations'      => Registration::count(),
                'registrations_baru' => Registration::where('status', 'baru')->count(),
            ],
            'latest_registrations' => Registration::orderBy('created_at', 'desc')->take(5)->get(),
        ]);
    }

    public function getWhatsapp(Request $request)
    {
        $admin = $request->user();
        return response()->json(['admin_whatsapp' => $admin->admin_whatsapp]);
    }

    public function updateWhatsapp(Request $request)
    {
        $request->validate(['admin_whatsapp' => 'required|string|max:30']);
        $admin = $request->user();
        $admin->update(['admin_whatsapp' => $request->admin_whatsapp]);
        return response()->json(['admin_whatsapp' => $admin->admin_whatsapp]);
    }
}
