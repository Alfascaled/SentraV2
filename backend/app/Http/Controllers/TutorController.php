<?php

namespace App\Http\Controllers;

use App\Models\Tutor;
use Illuminate\Http\Request;

class TutorController extends Controller
{
    public function index()
    {
        return response()->json(Tutor::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'subject'   => 'nullable|string|max:255',
            'education' => 'nullable|string|max:255',
            'photo'     => 'nullable|string',
            'bio'       => 'nullable|string',
            'order'     => 'nullable|integer',
        ]);
        return response()->json(Tutor::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $tutor = Tutor::findOrFail($id);
        $tutor->update($request->all());
        return response()->json($tutor->fresh());
    }

    public function destroy(string $id)
    {
        Tutor::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
