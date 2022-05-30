
<x-layouts.app>
    <x-layouts.content.authentication.navbar>
      {{$user->name}}
    </x-layouts.content.authentication.navbar>


    <div class="stats shadow">
  
        <div class="stat">
          <div class="stat-title">Total Items in the Storage</div>
          <div class="stat-value">{{$totalItems}}</div>
        </div>
        
      </div>

      <div class="stats shadow">
  
        <div class="stat">
          <div class="stat-title">Student Category</div>
          <div class="stat-value">{{$totalItemsStudent}}</div>
        </div>
        
      </div>


</x-layouts.app>