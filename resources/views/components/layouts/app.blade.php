<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
    <script defer src="{{asset('js/app.js')}}"></script>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <title>WonderTech</title>
    <link rel="icon" href="{{ asset('logo.png') }}">
</head>

<body>
    <div class="bg-gray-150 max-h-75">
        {{ $slot }}
    </div>
</body>

</html>
