<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        return response()->json(Package::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'sessions'    => 'nullable|integer',
            'price'       => 'nullable|integer',
            'price_sd'    => 'nullable|integer',
            'price_smp'   => 'nullable|integer',
            'price_sma'   => 'nullable|integer',
            'duration'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'features'    => 'nullable|array',
            'popular'     => 'nullable|boolean',
            'order'       => 'nullable|integer',
        ]);
        return response()->json(Package::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $package = Package::findOrFail($id);
        $package->update($request->all());
        return response()->json($package->fresh());
    }

    public function destroy(string $id)
    {
        Package::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
