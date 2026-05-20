import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_COLORS = {
    pending:  'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function AdminOrders({ orders }) {
    const [expanded, setExpanded] = useState(null);

    const updateStatus = (order, status) => {
        router.patch(route('orders.status', order.id), { status });
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Orders — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5">
                    <h1 className="font-bold text-xl text-gray-800">All Orders</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Manage all customer orders</p>
                </div>

                <div className="px-8 py-6 space-y-3">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">No orders yet.</div>
                    ) : orders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-800">Order #{order.id}</span>
                                    <span className="text-gray-500 text-sm">{order.user?.name}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {order.status === 'pending' && (
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
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
                                    <span className="font-bold text-gray-800">₱{Number(order.total).toLocaleString()}</span>
                                    <span className="text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className="text-gray-400">{expanded === order.id ? '▲' : '▼'}</span>
                                </div>
                            </button>
                            {expanded === order.id && (
                                <div className="border-t border-gray-100 px-6 py-4">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                                                <th className="pb-2">Product</th>
                                                <th className="pb-2">Qty</th>
                                                <th className="pb-2">Unit Price</th>
                                                <th className="pb-2">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {order.items?.map(item => (
                                                <tr key={item.id}>
                                                    <td className="py-2 font-medium text-gray-800">{item.product?.name || 'Deleted product'}</td>
                                                    <td className="py-2 text-gray-600">{item.qty}</td>
                                                    <td className="py-2 text-gray-600">₱{Number(item.price).toLocaleString()}</td>
                                                    <td className="py-2 font-semibold text-gray-800">₱{(item.qty * Number(item.price)).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
