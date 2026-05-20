import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_COLORS = {
    pending:  'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function ViewRecords({ orders }) {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const approvedOrders = orders.filter(o => o.status === 'approved');
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const rejectedOrders = orders.filter(o => o.status === 'rejected');

    const filtered = orders.filter(order => {
        const matchesStatus = filter === 'all' ? true : order.status === filter;
        const query = search.trim().toLowerCase();
        const matchesSearch = !query ||
            String(order.id).includes(query) ||
            order.user?.name?.toLowerCase().includes(query) ||
            order.items?.some(item => item.product?.name?.toLowerCase().includes(query));
        return matchesStatus && matchesSearch;
    });

    const updateStatus = (order, status) => {
        router.patch(route('orders.status', order.id), { status });
    };

    const closeModal = () => setSelectedOrder(null);

    return (
        <AuthenticatedLayout>
            <Head title="View Records — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="font-bold text-2xl text-gray-900">View Records</h1>
                            <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full sm:w-80">
                                <input type="text" placeholder="Search orders, customer, or product..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="w-full h-11 pl-4 pr-4 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-green-500" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['all','pending','approved','rejected'].map(s => (
                                    <button key={s} onClick={() => setFilter(s)}
                                        className={`px-4 py-2 rounded-2xl text-xs font-semibold capitalize transition-all ${
                                            filter === s ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="text-sm text-gray-500">Total Orders</div>
                        <div className="mt-3 text-2xl font-semibold text-gray-900">{orders.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="text-sm text-gray-500">Approved</div>
                        <div className="mt-3 text-2xl font-semibold text-emerald-700">{approvedOrders.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="text-sm text-gray-500">Pending</div>
                        <div className="mt-3 text-2xl font-semibold text-amber-700">{pendingOrders.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="text-sm text-gray-500">Rejected</div>
                        <div className="mt-3 text-2xl font-semibold text-red-700">{rejectedOrders.length}</div>
                    </div>
                </div>

                <div className="px-8 py-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found.</td></tr>
                                ) : filtered.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-800">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.user?.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{order.items?.length} item(s)</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">₱{Number(order.total).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 items-end">
                                                <button onClick={() => setSelectedOrder(order)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors">
                                                    View Details
                                                </button>
                                                {order.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => updateStatus(order, 'approved')}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors">
                                                            Approve
                                                        </button>
                                                        <button onClick={() => updateStatus(order, 'rejected')}
                                                            className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-3xl overflow-hidden">
                            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.user?.name} · {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                                </div>
                                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">×</button>
                            </div>
                            <div className="px-6 py-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <div className="text-xs text-gray-500 uppercase tracking-[0.25em] mb-2">Status</div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[selectedOrder.status]}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <div className="text-xs text-gray-500 uppercase tracking-[0.25em] mb-2">Items</div>
                                        <div className="text-lg font-semibold text-gray-900">{selectedOrder.items?.length || 0}</div>
                                    </div>
                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <div className="text-xs text-gray-500 uppercase tracking-[0.25em] mb-2">Total</div>
                                        <div className="text-lg font-semibold text-gray-900">₱{Number(selectedOrder.total).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-gray-200 p-5 bg-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Items in this order</h3>
                                            <p className="text-sm text-gray-500">{selectedOrder.items?.length || 0} product(s)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map(item => (
                                            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-gray-50">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{item.product?.name || 'Product'}</div>
                                                    <div className="text-gray-500 text-sm">Qty: {item.qty} · ₱{Number(item.price).toLocaleString()}</div>
                                                </div>
                                                <div className="text-gray-900 font-semibold">₱{Number(item.qty * item.price).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-gray-600 text-sm">
                                        <div><span className="font-semibold text-gray-900">Customer:</span> {selectedOrder.user?.name}</div>
                                        <div className="mt-1"><span className="font-semibold text-gray-900">Email:</span> {selectedOrder.user?.email}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedOrder.status === 'pending' && (
                                            <>
                                                <button onClick={() => { updateStatus(selectedOrder, 'approved'); closeModal(); }}
                                                    className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all">
                                                    Approve Order
                                                </button>
                                                <button onClick={() => { updateStatus(selectedOrder, 'rejected'); closeModal(); }}
                                                    className="px-4 py-2 rounded-2xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all">
                                                    Reject Order
                                                </button>
                                            </>
                                        )}
                                        <button onClick={closeModal}
                                            className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
