<?php
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/', fn() => Inertia::render('Home'))->name('home');
    Route::get('/about', fn() => Inertia::render('About'))->name('about');

    Route::middleware('role:admin,staff')->group(function () {
        Route::get('/records', fn() => Inertia::render('ViewRecords', [
            'orders' => \App\Models\Order::with(['user','items.product'])->latest()->get(),
        ]))->name('records');
        Route::get('/orders/all', [OrderController::class, 'adminIndex'])->name('orders.admin');
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/reports', fn() => Inertia::render('Reports', [
            'orders'   => \App\Models\Order::with(['user','items.product'])->get(),
            'products' => \App\Models\Product::all(),
        ]))->name('reports');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    Route::middleware('role:customer')->group(function () {
        Route::get('/shop', fn() => Inertia::render('Shop', [
            'products' => \App\Models\Product::where('qty', '>', 0)->get(),
        ]))->name('shop');
        Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.mine');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    });
});
