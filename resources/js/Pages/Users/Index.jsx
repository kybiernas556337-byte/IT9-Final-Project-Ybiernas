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
                <div className="bg-white border-b border-gray-200 px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="font-bold text-2xl text-gray-900">User Management</h1>
                        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
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
