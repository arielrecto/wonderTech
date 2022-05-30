<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8,2);
            $table->string('processor_brand');
            $table->string('processor_generation');
            $table->string('processor_type');
            $table->string('graphic_card_brand');
            $table->string('graphic_card_type');
            $table->string('memory_size');
            $table->string('memory_type');
            $table->string('storage');
            $table->string('category');
            $table->string('description');
            $table->string('review');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
