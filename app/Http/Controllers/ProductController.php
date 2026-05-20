<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Product::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'desc'     => 'nullable|string|max:1000',
            'price'    => 'required|numeric|min:0.01',
            'qty'      => 'required|integer|min:0',
            'unit'     => 'required|string|max:100',
            'supplier' => 'nullable|string|max:255',
            'icon'     => 'nullable|string|max:255',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        unset($validated['image']);
        Product::create($validated);

        return redirect()->route('products.index');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'desc'     => 'nullable|string|max:1000',
            'price'    => 'required|numeric|min:0.01',
            'qty'      => 'required|integer|min:0',
            'unit'     => 'required|string|max:100',
            'supplier' => 'nullable|string|max:255',
            'icon'     => 'nullable|string|max:255',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        unset($validated['image']);
        $product->update($validated);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        $product->delete();
        return redirect()->route('products.index');
    }
}
