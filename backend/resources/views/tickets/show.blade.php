@extends('layouts.template')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
        <div class="pull-left">
         <h2></h2>
    </div>

     </div>
    </div>

@if ($errors->any())
        <div class="alert alert-danger">
        <strong>Whoops!</strong> There were some problems with your input.<br><br>
        <ul>
 @foreach ($errors->all() as $error)
         <li>{{ $error }}</li>
 @endforeach
        </ul>
        </div>
@endif

<form action="#" method="POST">
 @csrf
    <div class="row">
        <div class="col-xs-6 col-sm-6 col-md-12">
            <div class="form-group">
                <strong>Teams:</strong>
                <input type="text" name="teams" class="form-control-plaintext" readonly placeholder="Teams" value="{{$match->teams}}">
             </div>
        </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
     <div class="form-group">
        <strong>Date:</strong>
        <input type="date" class="form-control-plaintext" readonly name="date" placeholder="Date" value="{{$match->date}}">
     </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Time:</strong>
            <input type="time" class="form-control-plaintext" readonly name="time" placeholder="Time" value="{{$match->time}}">
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Location:</strong>
            <input type="text" class="form-control-plaintext" readonly name="location" placeholder="Location" value="Stadium Bukit Jalil">
        </div>
    </div>
    @php
        $count = 0;
    @endphp
    @foreach ($tickets as $ticket)
        <div class="col-xs-6 col-sm-6 col-md-12">
            <div class="form-group">
            <strong>Type:</strong>
            <input type="text" class="form-control" readonly name="{{ 'type'.++$count }}" placeholder="type" value="{{$ticket->type}}" >
            <input type="number" readonly name="{{ 'price'.$count }}" placeholder="Enter Price (RM)" value="{{$ticket->price}}">
            <input type="number" readonly name="{{ 'quantity'.$count }}" placeholder="Enter Quantity" value="{{$ticket->quantity}}">
            </div>
        </div>
    @endforeach

    {{-- <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" readonly name="type2" placeholder="type" value="{{$ticket->type2}}" >
          <input type="number" readonly name="price2" placeholder="Enter Price (RM)" value="{{$ticket->price2}}">
          <input type="number" readonly name="quantity2" placeholder="Enter Quantity" value="{{$ticket->quantity2}}">
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" readonly name="type3" placeholder="type" value="{{$ticket->type3}}" >
          <input type="number" readonly name="price3" placeholder="Enter Price (RM)" value="{{$ticket->price3}}">
          <input type="number" readonly name="quantity3" placeholder="Enter Quantity" value="{{$ticket->quantity3}}">
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" readonly name="type4" placeholder="type" value="{{$ticket->type4}}" >
          <input type="number" readonly name="price4" placeholder="Enter Price (RM)" value="{{$ticket->price4}}">
          <input type="number" readonly name="quantity4" placeholder="Enter Quantity" value="{{$ticket->quantity4}}">
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" readonly name="type5" placeholder="type" value="{{$ticket->type5}}" >
          <input type="number" readonly name="price5" placeholder="Enter Price (RM)" value="{{$ticket->price5}}">
          <input type="number" readonly name="quantity5" placeholder="Enter Quantity" value="{{$ticket->quantity5}}">
        </div>
    </div> --}}

    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
    <a class="btn btn-primary" href="{{ route('tickets.index', $match->id) }}"> Back</a>
    </div>
    </div>

</form>
@endsection

