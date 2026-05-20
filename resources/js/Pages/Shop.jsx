import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, Package, Tag, Layers, Building2, Info, Search } from 'lucide-react';

// Product image with emoji fallback
function ProductImage({ product, className = '' }) {
    const [imgError, setImgError] = useState(false);
    if (product.image_path && !imgError) {
        return (
            <img
                src={`/storage/${product.image_path}`}
                alt={product.name}
                className={`w-full h-full object-cover ${className}`}
                onError={() => setImgError(true)}
            />
        );
    }
    return (
        <div className={`w-full h-full flex items-center justify-center bg-green-50 ${className}`}>
            <span className="text-5xl">{product.icon || '📦'}</span>
        </div>
    );
}

// Product detail popup
function ProductModal({ product, cart, onClose, onAddToCart, onChangeQty, onRemoveItem, onPlaceOrder }) {
    const inCart = cart.find(i => i.product_id === product.id);
    const [imgError, setImgError] = useState(false);

    const handlePlaceOrder = () => {
        const qty = inCart ? inCart.qty : 1;
        onPlaceOrder([{ product_id: product.id, qty }]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                {/* Image */}
                <div className="relative w-full h-64 bg-green-50 flex-shrink-0">
                    {product.image_path && !imgError ? (
                        <img
                            src={`/storage/${product.image_path}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-8xl">{product.icon || '📦'}</span>
                        </div>
                    )}
                    <button onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all">
                        <X className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-green-800">
                        {product.category}
                    </span>
                </div>

                {/* Details */}
                <div className="p-6 space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-bold text-green-700">₱{Number(product.price).toLocaleString()}</span>
                            <span className="text-gray-400 text-sm">/ {product.unit}</span>
                        </div>
                    </div>

                    {product.desc && (
                        <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                            <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 text-sm leading-relaxed">{product.desc}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Layers className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div>
                                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stock</div>
                                <div className={`text-sm font-bold ${product.qty <= 5 ? 'text-red-600' : product.qty <= 10 ? 'text-amber-600' : 'text-gray-800'}`}>
                                    {product.qty} {product.unit}
                                </div>
                            </div>
                        </div>
                        {product.supplier && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div>
                                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Supplier</div>
                                    <div className="text-sm font-bold text-gray-800 truncate">{product.supplier}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order controls */}
                    <div className="pt-1">
                        {inCart ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl">
                                    <span className="text-green-800 font-semibold text-sm">In your cart</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => onChangeQty(product.id, -1)}
                                            className="w-8 h-8 rounded-xl bg-white border border-green-200 hover:bg-green-100 flex items-center justify-center transition-all shadow-sm">
                                            <Minus className="w-3 h-3 text-green-700" />
                                        </button>
                                        <span className="w-8 text-center font-bold text-green-800 text-lg">{inCart.qty}</span>
                                        <button onClick={() => onChangeQty(product.id, 1)}
                                            disabled={inCart.qty >= product.qty}
                                            className={`w-8 h-8 rounded-xl bg-white border flex items-center justify-center transition-all shadow-sm ${
                                                inCart.qty >= product.qty 
                                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                                    : 'border-green-200 hover:bg-green-100 text-green-700'
                                            }`}>
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-gray-500 text-sm">Subtotal</span>
                                    <span className="font-bold text-gray-800">₱{(inCart.qty * Number(product.price)).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => onRemoveItem(product.id)}
                                        className="h-11 flex items-center justify-center gap-2 border-2 border-red-200 hover:bg-red-50 text-red-500 rounded-2xl text-sm font-semibold transition-all">
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                    <button onClick={handlePlaceOrder}
                                        className="h-11 bg-green-800 hover:bg-green-700 active:scale-95 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                                        <Package className="w-4 h-4" /> Order Now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button onClick={() => { onAddToCart(product); onClose(); }}
                                    disabled={product.qty < 1}
                                    className={`w-full h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 ${
                                        product.qty < 1 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-green-800 hover:bg-green-700 active:scale-95 text-white'
                                    }`}>
                                    <ShoppingCart className="w-4 h-4" /> {product.qty < 1 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                {product.qty >= 1 && (
                                    <button onClick={handlePlaceOrder}
                                        className="w-full h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white">
                                        <Package className="w-4 h-4" /> Order Now
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Shop({ products }) {
    const { auth } = usePage().props;
    const cartKey = `agro_cart_${auth.user.id}`;

    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(cartKey);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [showCart, setShowCart] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Handle search from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, []);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const save = (updated) => {
        localStorage.setItem(cartKey, JSON.stringify(updated));
        return updated;
    };

    const addToCart = (product) => {
        if (product.qty < 1) return; // No stock
        setCart(prev => {
            const existing = prev.find(i => i.product_id === product.id);
            if (existing) {
                const newQty = existing.qty + 1;
                if (newQty > product.qty) return prev; // Can't add more
                return save(prev.map(i => i.product_id === product.id ? { ...i, qty: newQty } : i));
            } else {
                return save([...prev, { product_id: product.id, qty: 1, product }]);
            }
        });
    };

    const changeQty = (product_id, delta) => {
        setCart(prev => save(prev.map(i => {
            if (i.product_id === product_id) {
                const newQty = Math.max(1, i.qty + delta);
                if (newQty > i.product.qty) return i; // Can't exceed stock
                return { ...i, qty: newQty };
            }
            return i;
        })));
    };

    const removeItem = (product_id) => {
        setCart(prev => save(prev.filter(i => i.product_id !== product_id)));
    };

    const total = cart.reduce((sum, i) => sum + i.qty * Number(i.product.price), 0);

    const placeOrder = (items = null) => {
        const orderItems = items || cart.map(i => ({ product_id: i.product_id, qty: i.qty }));
        router.post(route('orders.store'), {
            items: orderItems,
        }, {
            onSuccess: () => {
                save([]);
                setCart([]);
                setShowCart(false);
                setOrdered(true);
            },
        });
    };

    return (
        <AuthenticatedLayout cartCount={cart.length} onOpenCart={() => setShowCart(true)}>
            <Head title="Shop — AgroSupply" />
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="font-bold text-xl text-gray-800">Shop</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Browse available farm supplies</p>
                        </div>
                        <button onClick={() => setShowCart(true)}
                            className="relative inline-flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white h-10 px-5 rounded-xl font-semibold text-sm transition-all">
                            <ShoppingCart className="w-4 h-4" />
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 placeholder-gray-500"
                        />
                    </div>
                </div>

                {ordered && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                            <div className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Order Placed!</h3>
                                    <p className="text-gray-600 text-sm mt-1">Your order has been placed successfully. You can track it in My Orders.</p>
                                </div>
                                <button onClick={() => setOrdered(false)}
                                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-all">
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(p => {
                        const inCart = cart.find(i => i.product_id === p.id);
                        return (
                            <div key={p.id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                                onClick={() => setSelectedProduct(p)}
                            >
                                {/* Product image */}
                                <div className="h-44 w-full overflow-hidden bg-green-50">
                                    <ProductImage product={p} className="group-hover:scale-105 transition-transform duration-300" />
                                </div>

                                <div className="p-4 flex flex-col gap-2 flex-1">
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 leading-tight">{p.name}</div>
                                        <div className="text-gray-400 text-xs mt-0.5">{p.category}</div>
                                        {p.desc && <div className="text-gray-500 text-xs mt-1 line-clamp-2">{p.desc}</div>}
                                    </div>
                                    <div className="flex items-end justify-between mt-1">
                                        <div>
                                            <div className="font-bold text-green-700 text-lg leading-tight">₱{Number(p.price).toLocaleString()}</div>
                                            <div className="text-gray-400 text-xs">{p.qty} {p.unit} left</div>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); addToCart(p); }}
                                            disabled={p.qty < 1}
                                            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all ${
                                                p.qty < 1 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                    : inCart ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-green-800 hover:bg-green-700 text-white'
                                            }`}
                                        >
                                            {p.qty < 1 ? 'Out of Stock' : inCart ? `In cart (${inCart.qty})` : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Product detail modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    cart={cart}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={addToCart}
                    onChangeQty={changeQty}
                    onRemoveItem={removeItem}
                    onPlaceOrder={placeOrder}
                />
            )}

            {/* Cart sidebar */}
            {showCart && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                    <div className="w-full max-w-md bg-white h-full flex flex-col shadow-xl">
                        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-bold text-lg text-gray-800">Your Cart</h2>
                            <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {cart.length === 0 ? (
                                <p className="text-gray-400 text-center py-12">Your cart is empty.</p>
                            ) : cart.map(item => (
                                <div key={item.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    {/* Thumbnail */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                        <ProductImage product={item.product} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-800 text-sm truncate">{item.product.name}</div>
                                        <div className="text-green-700 text-xs font-bold">₱{Number(item.product.price).toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => changeQty(item.product_id, -1)} className="w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                                        <button onClick={() => changeQty(item.product_id, 1)} 
                                            disabled={item.qty >= item.product.qty}
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                                item.qty >= item.product.qty 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                            }`}>
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-600 transition-colors ml-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-200 space-y-4">
                                <div className="flex justify-between font-bold text-gray-800 text-lg">
                                    <span>Total</span>
                                    <span>₱{total.toLocaleString()}</span>
                                </div>
                                <button onClick={placeOrder}
                                    className="w-full h-11 bg-green-800 hover:bg-green-700 text-white rounded-xl font-semibold transition-all">
                                    Place Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
