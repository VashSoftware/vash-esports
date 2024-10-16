<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MapPool extends Model
{
    use HasFactory;

    public function mapPoolMaps(): HasMany
    {
        return $this->hasMany(MapPoolMap::class);
    }

    public function vashMatches(): HasMany
    {
        return $this->hasMany(VashMatch::class);
    }
}
