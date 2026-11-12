@extends('layouts.template')
@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Squad &amp; Lineup</h2>
                <p class="text-muted">
                    Starting XI: <strong>{{ $starterCount }}/11</strong>
                    @if ($formation)
                        &nbsp;|&nbsp; Formation: <strong>{{ $formation }}</strong>
                    @else
                        &nbsp;|&nbsp; Pick 11 starters (1 goalkeeper) to publish the lineup on the website.
                    @endif
                </p>
            </div>
            <div class="pull-right">
                <a class="btn btn-success" href="{{ route('players.create') }}">Add Player</a>
            </div>
        </div>
    </div>

    @if ($message = Session::get('success'))
        <div class="alert alert-success"><p>{{ $message }}</p></div>
    @endif

    <table class="table table-bordered">
        <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Position</th>
            <th>Club</th>
            <th>Starting XI</th>
            <th>Order</th>
            <th width="200px">Action</th>
        </tr>
        @forelse ($players as $player)
            <tr>
                <td>{{ $player->shirt_number ?? '–' }}</td>
                <td>
                    {{ $player->name }}
                    @if ($player->is_captain) <span class="badge badge-warning">Captain</span> @endif
                </td>
                <td>{{ $player->role ?? (\App\Models\Player::POSITIONS[$player->position] ?? $player->position) }}</td>
                <td>{{ $player->club ?? '–' }}</td>
                <td>{{ $player->is_starter ? 'Yes' : 'No' }}</td>
                <td>{{ $player->sort_order }}</td>
                <td>
                    <form action="{{ route('players.destroy', $player) }}" method="POST"
                          onsubmit="return confirm('Remove {{ addslashes($player->name) }} from the squad?')">
                        <a class="btn btn-primary" href="{{ route('players.edit', $player) }}">Edit</a>
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>
            </tr>
        @empty
            <tr><td colspan="7">No players yet. Add the squad, then tick “Starting XI” for 11 of them.</td></tr>
        @endforelse
    </table>
@endsection
