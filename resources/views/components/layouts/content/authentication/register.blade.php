<x-layouts.app>
    <section class="bg-green-200 body-font min-h-screen">
        <div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
            <div class="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                <h1 class="title-font font-medium text-3xl text-gray-900">Slow-carb next level shoindcgoitch ethical
                    authentic, poko scenester</h1>
                <p class="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock
                    starladder roathse. Craies vegan tousled etsy austin.</p>
            </div>
            <form action="{{ route('admin.create') }}" method="POST"
                class="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                @csrf

                <h2 class="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
                <div class="relative mb-4">
                    <label for="username" class="leading-7 text-sm text-gray-600">Username</label>
                    <input type="text" id="full-name" name="username"
                        class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                    <span>
                        @error('username')
                            <p class="alert alert-error shodow-lg">{{ $message }}</p>
                        @enderror
                    </span>
                </div>
                <div class="relative mb-4">
                    <label for="Password" class="leading-7 text-sm text-gray-600">Password</label>
                    <input type="password" id="email" name="password"
                        class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                    <span>
                        @error('password')
                            <p class="alert alert-error shodow-lg">{{ $message }}</p>
                        @enderror
                    </span>
                </div>
                <button type="submit"
                    class="text-white btn btn-accent border-0 py-2 px-8 focus:outline-none hover:bg-green-300 rounded text-lg hover:text-gray-500">Sign
                    Up</button>
                <p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
            </form>
        </div>
    </section>


</x-layouts.app>
