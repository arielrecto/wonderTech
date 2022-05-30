<x-layouts.app>

<x-layouts.content.authentication.navbar>
    {{$user->name}}
</x-layouts.content.authentication.navbar>


    <h1>Are you Sure to delete This item ? </h1>

    

    <a href="{{route('admin.product.destroy', ['id'=>$product->id])}}">Yes</a>

    <a href="{{route('admin.product.show', ['product'=>$product->id])}}">No</a>

</x-layouts.app>