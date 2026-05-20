import { useForm, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'customer',
    });
    const [showPw, setShowPw] = useState(false);
    const submit = (e) => { e.preventDefault(); post(route('register')); };

    return (
        <>
            <Head title="Create Account — AgroSupply" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-green-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-green-600 font-semibold hover:underline">Sign in here</Link>
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                    placeholder="Juan dela Cruz" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                    placeholder="you@example.com" required />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full h-11 px-4 pr-10 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                        placeholder="Min. 8 characters" required />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                                <input type="password" value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                                    placeholder="Repeat password" required />
                            </div>
                            <button type="submit" disabled={processing}
                                className="w-full h-11 bg-green-800 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
                                {processing ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
