import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = ['Fertilizers','Pesticides','Seeds','Tools & Equipment','Soil Amendments','Irrigation','Animal Feed','Others'];
const UNITS = ['bags','liters','kg','pcs','boxes','sets','rolls'];

export default function ProductEdit({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name, category: product.category, desc: product.desc ?? '',
        price: product.price, qty: product.qty, unit: product.unit,
        supplier: product.supplier ?? '', icon: product.icon ?? '📦', image: null,
    });

    const [preview, setPreview] = useState(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setData('image', null);
        setPreview(null);
    };

    const currentImage = preview || (product.image_path ? `/storage/${product.image_path}` : null);

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id), { forceFormData: true });
    };

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
                        <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                            {/* Product Image Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Photo</label>
                                {currentImage ? (
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={clearImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
                                            <X className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-xs font-semibold text-gray-700 cursor-pointer shadow-md transition-all">
                                            Change Photo
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload product photo</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                                    </label>
                                )}
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

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
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Icon (emoji fallback)</label>
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
