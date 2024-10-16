<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchMap extends Model
{
    use HasFactory;

    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }

    public function vashMatches(): BelongsTo
    {
        return $this->belongsTo(VashMatch::class);
    }

    public function mapPoolMaps(): BelongsTo
    {
        return $this->belongsTo(MapPoolMap::class);
    }
}
