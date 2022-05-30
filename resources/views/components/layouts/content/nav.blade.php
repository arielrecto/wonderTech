<div class="navbar bg-accent justify-center filter drop-shadow">
    <div class="w-11/12">
        <div class="flex-1">
            <div class="flex w-1/4 justify-center">
                <a href="/" class="btn btn-ghost normal-case text-xl">
                    <img src="{{ asset('WONDER_v2.png') }}" class="w-44" />
                </a>
            </div>
        </div>
        <div class="flex flex-row gap-2">

            @if (Route::is('/'))
                <div class=" flex form-control">
                    <input type="text" placeholder="Search" class="input input-bordered">
                </div>
            @endif
            <div class=" flex dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <a href="{{ route('admin.login') }}">
                            <ion-icon name="person-circle" class="h-full w-full"></ion-icon>
                        </a>
                    </div>
                </label>
            </div>
        </div>
    </div>
</div>
