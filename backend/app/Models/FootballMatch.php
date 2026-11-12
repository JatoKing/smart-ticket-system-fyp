<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FootballMatch extends Model
{
    use HasFactory;
    public $table = 'footballmatches';
    protected $fillable = [
        'teams',
        'date',
        'time',
        'location',
    ];

    public function bookTickets()
    {
        return $this->hasMany(BookTicket::class, 'match_id');
    }

}
