#!/usr/bin/env bash
# Run this from inside ~/Downloads/agrosupply
set -e
GREEN='\033[0;32m'; NC='\033[0m'
info() { echo -e "${GREEN}[✔]${NC} $1"; }

mkdir -p resources/js/Layouts
mkdir -p resources/js/Pages/Products
mkdir -p resources/js/Pages/Orders

# ── AuthenticatedLayout ───────────────────────────────────────────────────────
cat > resources/js/Layouts/AuthenticatedLayout.jsx << 'JSEOF'
import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Home, LayoutDashboard, Package, ShoppingBag,
    ClipboardList, BookOpen, BarChart2, Info,
    LogOut, ChevronLeft, ChevronRight, Menu,
    ShoppingCart, X,
} from 'lucide-react';

const NAV_ITEMS = {
    admin: [
        { label: 'Home',         href: '/',          icon: Home            },
        { label: 'Dashboard',    href: '/dashboard', icon: LayoutDashboard },
        { label: 'Products',     href: '/products',  icon: Package         },
        { label: 'View Records', href: '/records',   icon: BookOpen        },
        { label: 'Reports',      href: '/reports',   icon: BarChart2       },
        { label: 'About',        href: '/about',     icon: Info            },
    ],
    staff: [
        { label: 'Home',         href: '/',          icon: Home            },
        { label: 'Dashboard',    href: '/dashboard', icon: LayoutDashboard },
        { label: 'Products',     href: '/products',  icon: Package         },
        { label: 'View Records', href: '/records',   icon: BookOpen        },
        { label: 'Reports',      href: '/reports',   icon: BarChart2       },
        { label: 'About',        href: '/about',     icon: Info            },
    ],
    customer: [
        { label: 'Home',      href: '/',          icon: Home          },
        { label: 'Shop',      href: '/shop',      icon: ShoppingBag   },
        { label: 'My Orders', href: '/my-orders', icon: ClipboardList },
        { label: 'About',     href: '/about',     icon: Info          },
    ],
};

const ROLE_BADGE = {
    admin:    'bg-amber-500 text-white',
    staff:    'bg-emerald-500 text-white',
    customer: 'bg-blue-500 text-white',
};

