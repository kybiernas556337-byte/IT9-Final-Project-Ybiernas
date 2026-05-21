<?php
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

Route::get('/clear-all', function() {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    return 'All cleared!';
});

Route::get('/test-login', function() {
    $user = \App\Models\User::where('email', 'admin@agro.com')->first();
    if (!$user) return 'USER NOT FOUND IN DATABASE';
    
    $check = \Illuminate\Support\Facades\Hash::check('password', $user->password);
    return [
        'user_found' => true,
        'role' => $user->role,
        'password_matches' => $check,
        'password_hash' => substr($user->password, 0, 20),
        'db_host' => env('DB_HOST'),
        'db_name' => env('DB_DATABASE'),
    ];
});
Route::get('/fix-password', function() {
    $users = \App\Models\User::all();
    foreach($users as $user) {
        $user->update(['password' => \Illuminate\Support\Facades\Hash::make('password123')]);
    }
    return 'All ' . $users->count() . ' passwords updated! Login with password: password123';
});

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
