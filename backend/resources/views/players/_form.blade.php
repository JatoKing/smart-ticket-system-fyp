@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="row">
    <div class="col-md-6 form-group">
        <label for="name">Name</label>
        <input id="name" name="name" class="form-control" required maxlength="100" value="{{ old('name', $player->name) }}">
    </div>
    <div class="col-md-2 form-group">
        <label for="shirt_number">Shirt number</label>
        <input id="shirt_number" name="shirt_number" type="number" min="1" max="99" class="form-control" value="{{ old('shirt_number', $player->shirt_number) }}">
    </div>
    <div class="col-md-4 form-group">
        <label for="position">Position</label>
        <select id="position" name="position" class="form-control" required>
            @foreach (\App\Models\Player::POSITIONS as $code => $label)
                <option value="{{ $code }}" @selected(old('position', $player->position) === $code)>{{ $label }}</option>
            @endforeach
        </select>
    </div>
    <div class="col-md-4 form-group">
        <label for="role">Specific role (optional)</label>
        <input id="role" name="role" class="form-control" maxlength="40" placeholder="e.g. Centre-Back" value="{{ old('role', $player->role) }}">
    </div>
    <div class="col-md-2 form-group">
        <label for="age">Age</label>
        <input id="age" name="age" type="number" min="15" max="50" class="form-control" value="{{ old('age', $player->age) }}">
    </div>
    <div class="col-md-3 form-group">
        <label for="market_value">Market value</label>
        <input id="market_value" name="market_value" class="form-control" maxlength="20" placeholder="e.g. €350.0K" value="{{ old('market_value', $player->market_value) }}">
    </div>
    <div class="col-md-3 form-group">
        <label for="club">Club (optional)</label>
        <input id="club" name="club" class="form-control" maxlength="100" value="{{ old('club', $player->club) }}">
    </div>
    <div class="col-md-6 form-group">
        <label for="photo">Photo (optional, max 2 MB)</label>
        <input id="photo" name="photo" type="file" accept="image/*" class="form-control-file">
        @if ($player->photo_path)
            <small class="text-muted d-block mt-1">A photo is already uploaded. Choose a file to replace it.</small>
        @endif
    </div>
    <div class="col-md-4 form-group">
        <label for="sort_order">Order within the line (left to right)</label>
        <input id="sort_order" name="sort_order" type="number" min="0" max="99" class="form-control" value="{{ old('sort_order', $player->sort_order ?? 0) }}">
    </div>
    <div class="col-md-8 form-group pt-md-4">
        <div class="form-check form-check-inline">
            <input id="is_starter" name="is_starter" type="checkbox" value="1" class="form-check-input" @checked(old('is_starter', $player->is_starter))>
            <label for="is_starter" class="form-check-label">Starting XI</label>
        </div>
        <div class="form-check form-check-inline">
            <input id="is_captain" name="is_captain" type="checkbox" value="1" class="form-check-input" @checked(old('is_captain', $player->is_captain))>
            <label for="is_captain" class="form-check-label">Captain</label>
        </div>
    </div>
</div>
