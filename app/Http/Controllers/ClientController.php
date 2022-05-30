<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ClientController extends Controller
{

    public function student($name){

        $products = Product::all()->where('category', '=' , $name);

        return view('userFields.student', compact('products'));


    }
    public function show($id) {



        $product = Product::find($id);


        return view('userFields.show', compact('product'));


    }
}
