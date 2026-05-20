import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp, ShoppingBag, CheckCircle2, XCircle, Clock,
    Package, DollarSign, AlertTriangle, Users, BarChart2,
    Download, RefreshCw, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

const MONTHLY_ORDERS = [
    { month: 'Oct', orders: 4,  revenue: 18200  },
    { month: 'Nov', orders: 7,  revenue: 31500  },
    { month: 'Dec', orders: 5,  revenue: 24000  },
    { month: 'Jan', orders: 9,  revenue: 42800  },
    { month: 'Feb', orders: 12, revenue: 56400  },
    { month: 'Mar', orders: 8,  revenue: 38900  },
    { month: 'Apr', orders: 15, revenue: 71200  },
];

const BAR_COLORS  = ['#2e7d45','#4caf6b','#d4a843','#1d4ed8','#7c3aed','#dc2626','#0891b2'];
const PIE_COLORS  = { pending: '#d4a843', approved: '#2e7d45', rejected: '#dc2626' };
const TOOLTIP_STYLE = { background:'#fff', border:'1px solid #e2e8e4', borderRadius:12, fontSize:12 };

const RoundedBar = (colors) => (props) => {
    const { x, y, width, height, index } = props;
    if (!height || height <= 0) return <g />;
    return <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={colors[index % colors.length]} />;
};
const RoundedHBar = (colors) => (props) => {
    const { x, y, width, height, index } = props;
    if (!width || width <= 0) return <g />;
    return <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={colors[index % colors.length]} />;
};
const coloredBar  = RoundedBar(BAR_COLORS);
const coloredHBar = RoundedHBar(BAR_COLORS);

