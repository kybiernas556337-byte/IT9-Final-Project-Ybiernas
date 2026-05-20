import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Package, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

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
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        return uniqueCategories.sort();
    }, [products]);

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        const matchesStock = !stockFilter || 
            (stockFilter === 'in-stock' && p.qty > 10) ||
            (stockFilter === 'low-stock' && p.qty > 0 && p.qty <= 10) ||
            (stockFilter === 'out-of-stock' && p.qty === 0);
        
        return matchesSearch && matchesCategory && matchesStock;
    });

    const handleDelete = () => {
        router.delete(route('products.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="font-bold text-2xl text-gray-900">Product Management</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {filtered.length === products.length 
                                ? `${products.length} products across all categories`
                                : `Showing ${filtered.length} of ${products.length} products`
                            }
                        </p>
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
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-5">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Filters:</span>
                        </div>
                        
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                            className="h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 bg-white">
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        
                        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
                            className="h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 bg-white">
                            <option value="">All Stock Status</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                        
                        {(categoryFilter || stockFilter) && (
                            <button onClick={() => { setCategoryFilter(''); setStockFilter(''); }}
                                className="h-10 px-3 text-sm font-medium text-gray-600 hover:text-gray-800 underline">
                                Clear filters
                            </button>
                        )}
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
