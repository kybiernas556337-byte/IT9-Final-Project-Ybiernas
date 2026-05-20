<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'desc',
        'price',
        'qty',
        'unit',
        'supplier',
        'icon',
        'image_path',
    ];
}