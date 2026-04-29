@extends('layouts.template')
@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Matches</h2>
            </div>
            <div class="pull-right">
                <a class="btn btn-success" href="{{ route('matches.create') }}">Add New Match</a>
            </div>
        </div>
    </div>

    @if ($message = Session::get('success'))
        <div class="alert alert-success">
            <p>{{ $message }}</p>
        </div>
    @endif

    <table class="table table-bordered">
        <tr>
            <th>No</th>
            <th>Teams</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th width="280px">Action</th>
        </tr>

        @php
        $count = 0;
        @endphp
        @foreach ($matches as $mts)
        <tr>
            <td>{{ ++$count }}</td>
            <td>{{ $mts->teams }}</td>
            <td>{{ $mts->date }}</td>
            <td>{{ $mts->time }}</td>
            <td>{{ $mts->location }}</td>
            <td>
                <form action="{{ route('matches.destroy',$mts->id) }}" method="POST">

                <a class="btn btn-info" href="{{ route('matches.show',$mts->id) }}">Show</a>

                    <a class="btn btn-primary" href="{{ route('matches.edit',$mts->id) }}">Edit</a>

                    @csrf
                    @method('DELETE')

                    <button type="submit" class="btn btn-danger">Delete</button>

                    <a class="btn" style="background-color:burlywood" href="{{ route('tickets.create',$mts->id) }}">Add Ticket and Price</a>

                    <a class="btn" style="background-color: cornflowerblue" href="{{ route('tickets.show',$mts->id) }}">Show All Details</a>

                      {{-- <a class="btn btn-primary" href="{{ route('tickets.show', ['match' => $match->id, 'ticket' => $tickets->id]) }}"> View Ticket</a> --}}
                </form>
            </td>
        </tr>
        @endforeach
    </table>

@endsection
