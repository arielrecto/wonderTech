<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Client;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\Product;
use App\Models\Image;
use App\Http\Controllers\ProductController;
use App\Models\Product as ModelsProduct;
use Illuminate\Routing\RouteRegistrar;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    $products = ModelsProduct::all();
    return view('index', compact('products'));
});

Route::name('client.')->group(function () {

    Route::get('/{name}', [ClientController::class, 'student'])->name('filter');
    Route::get('/product/{id}', [ClientController::class, 'show'])->name('show');
});



Route::name('admin.')->group(function () {
    Route::get('/admin/register', [AdminController::class, 'register'])->name('register');
    Route::post('/admin/register', [AdminController::class, 'create'])->name('create');
    Route::get('/admin/login', [AdminController::class, 'login'])->name('login');
    Route::post('/admin/login', [AdminController::class, 'check'])->name('check');
    Route::get('/admin/logout', [AdminController::class, 'logout'])->name('logout');




    Route::group(['middleware' => ['AuthCheck']], function () {

        Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::name('product.')->group(function () {

            Route::group(['middleware' => ['AuthCheck']], function () {

                Route::get('/admin/p/create', [ProductController::class, 'create'])->name('create');
                Route::post('/admin/add-product', [ProductController::class, 'store'])->name('addProduct');
                Route::get('admin/p/all', [ProductController::class, 'index'])->name('index');
                Route::get('admin/p/stats', [ProductController::class, 'stats'])->name('stats');
                Route::get('admin/p/show/{product}', [ProductController::class, 'show'])->name('show');
                Route::get('admin/p/edit/{id}', [ProductController::class, 'edit'])->name('edit');
                Route::post('admin/p/update/{id}', [ProductController::class, 'update'])->name('update');
                Route::get('admin/p/destroy/{id}', [ProductController::class, 'destroy'])->name('destroy');
                Route::get('admin/p/gallery', [ProductController::class, 'images'])->name('gallery');
            });
        });
    });
});
