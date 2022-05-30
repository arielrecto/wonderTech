<x-layouts.app>
    <x-layouts.content.authentication.navbar>
        @if (Route::is('admin.dashboard'))
            {{ $user->name }}
        @endif
    </x-layouts.content.authentication.navbar>
    <div class="flex min-h-screen justify-center p-5">

        <div class="h-90 grid grid-cols-3 grid-flow-row gap-4 w-4/5">
            <a href="{{ route('admin.product.index') }}">
                <div class="border border-accent border-2 rounded-lg h-60 p-5 filter hover:drop-shadow-2xl">
                    <h1 class="text-lg font-bold uppercase">All Items</h1>
                    <div>
                        <img src="{{asset('icon/images/folder-5-fill.png')}}" alt="all" srcset="" class="w-36">
                    </div>
                </div>
            </a>
            <a href="{{ route('admin.product.stats') }}">
                <div class="border border-accent border-2 rounded-lg h-60 p-5 filter hover:drop-shadow-2xl">
                    <h1 class="text-lg font-bold uppercase">statistic</h1>
                </div>
            </a>
        </div>
    </div>
</x-layouts.app>
