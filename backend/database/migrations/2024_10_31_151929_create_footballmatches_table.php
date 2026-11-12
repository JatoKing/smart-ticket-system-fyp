<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('footballmatches', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('teams');
            $table->string('date');
            $table->string('time');
            $table->string('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footballmatches');
    }
};
