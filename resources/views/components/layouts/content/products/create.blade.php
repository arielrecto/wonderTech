<x-layouts.app>
    
    <x-layouts.content.authentication.navbar>
        {{$user->name}}
    </x-layouts.content.authentication.navbar>
    <div class="min-h-screen w-full justify-center p-2">
        <form action="{{route('admin.product.addProduct')}}" method="post" class="flex justify-center" enctype="multipart/form-data">
            @csrf
            <div class="flex min-h-screen gap-2 w-9/12 p-2 border border-solid border-gray-200 rounded-lg bg-green-100">
                <div class="w-1/2 h-full p-2">
                    <div class="font-semibold uppercase text-sm p-2">
                        <h1>Preview - image</h1>
                    </div>
                    <div id="previewImage"
                        class="flex gap-2 w-full border border-gray-300 rounded-lg p-2 overflow-x-auto h-80 scrollbar">
                    </div>
                    <div class="p-2">
                        <input type="file" id="imgInput" name="images[]" accept="image/*" multiple onchange="previewMultiple(event)">
                    </div>


                    <div class="flex flex-col gap-4 w-full">
                        @error('descriptions')
                            <span class=" alert alert-error">{{$message}}</span>
                        @enderror
                        <div x-data="{ open: false }" class="flex flex-col gap-2">
                            <div @click="open = !open" class="btn btn-accent w-1/3">
                                <h1>Descriptions</h1>
                            </div>

                            <span x-show="open" x-transition.duration.500ms class="w-full">
                                <textarea name="descriptions" cols="60" rows="20" class="w-full textarea textarea-accent"></textarea>
                            </span>
                        </div>
                        <div x-data="{ open: false }" class="flex flex-col gap-2">
                            <div @click="open = !open" class="btn btn-accent w-1/3">
                                <h1>Review</h1>
                            </div>

                            <span x-show="open" x-transition.duration.500ms class="w-full">
                                <textarea name="review" cols="60" rows="20" class="w-full textarea textarea-accent"></textarea>
                            </span>
                        </div>

                    </div>

                </div>
                <div class="flex flex-col gap-2 w-1/2 h-full p-2 w-full">
                    <div class="text-lg font-semibold uppercase flex justify-center">
                        <h1>Product Information</h1>
                    </div>
                    <div
                        class="flex flex-col gap-2 text-sm font-semibold uppercase p-2 w-full border border-solid rounded-lg border-2 border-gray-200">
                        <label for="productName">Brand name</label>
                        <input type="text" placeholder="Product Name" name="name" class="input input-bordered input-accent w-full">
                        <label for="productName">Price</label>
                        <input type="text" placeholder="Product Name" name="price" class="input input-bordered input-accent w-full">


                        <div>
                            <div class="flex justify-center">
                                <h3>product specs</h3>
                            </div>

                            <div class="flex gap-4">

                                <!-- Intel Button -->

                                <div x-data="{ open: false }" class="w-1/2">

                                    <div class="flex gap-2 p-2">
                                        <input type="radio" name="radio-1" class="radio radio-accent"
                                            @click="open = !open" value="Intel-Core">
                                        <label for="intercore">Intel-Core</label>
                                    </div>

                                    <div x-show="open" class="flex flex-col gap-2 p-5" x-transition.duration.500ms>

                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="12th GEN" class="radio radio-accent">
                                                <label for="intercore">12th GEN</label>
                                            </div>

                                            <div x-show="view" class="flex flex-col p-5 w-full"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="ntel Core i9-12900KS"
                                                        class="radio radio-accent">
                                                    <label for="intercore">ntel Core i9-12900KS</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-12900"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-12900</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-12900E"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-12900E</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-12900F"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-12900F</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-12900H"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-12900H</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-12700K"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i7-12700K</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-12700KF" "
                                                        class="              radio radio-accent">
                                                    <label for="intercore">Intel Core i7-12700KF</label> </label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-12700" "
                                                        class="              radio radio-accent">
                                                    <label for="intercore">Intel Core i7-12700</label> </label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-12700F"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i7-12700F</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-12600K"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i5-12600K</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-12600KF"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i5-12600KF</label>
                                                </div>

                                                <div class="flex gap-2 P-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-12600"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i5-12600</label>
                                                </div>
                                            </div>
                                        </div>


                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="12th GEN" class="radio radio-accent">
                                                <label for="intercore">11th GEN</label>
                                            </div>

                                            <div x-show="view" class="flex flex-col p-5 w-full"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-11900K"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-11900K</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-11900KF"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-11900KF</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-11700K" "
                                                            class="             radio radio-accent">
                                                    <label for="intercore">Intel Core i7-11700K</label> </label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-11600" "
                                                            class="             radio radio-accent">
                                                    <label for="intercore">Intel Core i5-11600</label> </label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-11600T" "
                                                            class="             radio radio-accent">
                                                    <label for="intercore">Intel Core i5-11600T</label> </label>
                                                </div>



                                            </div>
                                        </div>

                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="12th GEN" class="radio radio-accent">
                                                <label for="intercore">10th GEN</label>
                                            </div>

                                            <div x-show="view" class="flex flex-col p-5 w-full"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-10910"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-10910</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-10900K"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-10900K</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-10900KF"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i9-10900KF</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-10700K"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i7-10700K</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i7-10700KF"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i7-10700KF</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-10600T"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i5-10600T</label>
                                                </div>



                                            </div>
                                        </div>

                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="12th GEN" class="radio radio-accent">
                                                <label for="intercore">7th GEN</label>
                                            </div>

                                            <div x-show="view" class="flex flex-col p-5 w-full"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-7960X"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-7960X</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-7940X"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Intel Core i9-7940X</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i9-7940X"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i9-7940X</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-7600K"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i5-7600K</label>
                                                </div>

                                                <div class="flex gap-2 p-2">
                                                    <input type="radio" name="radio-3" value="Intel Core i5-7600T"
                                                        class="  radio radio-accent">
                                                    <label for="intercore">Intel Core i5-7600T</label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <!-- End Intel Button -->

                                </div>

                                <!-- AMD Button -->

                                <div x-data="{ open: false }" class="w-1/2">

                                    <div class="flex gap-2 p-2">
                                        <input type="radio" name="radio-1" value="AMD Ryzen" class="radio radio-accent"
                                            @click="open = !open">
                                        <label for="intercore">AMD Ryzen</label>
                                    </div>

                                    <div x-show="open" class="flex flex-col gap-2 p-5" x-transition.duration.500ms>


                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="ZEN 3 BASED" class="radio radio-accent">
                                                <label for="intercore">ZEN 3 BASED</label>
                                            </div>


                                            <div x-show="view" class="flex flex-col gap-2 p-5"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 5500</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 6 5600</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 7 5700</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 7 5800</label>
                                                </div>
                                            </div>

                                        </div>

                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="intel-core" class="radio radio-accent">
                                                <label for="intercore">ZEN 2 BASED</label>
                                            </div>

                                            <div x-show="view" class="flex flex-col gap-2 p-5"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 3 3100</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 3500X</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 3600</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 3600XT</label>
                                                </div>
                                            </div>

                                        </div>

                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="intel-core" class="radio radio-accent">
                                                <label for="intercore">ZEN+ BASED</label>
                                            </div>


                                            <div x-show="view" class="flex flex-col gap-2 p-5"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 2500X</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 2600E</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 7 2700E</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 7 2700</label>
                                                </div>
                                            </div>


                                        </div>


                                        <div x-data="{ view: false }">
                                            <div class="flex">

                                                <input @click="view = !view" type="radio" name="radio-2"
                                                    value="intel-core" class="radio radio-accent">
                                                <label for="intercore">ZEN BASED</label>
                                            </div>

                                            <div x-show="view" class="flex flex-col gap-2 p-5"
                                                x-transition.duration.500ms>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 3 1200</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 3 PRO 1200</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 5 1400</label>
                                                </div>


                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 7 1700X</label>
                                                </div>

                                                <div class="flex gap-2">
                                                    <input type="radio" name="radio-3" value="intel-core"
                                                        class="radio radio-accent">
                                                    <label for="intercore">Ryzen 7 1800X</label>
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                </div>

                                <!-- end AMD Button -->

                            </div>
                        </div>

                        <div class="flex gap-2 p-2">
                            <div class="flex flex-col w-1/2" x-data="{ open: false }">

                                <div class="flex gap-2">
                                    <input type="radio" name="radio-4" class="radio radio-accent" @click="open = !open"
                                        value="NVIDIA">
                                    <label for="">NVIDIA</label>
                                </div>


                                <div x-show="open" x-transition.duration.500ms class="flex flex-col gap-2 p-2">



                                    <div class="flex gap-2">
                                        <input type="radio" name="radio-5" class="radio radio-accent"
                                            value="NVIDIA RTX 3090 TI">
                                        <label for="">NVIDIA RTX 3090 TI</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <input type="radio" name="radio-5" class="radio radio-accent"
                                            value="NVIDIA Quadro RTX A6000">
                                        <label for="">NVIDIA Quadro RTX A6000</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <input type="radio" name="radio-5" class="radio radio-accent"
                                            value="NVIDIA GeForce MX150">
                                        <label for="">NVIDIA GeForce MX150</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <input type="radio" name="radio-5" class="radio radio-accent"
                                            value="NVIDIA GTX 1070">
                                        <label for="">NVIDIA GTX 1070</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <input type="radio" name="radio-5" class="radio radio-accent"
                                            value="NVIDIA GTX 1650">
                                        <label for="">NVIDIA GTX 1650</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <input type="radio" name="radio-5" class="radio radio-accent"
                                            value="Nvidia GTX 1070">
                                        <label for="">Nvidia GTX 1070</label>
                                    </div>




                                </div>

                            </div>

                            <div class="flex">

                                <div class="flex flex-col p-2" x-data="{ open: false }">

                                    <div class="flex gap-2 w-full">
                                        <input type="radio" name="radio-4" class="radio radio-accent"
                                            @click="open = !open" value="NVIDIA">
                                        <label for="">AMD Graphic</label>
                                    </div>


                                    <div x-show="open" x-transition.duration.500ms
                                        class="flex flex-col gap-2 p-2 w-full">



                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon RX 6900 XT">
                                            <label for="">AMD Radeon RX 6900 XT</label>
                                        </div>

                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon RX 6800 XT">
                                            <label for="">AMD Radeon RX 6800 XT</label>
                                        </div>

                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon RX 6800">
                                            <label for="">AMD Radeon RX 6800</label>
                                        </div>

                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon Pro W5700">
                                            <label for="">AMD Radeon Pro W5700</label>
                                        </div>

                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon RX 580">
                                            <label for="">AMD Radeon RX 580</label>
                                        </div>

                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon RX 570">
                                            <label for="">AMD Radeon RX 570</label>
                                        </div>

                                        <div class="flex gap-2">
                                            <input type="radio" name="radio-5" class="radio radio-accent"
                                                value="AMD Radeon RX 560">
                                            <label for="">AMD Radeon RX 560</label>
                                        </div>


                                    </div>

                                </div>

                            </div>

                        </div>

                        <div class="flex flex-col gap-2 p-2">

                            <h1 clas="text-lg uppercase">Memory</h1>

                            <div class="flex gap-2 p-2">
                                <div>
                                    <input type="radio" name="radio-6" class=" radio radio-accent" value="2Gb">
                                    <label>2Gb</label>
                                </div>
                                <div>
                                    <input type="radio" name="radio-6" class=" radio radio-accent" value="4Gb">
                                    <label>4Gb</label>
                                </div>
                                <div>
                                    <input type="radio" name="radio-6" class=" radio radio-accent" value="8Gb">
                                    <label>8Gb</label>
                                </div>
                                <div>
                                    <input type="radio" name="radio-6" class=" radio radio-accent" value="16Gb">
                                    <label>16Gb</label>
                                </div>
                                <div>
                                    <input type="radio" name="radio-6" class=" radio radio-accent" value="32Gb">
                                    <label>32Gb</label>
                                </div>
                            </div>

                            <div class="w-full">
                                <select name="memory"
                                    class="w-full font-bold border-solid border-accent border-2 rounded-t-lg">
                                    <option>Select Memory</option>
                                    <option value="2400MHz DDR4">2400MHz DDR4</option>
                                    <option value="3200 MHz DDR4">3200 MHz DDR4</option>
                                    <option value="DDR4 SO-DIMM">DDR4 SO-DIMM</option>
                                </select>
                            </div>

                        </div>

                        <div class="flex flex-col gap-2 p-2">
                            <h1 class="text-sm uppercase">Storage</h1>
                            <select name="storage"
                                class="w-full font-bold border-solid border-accent border-2 rounded-t-lg">

                                <option>Select Storage</option>
                                <option value="1TB SATA 5400RPM 2.5 HDD">1TB SATA 5400RPM 2.5" HDD</option>
                                <option value="1TB SATA 5400RPM 2.5 HDD">1TB SATA 5400RPM 2.5" HDD</option>
                                <option value="256GB M.2 NVMe™ PCIe® 3.0 SSD">256GB M.2 NVMe™ PCIe® 3.0 SSD</option>
                                <option value="500GB SATA 5400RPM 2.5 HDD">500GB SATA 5400RPM 2.5" HDD</option>
                                <option value="512GB M.2 NVMe™ PCIe® SSD">512GB M.2 NVMe™ PCIe® SSD</option>
                                <option value="256GB M.2 NVMe™ PCIe® SSD">256GB M.2 NVMe™ PCIe® SSD</option>
                                <option value="256GB M.2 NVMe™ PCIe® SSD">256GB M.2 NVMe™ PCIe® SSD</option>
                                </option>


                            </select>
                        </div>

                        <div class="flex flex-col gap-2 p-2">
                            <h1 class="text-sm uppercase">Category</h1>
                            <select name="category"
                                class="w-full font-bold border-solid border-accent border-2 rounded-t-lg">

                                <option>Select Category</option>
                                <option value="student">Student</option>
                                <option value="office_worker">Office Worder</option>
                                <option value="Teacher">Teacher</option>



                            </select>
                        </div>

                    </div>
                    <div class="self-end">
                        <button class="uppercase btn btn-accent">submit</button>
                    </div>
                </div>
            </div>

        </form>
    </div>
    <script>
        function previewMultiple(event) {
            var inputImage = document.getElementById("imgInput");
            var quantos = inputImage.files.length;

            for (i = 0; i < quantos; i++) {
                var urls = URL.createObjectURL(event.target.files[i]);
                document.getElementById("previewImage").innerHTML += '<img class="h-auto w-full" src="' + urls + '">';
            }

        }
    </script>

<x-layouts.content.footer/>
</x-layouts.app>
