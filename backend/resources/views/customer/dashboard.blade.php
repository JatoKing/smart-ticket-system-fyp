@extends('layouts.cust')

@section('content')
    <h1>Customer Dashboard</h1>
    <p>Welcome, {{ Auth::user()->name }}</p>
@endsection
