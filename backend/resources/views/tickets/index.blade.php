@extends('layouts.template')
@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>View Tickets and Price</h2>
            </div>
            {{-- <div class="pull-right">
                <a class="btn btn-success" href="{{ route('tickets.create', ['match' => $match->id]) }}">Add Ticket</a>
            </div> --}}
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
            <th>Match ID</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Type</th>

            {{-- <th width="280px">Action</th> --}}
        </tr>

        @php
        $count = 0;
        @endphp
        @foreach ($tickets as $t)
        <tr>
            <td>{{ ++$count }}</td>
            <td>{{ $t->match_id }}</td>
            <td>{{ $t->price  }}</td>
            <td>{{ $t->quantity }}</td>
            <td>{{ $t->type }}</td>


            {{-- <td>
                <form action="{{ route('matches.destroy',$t->id) }}" method="POST">

                <a class="btn btn-info" href="{{ route('matches.show',$t->id) }}">Show</a>

                    <a class="btn btn-primary" href="{{ route('matches.edit',$t->id) }}">Edit</a>

                    @csrf
                    @method('DELETE')

                    <button type="submit" class="btn btn-danger">Delete</button>

                </form>
            </td> --}}
        </tr>
        @endforeach
    </table>

    <a class="btn btn-primary" href="{{ route('matches.index') }}">Back</a>
@endsection
