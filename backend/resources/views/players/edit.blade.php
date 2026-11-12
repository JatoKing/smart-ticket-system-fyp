@extends('layouts.template')
@section('content')
    <h2>Edit {{ $player->name }}</h2>
    <form action="{{ route('players.update', $player) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('players._form')
        <a class="btn btn-secondary" href="{{ route('players.index') }}">Cancel</a>
        <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
@endsection
