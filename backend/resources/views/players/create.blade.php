@extends('layouts.template')
@section('content')
    <h2>Add Player</h2>
    <form action="{{ route('players.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @include('players._form')
        <a class="btn btn-secondary" href="{{ route('players.index') }}">Cancel</a>
        <button type="submit" class="btn btn-primary">Add Player</button>
    </form>
@endsection
