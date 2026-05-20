#!/usr/bin/env bash
set -e
GREEN='\033[0;32m'; NC='\033[0m'
info() { echo -e "${GREEN}[✔]${NC} $1"; }

if [ ! -f "artisan" ]; then
    echo "❌  Run this from your Laravel project root (where artisan lives)."
    exit 1
fi

cat > app/Http/Controllers/UserController.php << 'EOF'
<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::latest()->get(),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,staff,customer']);
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot change your own role.');
        }
        $user->update(['role' => $request->role]);
        return back()->with('success', "Role updated to {$request->role} for {$user->name}.");
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        $user->delete();
        return back()->with('success', "{$user->name} has been deleted.");
    }
}
EOF
info "UserController written"

cat > routes/web.php << 'EOF'
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
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/records', fn() => Inertia::render('ViewRecords', [
            'orders' => \App\Models\Order::with(['user','items.product'])->latest()->get(),
        ]))->name('records');
        Route::get('/reports', fn() => Inertia::render('Reports', [
            'orders'   => \App\Models\Order::with(['user','items.product'])->get(),
            'products' => \App\Models\Product::all(),
        ]))->name('reports');
        Route::get('/orders/all', [OrderController::class, 'adminIndex'])->name('orders.admin');
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
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
EOF
info "routes/web.php updated"

python3 - << 'PYEOF'
path = "resources/js/Layouts/AuthenticatedLayout.jsx"
with open(path, "r") as f:
    src = f.read()

src = src.replace(
    "    Home, LayoutDashboard, Package, ShoppingBag,\n    ClipboardList, BookOpen, BarChart2, Info,",
    "    Home, LayoutDashboard, Package, ShoppingBag, Users,\n    ClipboardList, BookOpen, BarChart2, Info,"
, 1)

src = src.replace(
    "        { label: 'About',        href: '/about',     icon: Info            },",
    "        { label: 'Users',        href: '/users',     icon: Users           },\n        { label: 'About',        href: '/about',     icon: Info            },"
, 1)

with open(path, "w") as f:
    f.write(src)
print("AuthenticatedLayout.jsx patched")
PYEOF
info "Sidebar updated"

mkdir -p resources/js/Pages/Users
cat > resources/js/Pages/Users/Index.jsx << 'EOF'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const ROLE_BADGE = {
    admin:    'bg-amber-100 text-amber-700 border-amber-200',
    staff:    'bg-emerald-100 text-emerald-700 border-emerald-200',
    customer: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function UsersIndex({ users }) {
    const { auth, flash } = usePage().props;
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const changeRole = (user, role) => {
        router.patch(route('users.role', user.id), { role });
    };

    const handleDelete = () => {
        router.delete(route('users.destroy', deleteId), {
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">User Management</h1>
                        <p className="text-gray-500 text-sm mt-0.5">{users.length} registered users</p>
                    </div>
                </div>

                <div className="px-8 py-6">
                    {flash?.success && (
                        <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                            ✓ {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            ✗ {flash.error}
                        </div>
                    )}

                    <div className="relative mb-5 max-w-sm">
                        <input type="text" placeholder="Search users..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full h-10 pl-4 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Change Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                                <div className="font-semibold text-gray-800">
                                                    {user.name}
                                                    {user.id === auth.user.id && (
                                                        <span className="ml-2 text-xs text-gray-400">(you)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${ROLE_BADGE[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.id !== auth.user.id ? (
                                                <select
                                                    value={user.role}
                                                    onChange={e => changeRole(user, e.target.value)}
                                                    className="h-8 px-3 border-2 border-gray-200 rounded-lg text-xs font-semibold focus:border-green-500 focus:outline-none"
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="staff">Staff</option>
                                                    <option value="customer">Customer</option>
                                                </select>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Cannot change own role</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.id !== auth.user.id && (
                                                <button onClick={() => setDeleteId(user.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Delete User?</h3>
                        <p className="text-gray-500 text-sm mb-6">This will permanently delete the user and all their orders.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 h-10 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
EOF
info "Users/Index.jsx written"

echo ""
echo -e "${GREEN}━━━ Done! Now run: npm run build ━━━${NC}"
echo "Then visit /users while logged in as admin."
