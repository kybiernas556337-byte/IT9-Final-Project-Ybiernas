<?php

return [
    'cloud_url' => env('CLOUDINARY_URL'),
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'secure' => true,
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', null),
    'folder' => env('CLOUDINARY_FOLDER', 'agrosupply/products'),
];
