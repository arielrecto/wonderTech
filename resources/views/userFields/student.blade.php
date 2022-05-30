@php
$imageCount = 1;
$count = 1;
@endphp

<x-layouts.app>

    <x-layouts.content.nav />


    <div class="flex justify-center p-2">
        <div class="flex flex-row w-11/12">
            <div class="flex border border-solid border-gray-150 w-full">
                <x-layouts.content.sidebar />
                <div class="flex flex-col gap-4 m-h-screen w-full border-gray-100 pr-2 pt-2 pb-2">
                    @foreach ($products as $product)
                        <div class="flex flex-row w-full gap-2 h-auto p-2 border border-solid border-grey-150">

                            <div class="w-3/6 bg-green-100 h-full">

                                <div class="carousel w-full h-auto">
                                    @foreach ($product->images as $image)
                                        <div id="item{{ $imageCount++ }}" class="carousel-item w-full">
                                            <img src="{{ asset("{$image->path}") }}" class="w-full" />
                                        </div>
                                    @endforeach
                                </div>
                                <div class="flex justify-center w-full py-2 gap-2">
                                    @foreach ($product->images as $image)
                                        <a href="#item{{ $count++ }}"
                                            class="btn btn-xs">.</a>
                                    @endforeach
                                </div>


                            </div>
                            <div class="flex gap-2 w-full">
                                <div class="flex flex-col h-full w-full gap-2">
                                    <h1 class="font-bold text-3xl uppercase">{{ $product->name }}</h1>
                                    <div class="p-2">
                                        <p>{{ $product->processor_brand }}</p>
                                        <p>{{ $product->processor_generation }}</p>
                                        <p>{{ $product->processor_type }}</p>
                                        <p>{{ $product->graphic_card_brand }}</p>
                                        <p>{{ $product->graphic_card_type }}</p>
                                        <p><b>Category: </b>{{ $product->category }}</p>
                                    </div>
                                    <div class="p-2 w-60 left-0 font-bold">
                                        {{ '₱ ' . number_format($product->price, 0, ',', ',') }}
                                    </div>
                                </div>
                                <div class="flex h-full p-2 w-1/4">
                                    <a href="{{route('client.show', ['id' => $product->id])}}" class="btn btn-accent self-end"> View More</a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                    @empty($product)
                        <div class="flex flex-row w-full gap-2 h-full p-2 border border-solid border-grey-150">
                            <div class="alert alert-warning shadow-lg h-20">
                                <h1 class="font-semibold uppercase p-2">No Item</h1>
                            </div>
                        </div>
                    @endempty
                </div>
            </div>

        </div>
    </div>

</x-layouts.app>
