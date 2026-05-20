import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Leaf, ShieldCheck, BarChart2, Users } from 'lucide-react';

const FEATURES = [
    { icon: Leaf,        title: 'Farm Supply Management', desc: 'Complete inventory control for fertilizers, seeds, pesticides, tools, and more.' },
    { icon: ShieldCheck, title: 'Role-Based Access',      desc: 'Admin, Staff, and Customer roles with different permissions and views.' },
    { icon: BarChart2,   title: 'Reports & Analytics',    desc: 'Track sales, revenue, and inventory levels with clear visual reports.' },
    { icon: Users,       title: 'Order Management',       desc: 'Customers place orders; staff and admins approve or reject them.' },
];

export default function About() {
    return (
        <AuthenticatedLayout>
            <Head title="About — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-green-900 px-8 py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <span className="text-3xl">🌾</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">AgroSupply</h1>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        A farm supply management system built for Filipino agri-businesses.
                    </p>
                </div>

                <div className="px-8 py-10 max-w-4xl mx-auto space-y-8">
                    {/* Mission */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="font-bold text-xl text-gray-800 mb-3">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            AgroSupply aims to simplify the management of agricultural supplies for small to medium farm businesses.
                            From inventory tracking to order management, we help you focus on what matters — growing your harvest.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h2 className="font-bold text-xl text-gray-800 mb-5">Key Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {FEATURES.map(f => {
                                const Icon = f.icon;
                                return (
                                    <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5 text-green-700" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 mb-1">{f.title}</div>
                                            <div className="text-gray-500 text-sm leading-relaxed">{f.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Roles */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="font-bold text-xl text-gray-800 mb-5">User Roles</h2>
                        <div className="space-y-4">
                            {[
                                { role: 'Admin',    badge: 'bg-amber-400 text-black',   desc: 'Full access — manage products, view all orders, access reports and records.' },
                                { role: 'Staff',    badge: 'bg-emerald-400 text-black', desc: 'Can view dashboard, records, and reports. Cannot modify products.' },
                                { role: 'Customer', badge: 'bg-blue-400 text-black',    desc: 'Can browse the shop, place orders, and view their own order history.' },
                            ].map(r => (
                                <div key={r.role} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${r.badge}`}>{r.role}</span>
                                    <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
