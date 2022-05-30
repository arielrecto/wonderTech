<x-layouts.app>
    <x-layouts.content.authentication.navbar>
            {{$user->name}}
    </x-layouts.content.authentication.navbar>


    <div class="flex justify-center p-2">
        <div class="min-h-screen w-4/5 border-accent border-2 border-solid">

            <form action="{{route('admin.product.update', ['id' => $product->id])}}" method="post" class="flex flex-col gap-2">

                @csrf

                <label for="name">Product Name</label>
            
                <input type="text" placeholder="{{$product->name}}" name="name" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->processor_brand}}" name="processor_brand" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->processor_generation}}" name="processor_generation" class="input input-bordered input-accent w-full max-w-xs" />
                
                <input type="text" placeholder="{{$product->processor_type}}" name="processor_type" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->graphic_card_brand}}" name="graphic_card_brand" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->graphic_card_type}}" name="graphic_card_type" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->memory_size}}" name="memory_size" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->memory_type}}" name="memory_type" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->description}}" name="description" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->review}}" name="review" class="input input-bordered input-accent w-full max-w-xs" />

                <input type="text" placeholder="{{$product->price}}" name="price" class="input input-bordered input-accent w-full max-w-xs" />


                <button>Update</button>

            </form>

        </div>
    </div>
    
</x-layouts.app>