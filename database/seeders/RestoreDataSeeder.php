<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class RestoreDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data (keep the 3 seed users)
        Product::where('id', '>', 1)->delete(); // Keep the original seed product
        Order::truncate();
        OrderItem::truncate();

        // Restore additional users from backup
        $additionalUsers = [
            [
                'id' => 4,
                'name' => 'kathyrine',
                'email' => 'kathyrine@gmail.com',
                'password' => '$2y$12$s7jHBdjxKfgx7urNNLmv8ee73HLGmgS4Uh4GsvGFe/ijzqxgNCPxS',
                'role' => 'staff',
                'created_at' => '2026-05-06 06:03:14',
                'updated_at' => '2026-05-06 06:17:04',
            ],
            [
                'id' => 5,
                'name' => 'cassandra',
                'email' => 'cassandra@gmail.com',
                'password' => '$2y$12$2A8B/7pK7tRVHkZZ9/DRZuRJLgXGW0hIUdh8Njw24KbVCWof6qimS',
                'role' => 'customer',
                'created_at' => '2026-05-06 06:08:59',
                'updated_at' => '2026-05-06 06:08:59',
            ],
        ];

        foreach ($additionalUsers as $user) {
            User::create($user);
        }

        // Restore original products from backup
        $products = [
            [
                'id' => 2,
                'name' => 'NPK Fertilizer (14-14-14)',
                'category' => 'Fertilizers',
                'desc' => 'Balanced fertilizer for all crops',
                'price' => 850,
                'qty' => 20,
                'unit' => 'bags',
                'supplier' => 'AgriPrime Corp',
                'icon' => '🌱',
                'image_path' => NULL,
                'created_at' => '2026-05-06 05:16:25',
                'updated_at' => '2026-05-10 19:06:12',
            ],
            [
                'id' => 3,
                'name' => 'Glyphosate Herbicide 1L',
                'category' => 'Pesticides',
                'desc' => 'Broad-spectrum herbicide',
                'price' => 320,
                'qty' => 8,
                'unit' => 'liters',
                'supplier' => 'CropShield PH',
                'icon' => '🧪',
                'image_path' => 'products/7PQli6ctkILfbOiuFVSnuuJyyzmm1DV3yEvve9J0.jpg',
                'created_at' => '2026-05-06 05:16:26',
                'updated_at' => '2026-05-07 08:25:48',
            ],
            [
                'id' => 4,
                'name' => 'Hybrid Corn Seeds',
                'category' => 'Seeds',
                'desc' => 'High-yield hybrid variety',
                'price' => 1200,
                'qty' => 54,
                'unit' => 'kg',
                'supplier' => 'SeedMaster PH',
                'icon' => '🌽',
                'image_path' => 'products/yrp3WMDHyeldsFz2pNxEqlca1SYZKUuOsV6BBWL6.jpg',
                'created_at' => '2026-05-06 05:16:26',
                'updated_at' => '2026-05-10 18:42:44',
            ],
            [
                'id' => 5,
                'name' => 'Garden Sprayer 16L',
                'category' => 'Tools & Equipment',
                'desc' => 'Manual knapsack sprayer',
                'price' => 680,
                'qty' => 7,
                'unit' => 'pcs',
                'supplier' => 'FarmTools Inc',
                'icon' => '💦',
                'image_path' => 'products/CklSg9kNNHv9SwmsPYrsoEWsRPJiR6DRZPY0Q5xM.jpg',
                'created_at' => '2026-05-06 05:16:26',
                'updated_at' => '2026-05-10 18:52:54',
            ],
            [
                'id' => 6,
                'name' => 'Vermicast Organic Soil',
                'category' => 'Soil Amendments',
                'desc' => 'Nutrient-rich earthworm castings',
                'price' => 420,
                'qty' => 199,
                'unit' => 'bags',
                'supplier' => 'EcoFarm PH',
                'icon' => '🌍',
                'image_path' => 'products/gxKVfGWjbfeTAsNs8AJZmxTSJPLoiA9WKvKGKumj.webp',
                'created_at' => '2026-05-06 05:16:26',
                'updated_at' => '2026-05-10 18:42:44',
            ],
            [
                'id' => 7,
                'name' => 'Drip Irrigation Kit',
                'category' => 'Irrigation',
                'desc' => 'Complete drip system for 1 hectare',
                'price' => 4500,
                'qty' => 12,
                'unit' => 'sets',
                'supplier' => 'IrrigaTech',
                'icon' => '💧',
                'image_path' => 'products/hmiSGsCWUDvproEfxM79W3hCc6p03i7NbLwPxavw.png',
                'created_at' => '2026-05-06 05:16:26',
                'updated_at' => '2026-05-07 08:40:40',
            ],
            [
                'id' => 8,
                'name' => 'Poultry Layer Mash 50kg',
                'category' => 'Animal Feed',
                'desc' => 'Complete feed for laying hens',
                'price' => 1800,
                'qty' => 14,
                'unit' => 'bags',
                'supplier' => 'NutriPoultry',
                'icon' => '🐔',
                'image_path' => 'products/RtXazsY9T5W2uRoeVj8KQAngFCeyDhaBvPucjR6Z.png',
                'created_at' => '2026-05-06 05:16:26',
                'updated_at' => '2026-05-07 08:41:37',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Restore orders from backup
        $orders = [
            [
                'id' => 1,
                'user_id' => 3,
                'total' => 850,
                'status' => 'approved',
                'created_at' => '2026-05-06 05:24:13',
                'updated_at' => '2026-05-06 05:26:20',
            ],
            [
                'id' => 2,
                'user_id' => 5,
                'total' => 850,
                'status' => 'approved',
                'created_at' => '2026-05-06 06:13:43',
                'updated_at' => '2026-05-06 06:17:17',
            ],
            [
                'id' => 3,
                'user_id' => 3,
                'total' => 6620,
                'status' => 'rejected',
                'created_at' => '2026-05-06 06:57:47',
                'updated_at' => '2026-05-06 06:58:31',
            ],
            [
                'id' => 4,
                'user_id' => 3,
                'total' => 2370,
                'status' => 'approved',
                'created_at' => '2026-05-07 08:50:38',
                'updated_at' => '2026-05-07 08:50:51',
            ],
            [
                'id' => 5,
                'user_id' => 3,
                'total' => 70960,
                'status' => 'approved',
                'created_at' => '2026-05-07 08:52:45',
                'updated_at' => '2026-05-07 08:53:03',
            ],
            [
                'id' => 6,
                'user_id' => 3,
                'total' => 1700,
                'status' => 'approved',
                'created_at' => '2026-05-07 08:58:24',
                'updated_at' => '2026-05-07 08:58:56',
            ],
            [
                'id' => 7,
                'user_id' => 3,
                'total' => 5950,
                'status' => 'approved',
                'created_at' => '2026-05-07 08:58:36',
                'updated_at' => '2026-05-07 08:58:54',
            ],
            [
                'id' => 8,
                'user_id' => 3,
                'total' => 3150,
                'status' => 'approved',
                'created_at' => '2026-05-10 18:42:18',
                'updated_at' => '2026-05-10 18:42:44',
            ],
            [
                'id' => 9,
                'user_id' => 3,
                'total' => 2720,
                'status' => 'approved',
                'created_at' => '2026-05-10 18:47:21',
                'updated_at' => '2026-05-10 18:52:54',
            ],
            [
                'id' => 10,
                'user_id' => 3,
                'total' => 2720,
                'status' => 'rejected',
                'created_at' => '2026-05-10 18:47:27',
                'updated_at' => '2026-05-10 18:52:56',
            ],
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }

        // Restore order items from backup
        $orderItems = [
            ['id' => 1, 'order_id' => 1, 'product_id' => 2, 'qty' => 1, 'price' => 850, 'created_at' => '2026-05-06 05:24:13', 'updated_at' => '2026-05-06 05:24:13'],
            ['id' => 2, 'order_id' => 2, 'product_id' => 1, 'qty' => 1, 'price' => 850, 'created_at' => '2026-05-06 06:13:43', 'updated_at' => '2026-05-06 06:13:43'],
            ['id' => 3, 'order_id' => 3, 'product_id' => 8, 'qty' => 1, 'price' => 1800, 'created_at' => '2026-05-06 06:57:47', 'updated_at' => '2026-05-06 06:57:47'],
            ['id' => 4, 'order_id' => 3, 'product_id' => 7, 'qty' => 1, 'price' => 4500, 'created_at' => '2026-05-06 06:57:47', 'updated_at' => '2026-05-06 06:57:47'],
            ['id' => 5, 'order_id' => 3, 'product_id' => 3, 'qty' => 1, 'price' => 320, 'created_at' => '2026-05-06 06:57:47', 'updated_at' => '2026-05-06 06:57:47'],
            ['id' => 6, 'order_id' => 4, 'product_id' => 4, 'qty' => 1, 'price' => 1200, 'created_at' => '2026-05-07 08:50:38', 'updated_at' => '2026-05-07 08:50:38'],
            ['id' => 7, 'order_id' => 4, 'product_id' => 3, 'qty' => 1, 'price' => 320, 'created_at' => '2026-05-07 08:50:38', 'updated_at' => '2026-05-07 08:50:38'],
            ['id' => 8, 'order_id' => 4, 'product_id' => 1, 'qty' => 1, 'price' => 850, 'created_at' => '2026-05-07 08:50:38', 'updated_at' => '2026-05-07 08:50:38'],
            ['id' => 9, 'order_id' => 5, 'product_id' => 5, 'qty' => 2, 'price' => 680, 'created_at' => '2026-05-07 08:52:45', 'updated_at' => '2026-05-07 08:52:45'],
            ['id' => 10, 'order_id' => 5, 'product_id' => 4, 'qty' => 58, 'price' => 1200, 'created_at' => '2026-05-07 08:52:45', 'updated_at' => '2026-05-07 08:52:45'],
            ['id' => 11, 'order_id' => 6, 'product_id' => 1, 'qty' => 2, 'price' => 850, 'created_at' => '2026-05-07 08:58:24', 'updated_at' => '2026-05-07 08:58:24'],
            ['id' => 12, 'order_id' => 7, 'product_id' => 1, 'qty' => 7, 'price' => 850, 'created_at' => '2026-05-07 08:58:36', 'updated_at' => '2026-05-07 08:58:36'],
            ['id' => 13, 'order_id' => 8, 'product_id' => 1, 'qty' => 1, 'price' => 850, 'created_at' => '2026-05-10 18:42:18', 'updated_at' => '2026-05-10 18:42:18'],
            ['id' => 14, 'order_id' => 8, 'product_id' => 6, 'qty' => 1, 'price' => 420, 'created_at' => '2026-05-10 18:42:18', 'updated_at' => '2026-05-10 18:42:18'],
            ['id' => 15, 'order_id' => 8, 'product_id' => 5, 'qty' => 1, 'price' => 680, 'created_at' => '2026-05-10 18:42:18', 'updated_at' => '2026-05-10 18:42:18'],
            ['id' => 16, 'order_id' => 8, 'product_id' => 4, 'qty' => 1, 'price' => 1200, 'created_at' => '2026-05-10 18:42:18', 'updated_at' => '2026-05-10 18:42:18'],
            ['id' => 17, 'order_id' => 9, 'product_id' => 5, 'qty' => 4, 'price' => 680, 'created_at' => '2026-05-10 18:47:21', 'updated_at' => '2026-05-10 18:47:21'],
            ['id' => 18, 'order_id' => 10, 'product_id' => 5, 'qty' => 4, 'price' => 680, 'created_at' => '2026-05-10 18:47:27', 'updated_at' => '2026-05-10 18:47:27'],
        ];

        foreach ($orderItems as $item) {
            OrderItem::create($item);
        }

        // Update the original product to match backup
        Product::where('id', 1)->update([
            'qty' => 99, // From backup
            'updated_at' => '2026-05-10 18:42:44'
        ]);
    }
}
