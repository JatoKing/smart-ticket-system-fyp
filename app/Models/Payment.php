<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    public $table = 'payment';
    protected $fillable = [
        'bookticket_id',
        'fname',
        'identification',
    ];

    public function bookTicket()
    {
        return $this->belongsTo(BookTicket::class, 'bookticket_id');
    }

}
