<div class="flex flex-col gap-2 min-h-screen w-1/4 border-gray-100 pl-2 pt-2">
    <div class="flex h-20 justify-center border rounded-l-lg">
        <a href="{{ url('/') }}">
            <div class="p-5 font-semibold text-2xl">
                <h1>all</h1>
            </div>
        </a>
    </div>

    <div class="flex h-20 justify-center border rounded-l-lg">
        <a href="{{ route('client.filter', ['name' => 'student']) }}">
            <div class="p-5 font-semibold text-2xl">
                <h1>Student</h1>
            </div>
        </a>
    </div>

    <div class="flex h-20 justify-center border rounded-l-lg">
        <a href="{{ route('client.filter', ['name' => 'Teacher']) }}">
            <div class="p-5 font-semibold text-2xl">
                <h1>Teacher</h1>
            </div>
        </a>
    </div>

    <div class="flex h-20 justify-center border rounded-l-lg">
        <a href="{{ route('client.filter', ['name' => 'office_worker']) }}">
            <div class="p-5 font-semibold text-2xl">
                <h1>Office Worker</h1>
            </div>
        </a>
    </div>


</div>
