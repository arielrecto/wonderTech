@php
    $editButton = "hover:bg-accent px-2 rounded-lg focus:bg-gray-300 hover:text-white"
@endphp
<x-layouts.app>
    <x-layouts.content.authentication.navbar>
        {{ $user->name }}
    </x-layouts.content.authentication.navbar>


    <div class="flex justify-center p-2">
        <div class="min-h-screen w-4/5 border-accent border-2 border-solid p-5">

            <form action="{{ route('admin.product.update', ['id' => $product->id]) }}" method="post"
                class="flex gap-2 w-full p-2 relative h-full">

                @csrf


                <div class="flex flex-col gap-2 w-1/2">
                    <label for="name">Product Name</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->name }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->name }}" name="name"
                                class="input input-bordered input-accent w-full" />
                        </span>
                    </div>

                    <label for="processor_brand">Process Brand</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->processor_brand }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->processor_brand }}" name="processor_brand"
                                class="input input-bordered input-accent w-full" />
                        </span>
                    </div>


                    <label for="proccessor_generation">Processor Generation</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->processor_generation }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->processor_generation }}"
                                name="processor_generation" class="input input-bordered input-accent w-full" />
                        </span>
                    </div>


                    <label for="proccessor_type">Processor Type</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->processor_type }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->processor_type }}" name="processor_type"
                                class="input input-bordered input-accent w-full" />
                        </span>
                    </div>



                    <label for="proccessor_type">Graphic Card Brand</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->graphic_card_brand }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->graphic_card_brand }}"
                                name="graphic_card_brand" class="input input-bordered input-accent w-full max-w-xs" />
                        </span>
                    </div>


                    <label for="storage">Storage</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->storage }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->storage }}" name="storage"
                                class="input input-bordered input-accent w-full" />
                        </span>
                    </div>

                </div>


                <div class="flex flex-col gap-2 w-1/2">


                    <label for="proccessor_type">Graphic Card Type</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->graphic_card_type }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->graphic_card_type }}"
                                name="graphic_card_type" class="input input-bordered input-accent w-full" />
                        </span>
                    </div>


                    <label for="graphic_card_type">Graphic Card Type</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->graphic_card_type }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->graphic_card_type }}"
                                name="graphic_card_type" class="input input-bordered input-accent w-full" />
                        </span>
                    </div>

                    <label for="memory_type">Memory Size</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->memory_size }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->memory_size }}" name="memory_size"
                                class="input input-bordered input-accent w-full" />
                        </span>
                    </div>




                    <label for="memory_type">Memory Type</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2 relative">
                            <div class="uppercase font-bold">
                                <h1>{{ $product->memory_type }}</h1>
                            </div>

                            <div class="text-blue-500 absolute right-0">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <input type="text" placeholder="{{ $product->memory_type }}" name="memory_type"
                                class="input input-bordered input-accent w-full" />
                        </span>
                    </div>



                    <label for="description">Description</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2">

                            <div class="text-blue-500">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <textarea class="textarea textarea-accent w-full" name="description"
                                placeholder="{{ $product->description }}"></textarea>
                        </span>
                    </div>


                    <label for="review">Review</label>
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2" x-data="{ open: false }">
                        <div class="flex gap-2">

                            <div class="text-blue-500">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>

                        <span x-show="open" x-transition.duration.500ms>
                            <textarea class="textarea textarea-accent w-full" name="review" placeholder="{{ $product->review }}"></textarea>
                        </span>
                    </div>

                </div>

                <div x-data="{ open: false }" class="absolute bottom-0 left-0">
                    <div class="flex flex-col gap-2 border-b-2 border-accent p-2 "
                       >
                        <label for="price">Price</label>
                        <div class="flex gap-2">
                            <div class="p-2 w-60 font-bold">
                                {{ '₱ ' . number_format($product->price, 0, ',', ',') }}
                            </div>
                            <div class="text-blue-500">
                                <p @click="open = ! open" class="{{$editButton}}">Edit</p>
                            </div>
                        </div>
                    </div>
                    <span x-show="open" x-transition.duration.500ms>
                        <input type="text" placeholder="{{ $product->price }}" name="price"
                            class="input input-bordered input-accent w-full" />
                    </span>
                </div>
                <button class="absolute bottom-5 right-5 btn btn-success hover:btn-accent hover:text-white">Update</button>

            </form>

        </div>
    </div>

</x-layouts.app>
