import { useForm, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, Leaf, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const FARM_IMAGE = 'https://images.unsplash.com/photo-1741717609690-07ef8c2dc7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@agro.com',
        password: 'password',
        remember: false,
    });
    const [showPw, setShowPw] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Sign In — AgroSupply" />
            <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-white to-emerald-50">
                {/* Left Side - Brand Section */}
                <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
                    <img src={FARM_IMAGE} alt="Farm" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-green-800/40 to-emerald-900/60" />
                    
                    {/* Logo and Branding */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                                <span className="text-2xl">🌾</span>
                            </div>
                            <div>
                                <span className="text-white font-bold text-2xl tracking-tight block">AgroSupply</span>
                                <span className="text-green-200 text-xs font-medium">Farm Supply Platform</span>
                            </div>
                        </div>
                    </div>

                    {/* Brand Content */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                            <Leaf className="w-4 h-4 text-green-300" />
                            <span className="text-white/90 text-xs font-medium">Complete Farm Management</span>
                        </div>
                        <h1 className="text-5xl text-white font-bold leading-tight mb-6">
                            Smarter Supply,<br />
                            <span className="bg-gradient-to-r from-yellow-300 via-green-300 to-emerald-300 bg-clip-text text-transparent">Better Harvest</span>
                        </h1>
                        <p className="text-white/70 text-base leading-relaxed max-w-sm font-light">
                            Streamline your agricultural business with intelligent inventory management, real-time order tracking, and data-driven insights.
                        </p>

                        {/* Features */}
                        <div className="mt-12 space-y-3">
                            {[
                                'Inventory Management',
                                'Real-time Analytics',
                                'Order Tracking'
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span className="text-white/80 text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Badge */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Serving 500+ farms</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-sm">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="lg:hidden flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                    <span className="text-lg">🌾</span>
                                </div>
                                <span className="text-gray-900 font-bold text-lg">AgroSupply</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-3 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-700 font-medium">{status}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        errors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:ring-offset-red-50 bg-red-50'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-offset-white bg-white hover:border-gray-400'
                                    }`}
                                    placeholder="you@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 pr-11 ${
                                            errors.password
                                                ? 'border-red-300 focus:ring-red-500 focus:ring-offset-red-50 bg-red-50'
                                                : 'border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-offset-white bg-white hover:border-gray-400'
                                        }`}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPw ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-2.5 text-sm text-gray-700 font-medium cursor-pointer">
                                    Keep me signed in
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-xs text-gray-500 mt-8">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-green-600 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-green-600 hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