export default function AuthenticatedLayout({ children, cartCount = 0, onOpenCart }) {
    const { auth, url } = usePage().props;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = NAV_ITEMS[user.role] || NAV_ITEMS.customer;
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const handleLogout = () => router.post(route('logout'));
    const isActive = (href) => href === '/' ? url === '/' : url.startsWith(href);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-lg">🌾</span>
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <Link href="/" className="text-white font-bold text-lg tracking-tight leading-none block hover:text-green-300 transition-colors">
                            AgroSupply
                        </Link>
                        <div className="text-white/40 text-xs mt-0.5">Management System</div>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto text-white/40 hover:text-white/80 transition-colors hidden lg:flex"
                    title={collapsed ? 'Expand' : 'Collapse'}>
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => setMobileOpen(false)} className="ml-auto text-white/40 hover:text-white/80 lg:hidden">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 pb-2">Navigation</p>
                )}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                            title={collapsed ? item.label : undefined}
                            className={[
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full',
                                collapsed ? 'justify-center' : '',
                                active ? 'bg-white/15 text-white border border-white/10 shadow-sm'
                                       : 'text-white/60 hover:text-white hover:bg-white/8',
                            ].join(' ')}>
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                            {active && !collapsed && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                            )}
                        </Link>
                    );
                })}
                {user.role === 'customer' && onOpenCart && (
                    <>
                        {!collapsed && (
                            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 pt-4 pb-2">Quick Actions</p>
                        )}
                        <button onClick={() => { onOpenCart(); setMobileOpen(false); }}
                            title={collapsed ? 'Cart' : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all w-full relative ${collapsed ? 'justify-center' : ''}`}>
                            <ShoppingCart className="w-[18px] h-[18px] shrink-0" />
                            {!collapsed && <span>Cart</span>}
                            {cartCount > 0 && (
                                <span className={`absolute ${collapsed ? 'top-0 right-0' : 'right-3'} bg-amber-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center`}>
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </button>
                    </>
                )}
            </nav>

            <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-2">
                <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <div className="text-white text-sm font-semibold truncate leading-tight">{user.name}</div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${ROLE_BADGE[user.role]}`}>
                                {user.role}
                            </span>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} title={collapsed ? 'Logout' : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full ${collapsed ? 'justify-center' : ''}`}>
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <button onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-green-900 text-white rounded-lg flex items-center justify-center shadow-lg">
                <Menu className="w-5 h-5" />
            </button>
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
            )}
            <aside className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-green-900 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>
            <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-green-900 z-40 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
                style={{ boxShadow: '4px 0 24px rgba(10,26,14,0.3)' }}>
                <SidebarContent />
            </aside>
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`} />
            <main className="flex-1 min-w-0 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
JSEOF
info "AuthenticatedLayout.jsx written"

# ── Login ─────────────────────────────────────────────────────────────────────
cat > resources/js/Pages/Auth/Login.jsx << 'JSEOF'
import { useForm, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { useState } from 'react';

const FARM_IMAGE = 'https://images.unsplash.com/photo-1741717609690-07ef8c2dc7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';
const DEMO_ACCOUNTS = [
    { label: 'Admin',    email: 'admin@agro.com',    pw: 'password' },
    { label: 'Staff',    email: 'staff@agro.com',    pw: 'password' },
    { label: 'Customer', email: 'customer@agro.com', pw: 'password' },
];

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@agro.com', password: 'password', remember: false,
    });
    const [showPw, setShowPw] = useState(false);
    const submit = (e) => { e.preventDefault(); post(route('login')); };

    return (
        <>
            <Head title="Sign In — AgroSupply" />
            <div className="min-h-screen flex">
                <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-10">
                    <img src={FARM_IMAGE} alt="Farm" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a0e]/70 via-[#0a1a0e]/50 to-[#0a1a0e]/85" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                            <span className="text-xl">🌾</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">AgroSupply</span>
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <Leaf className="w-3.5 h-3.5 text-green-300" />
                            <span className="text-white/80 text-xs font-medium">Farm Supply Management</span>
                        </div>
                        <h1 className="text-4xl text-white font-bold leading-tight mb-4">
                            Smarter Supply,<br /><span className="text-yellow-300">Better Harvest</span>
                        </h1>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Manage inventory, track orders, and empower your agri-business.
                        </p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign in</h2>
                        <p className="text-gray-500 text-sm mb-8">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-green-600 font-semibold hover:underline">Register here</Link>
                        </p>
                        {status && (
                            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">{status}</div>
                        )}
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl bg-white focus:border-green-500 focus:outline-none"
                                    placeholder="you@example.com" required />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full h-11 px-4 pr-10 border-2 border-gray-200 rounded-xl bg-white focus:border-green-500 focus:outline-none"
                                        placeholder="Enter password" required />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <button type="submit" disabled={processing}
                                className="w-full h-11 bg-green-800 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                        <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-200">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Demo Access</p>
                            <div className="grid grid-cols-3 gap-2">
                                {DEMO_ACCOUNTS.map(acc => (
                                    <button key={acc.label} type="button"
                                        onClick={() => { setData('email', acc.email); setData('password', acc.pw); }}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                                            data.email === acc.email
                                                ? 'bg-green-500 text-white border-green-500'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-400'
                                        }`}>
                                        {acc.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-gray-400 text-xs mt-3">
                                Password for all: <code className="bg-gray-100 px-1.5 py-0.5 rounded">password</code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
JSEOF
info "Login.jsx written"

# ── Register ──────────────────────────────────────────────────────────────────
cat > resources/js/Pages/Auth/Register.jsx << 'JSEOF'
import { useForm, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'customer',
    });
    const [showPw, setShowPw] = useState(false);
    const submit = (e) => { e.preventDefault(); post(route('register')); };

    return (
        <>
            <Head title="Create Account — AgroSupply" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-green-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-green-600 font-semibold hover:underline">Sign in here</Link>
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                    placeholder="Juan dela Cruz" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                    placeholder="you@example.com" required />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full h-11 px-4 pr-10 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                        placeholder="Min. 8 characters" required />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                                <input type="password" value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                    placeholder="Repeat password" required />
                            </div>
                            <button type="submit" disabled={processing}
                                className="w-full h-11 bg-green-800 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
                                {processing ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
JSEOF
info "Register.jsx written"

# ── Stub pages ────────────────────────────────────────────────────────────────
write_stub() {
    local file="$1" title="$2" heading="$3" sub="$4"
    mkdir -p "$(dirname "$file")"
    cat > "$file" << JSEOF
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Page() {
    return (
        <AuthenticatedLayout>
            <Head title="${title} — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5">
                    <h1 className="font-bold text-xl text-gray-800">${heading}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">${sub}</p>
                </div>
                <div className="px-8 py-6 text-gray-500">Content coming soon.</div>
            </div>
        </AuthenticatedLayout>
    );
}
JSEOF
}

write_stub "resources/js/Pages/Home.jsx"        "Home"         "Home"         "Welcome to AgroSupply"
write_stub "resources/js/Pages/About.jsx"       "About"        "About"        "AgroSupply Management System"
write_stub "resources/js/Pages/Dashboard.jsx"   "Dashboard"    "Dashboard"    "Overview & statistics"
write_stub "resources/js/Pages/Shop.jsx"        "Shop"         "Shop"         "Browse available products"
write_stub "resources/js/Pages/ViewRecords.jsx" "View Records" "View Records" "All order records"
write_stub "resources/js/Pages/Reports.jsx"     "Reports"      "Reports"      "Sales & inventory reports"
write_stub "resources/js/Pages/Orders/MyOrders.jsx"    "My Orders"  "My Orders"  "Your order history"
write_stub "resources/js/Pages/Orders/AdminOrders.jsx" "All Orders" "All Orders" "Manage customer orders"
info "Stub pages written"

# ── Products pages ────────────────────────────────────────────────────────────
cat > resources/js/Pages/Products/Index.jsx << 'JSEOF'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { useState } from 'react';

const StockBadge = ({ qty }) => {
    if (qty === 0) return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>;
    if (qty <= 10) return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Low Stock</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">In Stock</span>;
};

export default function ProductsIndex({ products }) {
    const { auth, flash } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = () => {
        router.delete(route('products.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">Product Management</h1>
                        <p className="text-gray-500 text-sm mt-0.5">{products.length} products across all categories</p>
                    </div>
                    {isAdmin && (
                        <Link href={route('products.create')}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white h-10 px-5 rounded-xl font-semibold text-sm transition-all">
                            <Plus className="w-4 h-4" /> Add Product
                        </Link>
                    )}
                </div>
                <div className="px-8 py-6">
                    {flash?.success && (
                        <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">✓ {flash.success}</div>
                    )}
                    <div className="relative mb-5 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                                    {isAdmin && <th className="px-6 py-4" />}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-gray-400">
                                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />No products found.
                                    </td></tr>
                                ) : filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{p.icon || '📦'}</span>
                                                <div>
                                                    <div className="font-semibold text-gray-800">{p.name}</div>
                                                    {p.desc && <div className="text-gray-400 text-xs">{p.desc}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{p.category}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">₱{Number(p.price).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600">{p.qty} {p.unit}</td>
                                        <td className="px-6 py-4"><StockBadge qty={p.qty} /></td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{p.supplier || '—'}</td>
                                        {isAdmin && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Link href={route('products.edit', p.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                        <Pencil className="w-3 h-3" /> Edit
                                                    </Link>
                                                    <button onClick={() => setDeleteId(p.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )}
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
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Delete Product?</h3>
                        <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 h-10 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleDelete}
                                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
JSEOF

cat > resources/js/Pages/Products/Create.jsx << 'JSEOF'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Fertilizers','Pesticides','Seeds','Tools & Equipment','Soil Amendments','Irrigation','Animal Feed','Others'];
const UNITS = ['bags','liters','kg','pcs','boxes','sets','rolls'];

export default function ProductCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', category: 'Fertilizers', desc: '', price: '', qty: '', unit: 'bags', supplier: '', icon: '📦',
    });
    const submit = (e) => { e.preventDefault(); post(route('products.store')); };

    return (
        <AuthenticatedLayout>
            <Head title="Add Product — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
                    <Link href={route('products.index')} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">Add New Product</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Fill in the details below</p>
                    </div>
                </div>
                <div className="px-8 py-6 max-w-2xl">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="e.g. NPK Fertilizer 50kg" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                                    <select value={data.category} onChange={e => setData('category', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Icon (emoji)</label>
                                    <input type="text" value={data.icon} onChange={e => setData('icon', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-2xl" maxLength={4} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea value={data.desc} onChange={e => setData('desc', e.target.value)} rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (₱) <span className="text-red-500">*</span></label>
                                    <input type="number" min="0" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quantity <span className="text-red-500">*</span></label>
                                    <input type="number" min="0" value={data.qty} onChange={e => setData('qty', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
                                    <select value={data.unit} onChange={e => setData('unit', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none">
                                        {UNITS.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Supplier</label>
                                <input type="text" value={data.supplier} onChange={e => setData('supplier', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Link href={route('products.index')}
                                    className="flex-1 h-11 flex items-center justify-center border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</Link>
                                <button type="submit" disabled={processing}
                                    className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                                    {processing ? 'Saving...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
JSEOF

cat > resources/js/Pages/Products/Edit.jsx << 'JSEOF'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Fertilizers','Pesticides','Seeds','Tools & Equipment','Soil Amendments','Irrigation','Animal Feed','Others'];
const UNITS = ['bags','liters','kg','pcs','boxes','sets','rolls'];

export default function ProductEdit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name, category: product.category, desc: product.desc ?? '',
        price: product.price, qty: product.qty, unit: product.unit,
        supplier: product.supplier ?? '', icon: product.icon ?? '📦',
    });
    const submit = (e) => { e.preventDefault(); put(route('products.update', product.id)); };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Product — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
                    <Link href={route('products.index')} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">Edit Product</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Updating: {product.name}</p>
                    </div>
                </div>
                <div className="px-8 py-6 max-w-2xl">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                                    <select value={data.category} onChange={e => setData('category', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Icon</label>
                                    <input type="text" value={data.icon} onChange={e => setData('icon', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-2xl" maxLength={4} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea value={data.desc} onChange={e => setData('desc', e.target.value)} rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (₱)</label>
                                    <input type="number" min="0" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quantity</label>
                                    <input type="number" min="0" value={data.qty} onChange={e => setData('qty', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
                                    <select value={data.unit} onChange={e => setData('unit', e.target.value)}
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none">
                                        {UNITS.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Supplier</label>
                                <input type="text" value={data.supplier} onChange={e => setData('supplier', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Link href={route('products.index')}
                                    className="flex-1 h-11 flex items-center justify-center border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</Link>
                                <button type="submit" disabled={processing}
                                    className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
JSEOF
info "Products pages written"

# ── Build ─────────────────────────────────────────────────────────────────────
echo ""
echo "Running npm build..."
npm run build

echo ""
echo -e "${GREEN}━━━ All done! Refresh your browser. ━━━${NC}"
