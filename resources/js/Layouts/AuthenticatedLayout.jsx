import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Home, LayoutDashboard, Package, ShoppingBag, Users,
    ClipboardList, BookOpen, BarChart2, Info,
    LogOut, ChevronLeft, ChevronRight, Menu,
    ShoppingCart, X, Search,
} from 'lucide-react';

const NAV_ITEMS = {
    admin: [
        { label: 'Home',         href: '/',          icon: Home            },
        { label: 'Dashboard',    href: '/dashboard', icon: LayoutDashboard },
        { label: 'Products',     href: '/products',  icon: Package         },
        { label: 'View Records', href: '/records',   icon: BookOpen        },
        { label: 'Reports',      href: '/reports',   icon: BarChart2       },
        { label: 'Users',        href: '/users',     icon: Users           },
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
        { label: 'Search',    href: '#',         icon: Search,       action: 'search' },
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
    const { auth } = usePage().props;
    const url = usePage().url;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
                    if (item.action === 'search') {
                        return (
                            <button key={item.label} onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                                title={collapsed ? item.label : undefined}
                                className={[
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full',
                                    collapsed ? 'justify-center' : '',
                                    'text-white/60 hover:text-white hover:bg-white/8',
                                ].join(' ')}>
                                <Icon className="w-[18px] h-[18px] shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                        );
                    }
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

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Search Products</h2>
                                <button onClick={() => setSearchOpen(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 placeholder-gray-500"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (searchQuery.trim()) {
                                            router.visit(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                            setSearchOpen(false);
                                            setSearchQuery('');
                                        }
                                    }}
                                    disabled={!searchQuery.trim()}
                                    className="flex-1 h-11 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Search
                                </button>
                                <button
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="px-6 h-11 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
