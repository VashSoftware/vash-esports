<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchParticipant extends Model
{
    use HasFactory;

    public function vashMatch(): BelongsTo
    {
        return $this->belongsTo(VashMatch::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function matchParticipantPlayers(): HasMany
    {
        return $this->hasMany(MatchParticipantPlayer::class);
    }
}
