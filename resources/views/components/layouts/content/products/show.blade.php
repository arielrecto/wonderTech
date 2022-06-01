@php
$imageCount = 1;
$buttonCount = 1;
$viewButton = 1;
@endphp

<x-layouts.app>

    <x-layouts.content.authentication.navbar>
        {{ $user->name }}
    </x-layouts.content.authentication.navbar>

    <div class="flex justify-center p-2">

        <div class="flex flex-col gap-2 min-h-screen p-5 w-4/5 border-solid border-2 rounded-xl">
            <div class="flex w-full">
                <div class="carousel w-full">
                    @foreach ($product->images as $image)
                        <div id="item{{ $imageCount++ }}" class="carousel-item w-full">
                            <img src="{{ asset("{$image->path}") }}" class="w-full" />
                        </div>
                    @endforeach
                </div>

            </div>
            <div class="flex justify-center w-full py-2 gap-2">
                @foreach ($product->images as $image)
                    <a href="#item{{ $buttonCount++ }}" class="btn btn-xs">{{ $viewButton++ }}</a>
                @endforeach
            </div>

            <div class="flex flex-col gap-2 w-full border-t-2 border-solid">

                <div class="flex justify-center w-full p-5">
                    <div>
                        <h1 class="font-bold uppercase text-2xl">Product Specification</h1>
                    </div>
                </div>
                <div class="flex gap-2">
                    <div class="flex flex-col gap-2 w-1/2">
                        <div class="w-full p-5">
                            <h1 class="text-lg">Product Name: <b>{{ $product->name }}</b></h1>
                        </div>

                        <div class="w-full p-5">
                            <h1 class="font-bold text-xl">Processor</h1>
                            <h1 class="text-lg"> Brand:<b
                                    class="m-5">{{ $product->processor_brand }}</b></h1>
                            <h1 class="text-lg"> Genth:<b
                                    class="m-5">{{ $product->processor_generation }}</b></h1>
                            <h1 class="text-lg">Type: <b
                                    class="m-5">{{ $product->processor_type }}</b></h1>
                        </div>


                        <div class="w-full p-5">
                            <h1 class="font-bold text-xl">Graphic Card</h1>
                            <h1 class="text-lg">Brand:<b
                                    class="m-5">{{ $product->graphic_card_brand }}</b></h1>
                            <h1 class="text-lg">Genth:<b
                                    class="m-5">{{ $product->graphic_card_type }}</b></h1>
                        </div>

                        <div class="w-full p-5">
                            <h1 class="font-bold text-xl">Memory</h1>
                            <h1 class="text-lg">Size:<b class="m-5">{{ $product->memory_size }}</b>
                            </h1>
                            <h1 class="text-lg">Type:<b class="m-5">{{ $product->memory_type }}</b>
                            </h1>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 w-1/2">
                        <div class="w-full p-5">
                            <h1 class="text-xl font-bold">Description</h1>
                            <p>{{ $product->description }}</p>
                        </div>

                        <div class="w-full p-5">
                            <h1 class="text-xl font-bold">Review</h1>
                            <p>{{ $product->review }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between">
                    <div class="p-5 font-bold text-red-500">
                        {{ '₱ ' . number_format($product->price, 0, ',', ',') }}
                    </div>

                    <div class="flex gap-2">
                        <a href="{{ route('admin.product.edit', ['id' => $product->id]) }}"
                            class="btn btn-success">Edit</a>


                        <label for="my-modal-6" class="btn modal-button btn-error">Delete</label>
                    </div>
                </div>
            </div>


            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="my-modal-6" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Are You Sure to Delete This File ?</h3>
                    <div class="flex gap-2">
                        <div class="p-6">
                            <a href="{{ route('admin.product.destroy', ['id' => $product->id]) }}"
                                class="btn btn-error">Delete</a>
                        </div>

                        <div class="modal-action">
                            <label for="my-modal-6" class="btn">No</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>



    </div>

    <x-layouts.content.footer />
</x-layouts.app>
