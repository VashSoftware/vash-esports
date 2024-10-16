<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mod extends Model
{
    use HasFactory;

    public function mapPoolMaps(): BelongsToMany
    {
        return $this->belongsToMany(MapPoolMap::class);
    }
}
