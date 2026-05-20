<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@agro.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Staff Member',
            'email' => 'staff@agro.com',
            'password' => Hash::make('password'),
            'role' => 'staff'
        ]);

        User::create([
            'name' => 'Customer User',
            'email' => 'customer@agro.com',
            'password' => Hash::make('password'),
            'role' => 'customer'
        ]);

        $this->call(ProductSeeder::class);
    }
}