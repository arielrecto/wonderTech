@php
$stats = 'border border-2 border-solid rounded-lg';
@endphp

<x-layouts.app>
    <x-layouts.content.authentication.navbar>
        {{ $user->name }}
    </x-layouts.content.authentication.navbar>

    <div class="flex gap-2 min-h-screen justify-center p-5">
        <div class="flex flex-col gap-20 w-4/5">
            <div class="h-20 grid grid-cols-4 grid-flow-row w-full gap-4 p-5">

                <div class="stat place-items-center {{ $stats }}">
                    <div class="stat-title">Total Items</div>
                    <div class="stat-value">{{ $totalItems }}</div>
                </div>


                <div class="stat place-items-center {{ $stats }}">
                    <div class="stat-title">Student Catergory</div>
                    <div class="stat-value text-secondary">{{ $totalItemsStudent }}</div>
                </div>

                <div class="stat place-items-center {{ $stats }}">
                    <div class="stat-title">Teacher</div>
                    <div class="stat-value text-secondary">{{ $totalItemsTeacher }}</div>
                </div>

                <div class="stat place-items-center {{ $stats }}">
                    <div class="stat-title">Office Worker</div>
                    <div class="stat-value text-secondary">{{ $totalItemsOfficeWorker }}</div>
                </div>

            </div>

            <div class="rounded shadow w-full bg-white">
                {!! $chart->container() !!}
            </div>


        </div>

    </div>


    <script src="{{ $chart->cdn() }}"></script>

    {{ $chart->script() }}

    <x-layouts.content.footer />
</x-layouts.app>
