<x-layouts.app>
    <x-layouts.content.authentication.navbar>
        {{ $user->name }}
    </x-layouts.content.authentication.navbar>


    <div class="min-h-screen w-full flex justify-center p-5">
        <div class="w-4/5">
            <div class="h-64 grid grid-cols-3 gap-4">
                @foreach ($images as $image)
                    <div>
                        <a href="{{ asset("{$image->path}") }}">
                            <img src="{{ asset("{$image->path}") }}" />
                        </a>
                    </div>
                @endforeach


            </div>
            @empty($image)
                <div class="alert alert-warning shadow-lg h-20">
                    <h1 class="font-semibold uppercase p-2">No Item</h1>
                </div>
            @endempty
        </div>
    </div>

    <x-layouts.content.footer />

</x-layouts.app>
