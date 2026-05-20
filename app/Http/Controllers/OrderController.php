<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->get();
        return Inertia::render('Orders/MyOrders', ['orders' => $orders]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty'        => 'required|integer|min:1|max:10000',
        ]);

        $total = 0;
        $orderItems = [];

        DB::transaction(function () use ($request, &$total, &$orderItems) {
            foreach ($request->items as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();
                if ($item['qty'] > $product->qty) {
                    throw new \Exception('Insufficient stock for ' . $product->name);
                }
                // Immediately decrement stock when order is placed
                $product->decrement('qty', $item['qty']);
                $total += $product->price * $item['qty'];
                $orderItems[] = [
                    'product_id' => $product->id,
                    'qty'        => $item['qty'],
                    'price'      => $product->price,
                ];
            }

            $order = auth()->user()->orders()->create(['total' => $total, 'status' => 'pending']);
            $order->items()->createMany($orderItems);
        });

        return back()->with('success', 'Order placed successfully!');
    }

    public function adminIndex()
    {
        $orders = Order::with(['user', 'items.product'])->latest()->get();
        return Inertia::render('Orders/AdminOrders', ['orders' => $orders]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:approved,rejected']);
        
        // Prevent re-updating orders that are already approved or rejected
        if ($order->status !== 'pending') {
            throw new \Exception('Can only update pending orders.');
        }
        
        DB::transaction(function () use ($request, $order) {
            if ($request->status === 'approved') {
                // Stock already decremented on order placement, just confirm status
                // No need to change qty again
            } elseif ($request->status === 'rejected') {
                // Restore stock when order is rejected
                foreach ($order->items as $item) {
                    $product = Product::where('id', $item->product_id)->lockForUpdate()->first();
                    if ($product) {
                        $product->increment('qty', $item->qty);
                    }
                }
            }
            
            $order->update(['status' => $request->status]);
        });
        
        return back()->with('success', 'Order status updated.');
    }
}
