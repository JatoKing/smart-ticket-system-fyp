<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Squad details: specific role (e.g. Centre-Back, Left Winger), age and market value.
     */
    public function up(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->string('role', 40)->nullable()->after('position');
            $table->unsignedTinyInteger('age')->nullable()->after('role');
            $table->string('market_value', 20)->nullable()->after('club'); // e.g. "€350.0K"
        });
    }

    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn(['role', 'age', 'market_value']);
        });
    }
};
