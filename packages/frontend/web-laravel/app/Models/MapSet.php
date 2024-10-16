<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MapSet extends Model
{
    use HasFactory;

    public function maps(): HasMany
    {
        return $this->hasMany(Map::class);
    }
}
