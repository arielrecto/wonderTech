<x-layouts.app>

    <x-layouts.content.nav />

    <div class="flex flex-col w-full">

        <div class="grid card place-items-center min-h-screen">

            <form action="{{ route('admin.check') }}" method="post"
                class="flex flex-col gap-4 bg-gray-200 p-10 rounded-xl drop-shadow-2xl">
                <h1 class="font-bold    ">LOG IN</h1>
                @if (Session::get('fail'))
                    {{ Session::get('fail') }}
                @endif

                @csrf
                <input type="text" placeholder="username" class="input input-bordered input-accent w-full max-w-xs"
                    name="username">
                <span>
                    @error('username')
                        <p class="alert alert-error shadow-lg">
                            {{ $message }}
                        </p>
                    @enderror
                </span>
                <input type="password" placeholder="password" class="input input-bordered input-accent w-full max-w-xs"
                    name="password"> <span>
                    @error('password')
                        <p class="alert alert-error shadow-lg">
                            {{ $message }}
                        </p>
                    @enderror
                </span>
                <button type="submit" class="btn btn-accent uppercase">Sign In</button>

                <a href="{{ route('admin.register') }}" class="link link-accent">Create Account</a>


            </form>

        </div>
    </div>

<x-layouts.content.footer />



</x-layouts.app>
