@php
    $selectCss ="flex justify-center border border-accent border-2 rounded-lg h-20 p-5 filter hover:bg-accent hover:border-gray-500 hover:text-white flex gap-2";
@endphp

<x-layouts.app>
    <x-layouts.content.authentication.navbar>
        @if (Route::is('admin.dashboard'))
            {{ $user->name }}
        @endif
    </x-layouts.content.authentication.navbar>
    <div class="flex min-h-screen justify-center p-5">

        <div class="h-90 grid grid-cols-3 grid-flow-row gap-4 w-4/5">
            <a href="{{ route('admin.product.index') }}">

                <div
                    class="{{$selectCss}}">
                    <div>
                        <i class="ri-archive-drawer-fill text-2xl"></i>
                    </div>


                    <div>
                        <h1 class="text-lg font-bold uppercase">All Items</h1>
                    </div>


                </div>
            </a>
            <a href="{{ route('admin.product.stats') }}">
                <div
                class="{{$selectCss}}">
                <div>
                    <i class="ri-line-chart-fill text-2xl"></i>
                </div>


                <div>
                    <h1 class="text-lg font-bold uppercase">Statistic</h1>
                </div>


            </div>
            </a>

            <a href="{{ route('admin.product.gallery') }}">
                <div
                class="{{$selectCss}}">
                <div>
                    <i class="ri-gallery-line"></i>
                </div>


                <div>
                    <h1 class="text-lg font-bold uppercase">Gallery</h1>
                </div>


            </div>
            </a>
        </div>
    </div>
    <x-layouts.content.footer/>
</x-layouts.app>
