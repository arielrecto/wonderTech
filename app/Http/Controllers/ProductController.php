<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Image;
use App\Models\User;
use Illuminate\Support\Facades\Redis;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $products = Product::paginate(10);



        $userLogged = $request->session()->get('loggedUser');

        $user = User::all()->where('id', '=', $userLogged);



        return view('components.layouts.content.products.index', compact('products', 'user'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {


        $userLogged = $request->session()->get('loggedUser');

        $user = User::find($userLogged);



        return view('components.layouts.content.products.create', compact(['user']));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {





        // $data = $request->validate([
        //     'name' => ['required'],
        //     'price' => ['required'],
        //     'radio-1' => ['required'],
        //     'radio-2' => ['required'],
        //     'radio-3' => ['required'],
        //     'radio-4' => ['required'],
        //     'radio-5' => ['required'],
        //     'radio-6' => ['required'],
        //     'memory' => ['required'],
        //     'storage' => ['required'],
        //     'category' => ['required'],
        //     'description' => ['required'],
        //     'review' => ['required'],
        // ]);

        $data = [
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'processor_brand' => $request->input('radio-1'),
            'processor_generation' => $request->input('radio-2'),
            'processor_type' => $request->input('radio-3'),
            'graphic_card_brand' => $request->input('radio-4'),
            'graphic_card_type' => $request->input('radio-5'),
            'memory_size' => $request->input('radio-6'),
            'memory_type' => $request->input('memory'),
            'storage' => $request->input('storage'),
            'category' => $request->input('category'),
            'description' => $request->input('descriptions'),
            'review' => $request->input('review')
        ];

        $product = Product::create($data);



        if ($product->has('images')) {

            foreach ($request->file('images') as $image) {

                $imageName = $data['name'] . '-image-' . time() . rand(1, 1000) . '.' . $image->extension();

                $image->move(public_path('product_images'), $imageName);

                $path = "product_images/{$imageName}";

                dump($path);

                Image::create([
                    'product_id' => $product->id,
                    'images' => $imageName,
                    'path' => $path,
                ]);
            }
            return view('components.layouts.content.dashboard');
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {


        $userLogged = $request->session()->get('loggedUser');

        $user = User::find($userLogged);

        $product = Product::find($id);

        return view('components.layouts.content.products.show', compact('product', 'user'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id, Request $request)
    {


        $userLogged = $request->session()->get('loggedUser');


        $user = User::find($userLogged);

        $product = Product::find($id);


        return view('components.layouts.content.products.edit', compact('user', 'product'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $userlogged = $request->session()->get('loggedUser');

        $user = User::find($userlogged);

        $product = Product::find($id);


        $product->update([
            'name' => $request->input('name') != null
                ? $request->name
                : $product->name,
            'price' => $request->input('price') != null
                ? $request->price
                : $product->price,
            'processor_brand' => $request->input('price') != null
                ? $request->processor_brand
                : $product->processor_brand,
            'processor_generation' => $request->input('processor_generation') != null
                ? $request->processor_generation
                : $product->processor_generation,
            'processor_type' => $request->input('processor_type') != null
                ? $request->processor_type
                : $product->processor_type,
            'graphic_card_brand' => $request->input('graphic_card_brand') != null
                ? $request->graphic_card_brand
                : $product->graphic_card_brand,
            'graphic_card_type' => $request->input('graphic_card_type') != null
                ? $request->graphic_card_type
                : $product->graphic_card_type,
            'memory_size' => $request->input('memory_size') != null
                ? $request->memory_size
                : $product->memory_size,
            'memory_type' => $request->input('memory_type') != null
                ? $request->memory_type
                : $product->memory_type,
            'storage' => $request->input('storage') != null
                ? $request->storage
                : $product->storage,
            'category' => $request->input('category') != null
                ? $request->category
                : $product->category,
            'description' => $request->input('description') != null
                ? $request->description
                : $product->description,
            'review' => $request->input('review') != null
                ? $request->review
                : $product->review

        ]);






        return view('components.layouts.content.products.show', compact('user', 'product'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {


        $product = Product::find($id);

        $product->delete();


        return redirect('/admin/p/all');
    }

    public function delete($id, Request $request)
    {

        $userLogged = $request->session()->get('loggedUser');

        $user = User::find($userLogged);

        $product = Product::find($id);


        return view('components.layouts.content.products.delete', compact('product', 'user'));
    }

    public function stats(Request $request)
    {

        $totalItems = Product::all()->count();
        $totalItemsStudent = Product::all()->where('category', '=', 'student')->count();



        $userLogged = $request->session()->get('loggedUser');

        $user = User::find($userLogged);



        return view('components.layouts.content.products.statistic', compact('totalItems', 'totalItemsStudent', 'user'));
    }
}
