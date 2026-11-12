<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    public const POSITIONS = [
        'GK' => 'Goalkeeper',
        'DF' => 'Defender',
        'MF' => 'Midfielder',
        'FW' => 'Forward',
    ];

    protected $fillable = [
        'name',
        'shirt_number',
        'position',
        'role',
        'age',
        'club',
        'market_value',
        'photo_path',
        'is_captain',
        'is_starter',
        'sort_order',
    ];

    protected $casts = [
        'shirt_number' => 'integer',
        'age' => 'integer',
        'is_captain' => 'boolean',
        'is_starter' => 'boolean',
        'sort_order' => 'integer',
    ];

    /** Site-relative URL of the uploaded photo (served via `php artisan storage:link`). */
    public function photoPath(): ?string
    {
        return $this->photo_path ? '/storage/'.ltrim($this->photo_path, '/') : null;
    }

    /** GK → DF → MF → FW, then the admin-defined order within each line. */
    public function scopeInFormationOrder($query)
    {
        return $query
            ->orderByRaw("FIELD(position, 'GK', 'DF', 'MF', 'FW')")
            ->orderBy('sort_order')
            ->orderBy('shirt_number');
    }
}
