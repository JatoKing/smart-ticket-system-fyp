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

<form action="{{ route('tickets.store', ['match' => $match->id]) }}" method="POST">
 @csrf
 <input type="hidden" name="match_id" value="{{ $match->id }}">

    <div class="row">
        <div class="col-xs-6 col-sm-6 col-md-12">
            <div class="form-group">
                <strong>Type:</strong>
                <input type="text" class="form-control" name="type1" placeholder="type" value="Premium" required>
                <input type="number" name="price1" placeholder="Enter Price (RM)" required>
                <input type="number" name="quantity1" placeholder="Enter Quantity" required>
            </div>
        </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
     <div class="form-group">
        <strong>Type:</strong>
        <input type="text" class="form-control" name="type2" placeholder="type" value="Grandstand" required>
        <input type="number" name="price2" placeholder="Enter Price (RM)" required>
        <input type="number" name="quantity2" placeholder="Enter Quantity" required>
     </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" name="type3" placeholder="type" value="Home" required>
          <input type="number" name="price3" placeholder="Enter Price (RM)" required>
          <input type="number" name="quantity3" placeholder="Enter Quantity" required>
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" name="type4" placeholder="type" value="Ultras Malaya" required>
          <input type="number" name="price4" placeholder="Enter Price (RM)" required>
          <input type="number" name="quantity4" placeholder="Enter Quantity" required>
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-12">
        <div class="form-group">
          <strong>Type:</strong>
          <input type="text" class="form-control" name="type5" placeholder="type5" value="Away" required>
          <input type="number" name="price5" placeholder="Enter Price (RM)" required>
          <input type="number" name="quantity5" placeholder="Enter Quantity" required>
        </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
    <button type="submit" class="btn btn-primary">Submit</button>

    <a class="btn btn-primary" href="{{ route('matches.index') }}">Back</a>
    </div>
    </div>

</form>
@endsection
