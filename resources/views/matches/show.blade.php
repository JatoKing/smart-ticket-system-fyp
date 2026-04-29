@extends('layouts.template')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
        <div class="pull-left">
         <h2>View Match Details</h2>
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
    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
    <a class="btn btn-primary" href="{{ route('matches.index') }}"> Back</a>
    </div>
    </div>

</form>
@endsection

