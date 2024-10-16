<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Map extends Model
{
    use HasFactory;

    public function mapSet(): BelongsTo
    {
        return $this->belongsTo(MapSet::class);
    }

    public function mapPoolMaps(): HasMany
    {
        return $this->hasMany(MapPoolMap::class);
    }
}
