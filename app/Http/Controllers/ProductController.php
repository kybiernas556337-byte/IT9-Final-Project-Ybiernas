<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProductController extends Controller
{
    private function uploadToCloudinary($file): string
    {
        $cloudName = config('cloudinary.cloud_name');
        $apiKey    = config('cloudinary.api_key');
        $apiSecret = config('cloudinary.api_secret');
        $folder    = config('cloudinary.folder', 'agrosupply/products');
        $timestamp = time();

        $params = [
            'folder'    => $folder,
            'timestamp' => $timestamp,
        ];
        ksort($params);
        $paramString = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
        $signature   = sha1($paramString . $apiSecret);

        $response = Http::attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'api_key'   => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder'    => $folder,
        ]);

        if (!$response->successful()) {
            throw new \Exception('Cloudinary upload failed: ' . $response->body());
        }

        return $response->json('secure_url');
    }

    private function deleteFromCloudinary(string $imageUrl): void
    {
        try {
            $cloudName = config('cloudinary.cloud_name');
            $apiKey    = config('cloudinary.api_key');
            $apiSecret = config('cloudinary.api_secret');

            // Extract public_id from URL
            // e.g. https://res.cloudinary.com/demo/image/upload/v123/agrosupply/products/abc.jpg
            // public_id = agrosupply/products/abc
            preg_match('/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i', $imageUrl, $matches);
            if (empty($matches[1])) return;

            $publicId  = $matches[1];
            $timestamp = time();
            $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");

            Http::post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                'public_id' => $publicId,
                'api_key'   => $apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
            ]);
        } catch (\Exception $e) {
            // Non-fatal — just log and continue
            \Log::warning('Cloudinary delete failed: ' . $e->getMessage());
        }
    }

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
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->uploadToCloudinary($request->file('image'));
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
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                $this->deleteFromCloudinary($product->image_path);
            }
            $validated['image_path'] = $this->uploadToCloudinary($request->file('image'));
        }

        unset($validated['image']);
        $product->update($validated);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->image_path) {
            $this->deleteFromCloudinary($product->image_path);
        }
        $product->delete();
        return redirect()->route('products.index');
    }
}
