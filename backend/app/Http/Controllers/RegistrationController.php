<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = Registration::orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('paginate') && filter_var($request->paginate, FILTER_VALIDATE_BOOLEAN)) {
            $perPage = (int) ($request->per_page ?? 20);
            return response()->json($query->paginate($perPage));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:30',
            'level'   => 'nullable|string|max:100',
            'program' => 'nullable|string|max:255',
            'package' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        $reg = Registration::create($data);
        return response()->json($reg, 201);
    }

    public function update(Request $request, string $id)
    {
        $reg = Registration::findOrFail($id);
        $reg->update($request->only(['status']));
        return response()->json($reg->fresh());
    }

    public function destroy(string $id)
    {
        Registration::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }

    public function summary()
    {
        return response()->json([
            'total'      => Registration::count(),
            'baru'       => Registration::where('status', 'baru')->count(),
            'dihubungi'  => Registration::where('status', 'dihubungi')->count(),
        ]);
    }
}
