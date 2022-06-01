<x-layouts.app>
    <x-layouts.content.authentication.navbar>
        {{ $user->first()->name }}
    </x-layouts.content.authentication.navbar>
    <div class="flex justify-center">
        <div class="flex flex-col min-h-screen w-4/5 p-5">
            <div class="flex w-full bg-gray-300 nav navbar justify-center">
                <h1 class="font-bold uppercase">All items</h1>
            </div>

            <div class="flex flex-col gap-2 p-4 border-solid border-2">
                @foreach ($products as $product)

                    <div class="flex justify-between">
                        <div>
                            <h1 class="uppercase font-semibold p-2">{{ $product->name }}</h1>
                        </div> 
                        
                        <div>
                            <a href="{{route('admin.product.show', ['product' => $product->id])}}" class="btn btn-accent uppercase font-semibold">View More</a>
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

    <x-layouts.content.footer/>
</x-layouts.app>
