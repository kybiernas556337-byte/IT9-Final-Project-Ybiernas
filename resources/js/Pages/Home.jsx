import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, ShoppingBag, BarChart2, ClipboardList, ArrowRight, Star, Truck, Shield, Users } from 'lucide-react';

export default function Home() {
    const { auth } = usePage().props;
    const user = auth.user;

    const adminCards = [
        { icon: '📊', label: 'Dashboard',    desc: 'View stats & overview',         href: '/dashboard', color: 'bg-green-50 border-green-200' },
        { icon: '📦', label: 'Products',     desc: 'Manage inventory & products',   href: '/products',  color: 'bg-blue-50 border-blue-200'  },
        { icon: '📋', label: 'View Records', desc: 'Browse all order records',      href: '/records',   color: 'bg-purple-50 border-purple-200' },
        { icon: '📈', label: 'Reports',      desc: 'Sales & inventory reports',     href: '/reports',   color: 'bg-amber-50 border-amber-200'  },
    ];
    const customerCards = [
        { icon: '🛒', label: 'Shop',      desc: 'Browse & order farm supplies', href: '/shop',      color: 'bg-green-50 border-green-200'  },
        { icon: '📋', label: 'My Orders', desc: 'Track your order history',     href: '/my-orders', color: 'bg-blue-50 border-blue-200'    },
        { icon: 'ℹ️',  label: 'About',    desc: 'Learn about AgroSupply',       href: '/about',     color: 'bg-purple-50 border-purple-200'},
    ];

    const cards = user.role === 'customer' ? customerCards : adminCards;

    const stats = [
        { icon: Package, label: 'Products Available', value: '500+', color: 'text-green-600' },
        { icon: ShoppingBag, label: 'Orders Completed', value: '2,500+', color: 'text-blue-600' },
        { icon: Users, label: 'Happy Farmers', value: '1,200+', color: 'text-purple-600' },
        { icon: Star, label: 'Rating', value: '4.8/5', color: 'text-amber-600' },
    ];

    const features = [
        {
            icon: Truck,
            title: 'Fast Delivery',
            desc: 'Quick and reliable delivery to your farm location across the Philippines.'
        },
        {
            icon: Shield,
            title: 'Quality Assured',
            desc: 'All products are sourced from trusted suppliers with quality guarantees.'
        },
        {
            icon: BarChart2,
            title: 'Easy Ordering',
            desc: 'Simple and intuitive ordering process with real-time inventory tracking.'
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Home — AgroSupply" />
            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="relative bg-green-900 px-8 py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-800/90 to-green-700/85"></div>
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-25"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
                        }}
                    ></div>
                    <div className="relative max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">AgroSupply</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                            Welcome back, {user.name.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-white/80 text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                            {user.role === 'customer'
                                ? 'Your trusted partner for quality farm supplies. Browse our extensive catalog and place orders with ease.'
                                : 'Manage products, orders, and reports from your comprehensive dashboard.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold capitalize ${
                                user.role === 'admin' ? 'bg-amber-400 text-black' :
                                user.role === 'staff' ? 'bg-emerald-400 text-black' : 'bg-blue-400 text-black'
                            }`}>
                                {user.role} Account
                            </span>
                            {user.role === 'customer' && (
                                <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-green-900 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg">
                                    Start Shopping <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                {user.role === 'customer' && (
                    <div className="px-8 py-12 bg-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by Farmers Nationwide</h2>
                                <p className="text-gray-600 text-lg">Join thousands of satisfied farmers who rely on AgroSupply</p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-gray-600 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick access cards */}
                <div className="px-8 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Access</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {cards.map(card => (
                                <Link key={card.label} href={card.href}
                                    className={`group flex flex-col gap-4 p-6 rounded-2xl border-2 ${card.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                                    <span className="text-4xl">{card.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 group-hover:text-green-700 transition-colors text-lg">{card.label}</div>
                                        <div className="text-gray-500 text-sm mt-1">{card.desc}</div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                {user.role === 'customer' && (
                    <div className="px-8 py-12 bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose AgroSupply?</h2>
                                <p className="text-gray-600 text-lg">Experience the difference with our farmer-first approach</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <feature.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* About strip */}
                <div className="px-8 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">About AgroSupply</h3>
                                    <p className="text-gray-600 text-lg">Your one-stop farm supply management system for the Philippines. Serving farmers with quality products and exceptional service since 2020.</p>
                                </div>
                                <Link href="/about" className="shrink-0 inline-flex items-center gap-3 bg-green-800 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                                    Learn more <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
