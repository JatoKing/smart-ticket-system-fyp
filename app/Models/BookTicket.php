<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookTicket extends Model
{
    use HasFactory;
    public $table = 'bookticket';
    protected $fillable = [
        'user_id',
        'match_id',
        'gate',
        'type',
        'level',
        'section',
        'seat',
        'totalPrice',
    ];

    public function footballMatch()
    {
        return $this->belongsTo(FootballMatch::class, 'match_id');
    }
}
