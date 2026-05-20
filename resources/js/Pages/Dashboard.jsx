import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, XCircle, Clock, Plus, ShoppingCart, BarChart3, AlertCircle, Bell, ChevronDown, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-gray-500 text-sm">{label}</div>
        </div>
    </div>
);

const STATUS_COLORS = {
    pending:  'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function Dashboard({ stats, recentOrders, monthlySales }) {
    const { auth } = usePage().props;
    
    // Add defensive checks for data
    const userName = auth?.user?.name || 'User';
    const safeStats = stats || {
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        pending: 0,
        totalRevenue: 0,
        approvedOrders: 0
    };
    const safeRecentOrders = recentOrders || [];
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const safeMonthlySales = monthlySales || [];

    // Calculate max sales for chart scaling
    const maxSales = Math.max(...safeMonthlySales.map(m => m.sales), 1);

    const notifications = [
        safeStats.lowStock > 0 ? { id: 'low-stock', title: `${safeStats.lowStock} low stock item(s)`, description: 'Review inventory and restock products soon.', type: 'warning' } : null,
        safeStats.pending > 0 ? { id: 'pending-orders', title: `${safeStats.pending} pending order(s)`, description: 'Approve or reject new customer orders.', type: 'info' } : null,
        safeStats.outOfStock > 0 ? { id: 'out-of-stock', title: `${safeStats.outOfStock} out of stock item(s)`, description: 'Some products are out of stock and need attention.', type: 'danger' } : null,
    ].filter(Boolean);

    const lowStockAlerts = safeStats.lowStock > 0 ? [
        { id: 1, name: 'Multiple products', current: safeStats.lowStock, min: 'Check inventory' },
    ] : [];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="font-bold text-2xl text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 text-sm mt-1">Welcome back, {userName.split(' ')[0]}! Here's your business overview.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-gray-500 text-sm">Today</div>
                                <div className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                    <Bell className="w-5 h-5" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-3 w-96 rounded-3xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden">
                                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Notifications</p>
                                                <p className="text-xs text-gray-500">Important updates for your dashboard</p>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-500 rotate-180" />
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length ? notifications.map(note => (
                                                <div key={note.id} className="px-5 py-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">{note.title}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{note.description}</p>
                                                        </div>
                                                        <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-full ${
                                                            note.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                            note.type === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {note.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="px-5 py-6 text-center text-sm text-gray-500">No important notifications right now.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {auth.user.role === 'admin' ? (
                                <>
                                    <Link href={route('products.create')}
                                        className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                                        <Plus className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-blue-700">Add Product</span>
                                    </Link>
                                    <Link href={route('records')}
                                        className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
                                        <ShoppingCart className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-green-700">View Orders</span>
                                    </Link>
                                    <Link href={route('users.index')}
                                        className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                                        <Users className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-purple-700">User Management</span>
                                    </Link>
                                    <Link href={route('products.index')}
                                        className="flex flex-col items-center gap-2 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors group">
                                        <Package className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-amber-700">Inventory</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('records')}
                                        className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
                                        <ShoppingCart className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-green-700">Order Approvals</span>
                                    </Link>
                                    <Link href={route('products.index')}
                                        className="flex flex-col items-center gap-2 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors group">
                                        <Package className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-amber-700">Inventory</span>
                                    </Link>
                                    <Link href={route('reports')}
                                        className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                                        <BarChart3 className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-purple-700">Reports</span>
                                    </Link>
                                    <Link href={route('home')}
                                        className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                                        <BarChart3 className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-blue-700">Home</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        <StatCard icon={Package}       label="Total Products" value={safeStats.total}           color="bg-blue-500"    />
                        <StatCard icon={CheckCircle}   label="In Stock"       value={safeStats.inStock}         color="bg-emerald-500" />
                        <StatCard icon={AlertTriangle} label="Low Stock"      value={safeStats.lowStock}        color="bg-amber-500"   />
                        <StatCard icon={XCircle}       label="Out of Stock"   value={safeStats.outOfStock}      color="bg-red-500"     />
                        <StatCard icon={Clock}         label="Pending Orders" value={safeStats.pending}         color="bg-purple-500"  />
                        <StatCard icon={BarChart3}     label="Total Revenue"  value={`₱${Number(safeStats.totalRevenue).toLocaleString()}`} color="bg-green-500" />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Stock Distribution Chart */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Package className="w-5 h-5 text-gray-600" />
                                <h2 className="font-bold text-lg text-gray-800">Stock Distribution</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                                        <span className="text-gray-700 font-medium">In Stock</span>
                                    </div>
                                    <span className="font-bold text-emerald-700">{safeStats.inStock} products</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                                        <span className="text-gray-700 font-medium">Low Stock</span>
                                    </div>
                                    <span className="font-bold text-amber-700">{safeStats.lowStock} products</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-700 font-medium">Out of Stock</span>
                                    </div>
                                    <span className="font-bold text-red-700">{safeStats.outOfStock} products</span>
                                </div>
                            </div>
                        </div>

                        {/* Sales Trend Chart */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-gray-600" />
                                <h2 className="font-bold text-lg text-gray-800">Sales Trend</h2>
                            </div>
                            <div className="space-y-4">
                                {safeMonthlySales.map((month, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-sm font-medium text-gray-600 w-8">{month.month}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.max((month.sales / maxSales) * 100, 5)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="font-bold text-gray-800">₱{Number(month.sales).toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">{month.orders} orders</div>
                                        </div>
                                    </div>
                                ))}
                                {safeMonthlySales.length === 0 && (
                                    <div className="text-center py-8">
                                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No sales data available yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Sales data will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    {lowStockAlerts.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                    <h2 className="font-bold text-gray-800">Low Stock Alerts</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {lowStockAlerts.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                                <div>
                                                    <div className="font-medium text-gray-800">{item.name}</div>
                                                    <div className="text-sm text-gray-600">Current: {item.current} | Minimum: {item.min}</div>
                                                </div>
                                            </div>
                                            <Link href={route('products.index')} 
                                                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors">
                                                Restock
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent orders table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">Recent Orders</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {safeRecentOrders.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">No orders yet.</td></tr>
                                ) : safeRecentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-800">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.user?.name}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">₱{Number(order.total).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
