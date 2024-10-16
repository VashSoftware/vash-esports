<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    public function rounds(): HasMany
    {
        return $this->hasMany(Round::class);
    }

    public function eventGroup(): BelongsTo
    {
        return $this->belongsTo(EventGroup::class);
    }
}
