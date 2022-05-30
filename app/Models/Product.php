<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'processor_brand',
        'processor_generation',
        'processor_type',
        'graphic_card_brand',
        'graphic_card_type',
        'memory_size',
        'memory_type',
        'storage',
        'category',
        'description',
        'review',
    ];

    public function images() {


        return $this->hasMany(Image::class);


    }
}
