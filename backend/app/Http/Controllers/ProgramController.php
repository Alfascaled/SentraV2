<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json(Program::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'level'       => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'subjects'    => 'nullable|array',
            'icon'        => 'nullable|string|max:50',
            'order'       => 'nullable|integer',
        ]);
        return response()->json(Program::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $program = Program::findOrFail($id);
        $program->update($request->all());
        return response()->json($program->fresh());
    }

    public function destroy(string $id)
    {
        Program::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
