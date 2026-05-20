<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'NPK Fertilizer 10-10-10',
                'category' => 'Fertilizers',
                'desc' => 'Balanced NPK fertilizer ideal for general crop growth and development',
                'price' => 450.00,
                'qty' => 500,
                'unit' => 'bags',
                'supplier' => 'AgroChemical Corp',
                'icon' => '🌾',
            ],
            [
                'name' => 'Urea Fertilizer 46-0-0',
                'category' => 'Fertilizers',
                'desc' => 'High nitrogen content for leafy vegetables and grains',
                'price' => 380.00,
                'qty' => 300,
                'unit' => 'bags',
                'supplier' => 'AgroChemical Corp',
                'icon' => '🌿',
            ],
            [
                'name' => 'Phosphate Fertilizer DAP',
                'category' => 'Fertilizers',
                'desc' => 'Diammonium phosphate for strong root development',
                'price' => 520.00,
                'qty' => 250,
                'unit' => 'bags',
                'supplier' => 'GreenGrow Supplies',
                'icon' => '🌱',
            ],
            [
                'name' => 'Potassium Nitrate KNO3',
                'category' => 'Fertilizers',
                'desc' => 'Essential potassium supplement for fruit quality',
                'price' => 650.00,
                'qty' => 150,
                'unit' => 'bags',
                'supplier' => 'Premium Agro',
                'icon' => '💪',
            ],
            [
                'name' => 'Organic Compost',
                'category' => 'Soil Amendments',
                'desc' => 'Natural organic matter for soil enrichment',
                'price' => 280.00,
                'qty' => 800,
                'unit' => 'bags',
                'supplier' => 'EcoGreen Farms',
                'icon' => '♻️',
            ],
            [
                'name' => 'Lime Powder CaCO3',
                'category' => 'Soil Amendments',
                'desc' => 'Calcium carbonate for pH correction and soil amendment',
                'price' => 200.00,
                'qty' => 600,
                'unit' => 'bags',
                'supplier' => 'GreenGrow Supplies',
                'icon' => '⚪',
            ],
            [
                'name' => 'Fungicide Spray 500ml',
                'category' => 'Pesticides & Fungicides',
                'desc' => 'Effective fungicide for powdery mildew and leaf diseases',
                'price' => 350.00,
                'qty' => 400,
                'unit' => 'bottles',
                'supplier' => 'AgriCare Solutions',
                'icon' => '🦠',
            ],
            [
                'name' => 'Insecticide Solution 1L',
                'category' => 'Pesticides & Fungicides',
                'desc' => 'Broad spectrum insecticide for crop protection',
                'price' => 420.00,
                'qty' => 350,
                'unit' => 'bottles',
                'supplier' => 'AgriCare Solutions',
                'icon' => '🐛',
            ],
            [
                'name' => 'Herbicide Weedkiller 2L',
                'category' => 'Pesticides & Fungicides',
                'desc' => 'Pre and post-emergence weed control',
                'price' => 480.00,
                'qty' => 200,
                'unit' => 'bottles',
                'supplier' => 'BioShield Agro',
                'icon' => '🌾',
            ],
            [
                'name' => 'Garden Hose 50m',
                'category' => 'Tools & Equipment',
                'desc' => 'Durable PVC garden hose for irrigation',
                'price' => 890.00,
                'qty' => 100,
                'unit' => 'pieces',
                'supplier' => 'ToolMaster Inc',
                'icon' => '💧',
            ],
            [
                'name' => 'Hand Trowel Set 3pcs',
                'category' => 'Tools & Equipment',
                'desc' => 'Stainless steel hand tools for garden work',
                'price' => 245.00,
                'qty' => 200,
                'unit' => 'sets',
                'supplier' => 'ToolMaster Inc',
                'icon' => '🛠️',
            ],
            [
                'name' => 'Mulch Chips 50kg',
                'category' => 'Soil Amendments',
                'desc' => 'Wood chips for moisture retention and weed suppression',
                'price' => 320.00,
                'qty' => 400,
                'unit' => 'bags',
                'supplier' => 'EcoGreen Farms',
                'icon' => '🪵',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
