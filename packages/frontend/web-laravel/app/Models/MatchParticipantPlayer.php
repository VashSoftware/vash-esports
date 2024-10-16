<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchParticipantPlayer extends Model
{
    use HasFactory;

    public function MatchParticipant(): BelongsTo
    {
        return $this->belongsTo(MatchParticipant::class);
    }

    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }
}
