<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        return response()->json(Faq::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => 'required|string',
            'answer'   => 'nullable|string',
            'order'    => 'nullable|integer',
        ]);
        return response()->json(Faq::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $faq = Faq::findOrFail($id);
        $faq->update($request->all());
        return response()->json($faq->fresh());
    }

    public function destroy(string $id)
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