const RADIAN = Math.PI / 180;
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    return (
        <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)}
            fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function KpiCard({ label, value, sub, icon: Icon, iconClass, borderColor, trend, trendValue }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200 border-l-4 ${borderColor} p-5 flex flex-col gap-3`}>
            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${iconClass} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && trendValue && (
                    <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trendValue}
                    </span>
                )}
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
                {sub && <div className="text-[10px] text-gray-400 mt-1">{sub}</div>}
            </div>
        </div>
    );
}

function SectionHeader({ title, sub }) {
    return (
        <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">{title}</h2>
            {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
    );
}

export default function Reports({ orders, products, users = [] }) {
    const [activeTab, setActiveTab] = useState('overview');

    const approved     = orders.filter(o => o.status === 'approved');
    const pending      = orders.filter(o => o.status === 'pending');
    const rejected     = orders.filter(o => o.status === 'rejected');
    const totalRevenue = approved.reduce((s, o) => s + Number(o.total), 0);
    const avgOrder     = orders.length ? Math.round(orders.reduce((s, o) => s + Number(o.total), 0) / orders.length) : 0;
    const approvalRate = orders.length ? Math.round((approved.length / orders.length) * 100) : 0;
    const inventoryVal = products.reduce((s, p) => s + Number(p.price) * p.qty, 0);
    const lowStock     = products.filter(p => p.qty > 0 && p.qty <= 10).length;
    const outOfStock   = products.filter(p => p.qty === 0).length;
    const stockAlerts  = products.filter(p => p.qty <= 10).sort((a, b) => a.qty - b.qty);

    const pieData = [
        { name: 'Pending',  value: pending.length,  key: 'pending'  },
        { name: 'Approved', value: approved.length, key: 'approved' },
        { name: 'Rejected', value: rejected.length, key: 'rejected' },
    ].filter(d => d.value > 0);

    const catMap = {};
    products.forEach(p => {
        if (!catMap[p.category]) catMap[p.category] = { qty: 0, value: 0 };
        catMap[p.category].qty   += p.qty;
        catMap[p.category].value += Number(p.price) * p.qty;
    });
    const categoryData = Object.entries(catMap)
        .map(([name, d]) => ({ name: name.split(' ')[0], ...d }))
        .sort((a, b) => b.value - a.value);

    const topProducts = [...products]
        .map(p => ({ name: p.name.length > 20 ? p.name.slice(0,18)+'…' : p.name, value: Number(p.price)*p.qty, qty: p.qty }))
        .sort((a, b) => b.value - a.value).slice(0, 6);

    const spend = {};
    orders.forEach(o => {
        const name = o.user?.name || users.find(u => u.id === o.user_id)?.name || 'Unknown';
        if (!spend[name]) spend[name] = { name, total: 0, orders: 0 };
        spend[name].total  += Number(o.total);
        spend[name].orders += 1;
    });
    const topCustomers = Object.values(spend).sort((a, b) => b.total - a.total).slice(0, 5);

    const TABS = [
        { key: 'overview',  label: 'Overview'  },
        { key: 'inventory', label: 'Inventory' },
        { key: 'orders',    label: 'Orders'    },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Reports — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-green-700" />
                            Reports & Analytics
                        </h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            Business insights · Last updated{' '}
                            <span className="font-semibold text-gray-700">
                                {new Date().toLocaleDateString('en-PH', { month:'long', day:'numeric', year:'numeric' })}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                        <button onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white text-sm transition-colors">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>

                <div className="bg-white border-b border-gray-200 px-8 flex gap-1">
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === t.key
                                    ? 'border-green-700 text-green-700'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">

                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                                <KpiCard label="Total Revenue"   value={`₱${totalRevenue.toLocaleString()}`} sub="From approved orders"
                                    icon={DollarSign}   iconClass="bg-emerald-50 text-emerald-600" borderColor="border-l-emerald-400" trend="up" trendValue="+12%" />
                                <KpiCard label="Total Orders"    value={String(orders.length)} sub={`${pending.length} pending`}
                                    icon={ShoppingBag}  iconClass="bg-indigo-50 text-indigo-600"  borderColor="border-l-indigo-400"  trend="up" trendValue="+8%"  />
                                <KpiCard label="Approval Rate"   value={`${approvalRate}%`}    sub={`${approved.length} of ${orders.length} orders`}
                                    icon={CheckCircle2} iconClass="bg-green-50 text-green-600"    borderColor="border-l-green-400"
                                    trend={approvalRate >= 70 ? 'up' : 'down'} trendValue={approvalRate >= 70 ? 'Good' : 'Low'} />
                                <KpiCard label="Avg Order Value" value={`₱${avgOrder.toLocaleString()}`} sub="Per transaction"
                                    icon={TrendingUp}   iconClass="bg-blue-50 text-blue-600"     borderColor="border-l-blue-400" />
                                <KpiCard label="Inventory Value" value={`₱${inventoryVal.toLocaleString()}`} sub="Total stock worth"
                                    icon={Package}      iconClass="bg-purple-50 text-purple-600" borderColor="border-l-purple-400" />
                                <KpiCard label="Stock Alerts"    value={String(lowStock + outOfStock)} sub={`${outOfStock} out of stock`}
                                    icon={AlertTriangle} iconClass="bg-amber-50 text-amber-600"  borderColor="border-l-amber-400"
                                    trend={lowStock + outOfStock > 2 ? 'down' : null} trendValue="Needs attention" />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="font-semibold text-gray-800">Monthly Revenue Trend</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">7-month overview · Revenue in ₱</p>
                                    </div>
                                    <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <ArrowUpRight className="w-3.5 h-3.5" /> +83% vs last month
                                    </span>
                                </div>
                                <ResponsiveContainer width="100%" height={240}>
                                    <AreaChart data={MONTHLY_ORDERS} margin={{ top:4, right:4, bottom:0, left:0 }}>
                                        <defs>
                                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%"  stopColor="#2e7d45" stopOpacity={0.18} />
                                                <stop offset="95%" stopColor="#2e7d45" stopOpacity={0}    />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
                                        <XAxis dataKey="month" tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`₱${v.toLocaleString()}`, 'Revenue']}
                                            labelStyle={{ fontWeight:600, color:'#111' }} cursor={{ stroke:'#2e7d45', strokeWidth:1, strokeDasharray:'4 4' }} />
                                        <Area type="monotone" dataKey="revenue" stroke="#2e7d45" strokeWidth={2.5}
                                            fill="url(#revGrad)" dot={{ fill:'#2e7d45', r:4 }} activeDot={{ r:6 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <SectionHeader title="Order Status Distribution" sub="All-time order breakdown" />
                                    <div className="pt-4">
                                        {orders.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                                <ShoppingBag className="w-10 h-10 opacity-20 mb-2" />
                                                <p className="text-sm">No orders yet</p>
                                            </div>
                                        ) : (
                                            <>
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <PieChart>
                                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={88}
                                                            dataKey="value" labelLine={false} label={PieLabel}>
                                                            {pieData.map(e => <Cell key={e.key} fill={PIE_COLORS[e.key]} />)}
                                                        </Pie>
                                                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="flex justify-center gap-6 mt-2">
                                                    {pieData.map(d => (
                                                        <div key={d.key} className="flex items-center gap-1.5 text-sm">
                                                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[d.key] }} />
                                                            <span className="text-gray-600 font-medium">{d.name}</span>
                                                            <span className="text-gray-400">({d.value})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <SectionHeader title="Top Customers by Spend" sub="Ranked by total order value" />
                                    {topCustomers.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                            <Users className="w-10 h-10 opacity-20 mb-2" />
                                            <p className="text-sm">No customer orders yet</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {topCustomers.map((c, i) => (
                                                <div key={c.name} className="flex items-center gap-4 px-6 py-3.5">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                                                        i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-green-700'
                                                    }`}>{i + 1}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-800 truncate">{c.name}</div>
                                                        <div className="text-xs text-gray-400">{c.orders} order{c.orders !== 1 ? 's' : ''}</div>
                                                    </div>
                                                    <div className="text-sm font-bold text-green-700 shrink-0">₱{c.total.toLocaleString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'inventory' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KpiCard label="Total Products"  value={String(products.length)}              icon={Package}       iconClass="bg-blue-50 text-blue-600"       borderColor="border-l-blue-400"     />
                                <KpiCard label="Inventory Value" value={`₱${inventoryVal.toLocaleString()}`}  icon={DollarSign}    iconClass="bg-emerald-50 text-emerald-600" borderColor="border-l-emerald-400"  sub="Total stock worth" />
                                <KpiCard label="Low Stock Items" value={String(lowStock)}                     icon={AlertTriangle} iconClass="bg-amber-50 text-amber-600"     borderColor="border-l-amber-400"    />
                                <KpiCard label="Out of Stock"    value={String(outOfStock)}                   icon={XCircle}       iconClass="bg-red-50 text-red-600"         borderColor="border-l-red-400"      />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="mb-6">
                                        <h2 className="font-semibold text-gray-800">Inventory Value by Category</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">₱ value of current stock per category</p>
                                    </div>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={categoryData} layout="vertical" margin={{ left:8, right:16, top:0, bottom:0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f4f1" />
                                            <XAxis type="number" tick={{ fontSize:10, fill:'#8fa899' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} width={64} />
                                            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`₱${v.toLocaleString()}`, 'Value']}
                                                labelStyle={{ fontWeight:600, color:'#111' }} cursor={{ fill:'rgba(46,125,69,0.06)' }} />
                                            <Bar dataKey="value" shape={coloredHBar} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="mb-6">
                                        <h2 className="font-semibold text-gray-800">Stock Quantity by Category</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Total units available per category</p>
                                    </div>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={categoryData} barSize={28}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
                                            <XAxis dataKey="name" tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ fontWeight:600, color:'#111' }}
                                                cursor={{ fill:'rgba(46,125,69,0.06)' }} />
                                            <Bar dataKey="qty" shape={coloredBar} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="mb-6">
                                    <h2 className="font-semibold text-gray-800">Top Products by Inventory Value</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Price × Qty — highest value items</p>
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={topProducts} barSize={28}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
                                        <XAxis dataKey="name" tick={{ fontSize:10, fill:'#8fa899' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`₱${v.toLocaleString()}`, 'Value']}
                                            labelStyle={{ fontWeight:600, color:'#111' }} cursor={{ fill:'rgba(46,125,69,0.06)' }} />
                                        <Bar dataKey="value" shape={coloredBar} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <SectionHeader title="Stock Alerts" sub="Items that need restocking attention" />
                                {stockAlerts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <CheckCircle2 className="w-10 h-10 opacity-20 mb-2 text-emerald-500" />
                                        <p className="text-sm">All products are well-stocked!</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    {['Product','Category','Price','Qty','Status'].map(h => (
                                                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {stockAlerts.map(p => (
                                                    <tr key={p.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">{p.icon}</span>
                                                                <span className="font-medium text-gray-800">{p.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">{p.category}</span>
                                                        </td>
                                                        <td className="px-6 py-3 font-semibold">₱{Number(p.price).toLocaleString()}</td>
                                                        <td className="px-6 py-3">
                                                            <span className={`font-bold ${p.qty === 0 ? 'text-red-600' : 'text-amber-600'}`}>{p.qty} {p.unit}</span>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            {p.qty === 0
                                                                ? <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" /> Out of Stock</span>
                                                                : <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full"><AlertTriangle className="w-3 h-3" /> Low Stock</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'orders' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KpiCard label="Total Orders"   value={String(orders.length)}   icon={ShoppingBag}  iconClass="bg-indigo-50 text-indigo-600"  borderColor="border-l-indigo-400"  />
                                <KpiCard label="Approved"       value={String(approved.length)} icon={CheckCircle2} iconClass="bg-emerald-50 text-emerald-600" borderColor="border-l-emerald-400" />
                                <KpiCard label="Pending Review" value={String(pending.length)}  icon={Clock}        iconClass="bg-amber-50 text-amber-600"     borderColor="border-l-amber-400"   />
                                <KpiCard label="Rejected"       value={String(rejected.length)} icon={XCircle}      iconClass="bg-red-50 text-red-600"         borderColor="border-l-red-400"     />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="mb-6">
                                    <h2 className="font-semibold text-gray-800">Monthly Order Volume</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Number of orders placed per month</p>
                                </div>
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={MONTHLY_ORDERS} margin={{ top:4, right:4, bottom:0, left:0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
                                        <XAxis dataKey="month" tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize:11, fill:'#8fa899' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v, 'Orders']}
                                            labelStyle={{ fontWeight:600, color:'#111' }} cursor={{ stroke:'#d4a843', strokeWidth:1, strokeDasharray:'4 4' }} />
                                        <Line type="monotone" dataKey="orders" stroke="#d4a843" strokeWidth={2.5}
                                            dot={{ fill:'#d4a843', r:5 }} activeDot={{ r:7 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="mb-6">
                                        <h2 className="font-semibold text-gray-800">Revenue Summary</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Financial breakdown of all orders</p>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Approved Revenue',       value: approved.reduce((s,o) => s+Number(o.total),0), bar:'bg-emerald-400', text:'text-emerald-600' },
                                            { label: 'Pending Revenue',         value: pending.reduce((s,o) => s+Number(o.total),0),  bar:'bg-amber-400',   text:'text-amber-600'   },
                                            { label: 'Rejected (Lost Revenue)', value: rejected.reduce((s,o) => s+Number(o.total),0), bar:'bg-red-400',     text:'text-red-600'     },
                                        ].map(item => {
                                            const grand = orders.reduce((s,o) => s+Number(o.total),0);
                                            const pct = grand > 0 ? Math.round((item.value/grand)*100) : 0;
                                            return (
                                                <div key={item.label}>
                                                    <div className="flex justify-between text-sm mb-1.5">
                                                        <span className="text-gray-600 font-medium">{item.label}</span>
                                                        <span className={`font-bold ${item.text}`}>₱{item.value.toLocaleString()} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
                                                    </div>
                                                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className={`h-full ${item.bar} rounded-full`} style={{ width:`${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="pt-3 border-t border-gray-200 flex justify-between">
                                            <span className="text-sm text-gray-600 font-medium">Total Order Value</span>
                                            <span className="text-sm font-bold text-gray-800">₱{orders.reduce((s,o) => s+Number(o.total),0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <SectionHeader title="All Orders" sub="Complete order log" />
                                    {orders.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                            <ShoppingBag className="w-10 h-10 opacity-20 mb-2" />
                                            <p className="text-sm">No orders placed yet</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto max-h-[340px]">
                                            <table className="w-full text-sm">
                                                <thead className="sticky top-0 bg-gray-50">
                                                    <tr>
                                                        {['#','Customer','Total','Status'].map(h => (
                                                            <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {orders.map((o, i) => {
                                                        const buyer = o.user?.name || users.find(u => u.id === o.user_id)?.name || 'Unknown';
                                                        const badge = { pending:'bg-amber-100 text-amber-700', approved:'bg-emerald-100 text-emerald-700', rejected:'bg-red-100 text-red-700' };
                                                        return (
                                                            <tr key={o.id} className="hover:bg-gray-50">
                                                                <td className="px-5 py-3 text-gray-400">{i+1}</td>
                                                                <td className="px-5 py-3 font-medium text-gray-800">{buyer}</td>
                                                                <td className="px-5 py-3 font-bold">₱{Number(o.total).toLocaleString()}</td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge[o.status]}`}>
                                                                        {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
