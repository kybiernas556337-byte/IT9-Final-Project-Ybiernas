<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get monthly sales data for the last 6 months
        $monthlySales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlySales[] = [
                'month' => $date->format('M'),
                'sales' => Order::where('status', 'approved')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('total'),
                'orders' => Order::where('status', 'approved')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total'      => Product::count(),
                'inStock'    => Product::where('qty', '>', 10)->count(),
                'lowStock'   => Product::whereBetween('qty', [1, 10])->count(),
                'outOfStock' => Product::where('qty', 0)->count(),
                'pending'    => Order::where('status', 'pending')->count(),
                'totalRevenue' => Order::where('status', 'approved')->sum('total'),
                'approvedOrders' => Order::where('status', 'approved')->count(),
            ],
            'recentOrders' => Order::with(['user', 'items.product'])->latest()->take(10)->get(),
            'monthlySales' => $monthlySales,
        ]);
    }
}
