<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * National team squad. Players marked as starters form the current lineup;
     * the formation is derived from their positions (e.g. 4 DF, 3 MF, 3 FW = 4-3-3).
     */
    public function up(): void
    {
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->unsignedTinyInteger('shirt_number')->nullable();
            $table->string('position', 2); // GK, DF, MF, FW
            $table->string('club', 100)->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('is_captain')->default(false);
            $table->boolean('is_starter')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0); // left → right within a line
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
