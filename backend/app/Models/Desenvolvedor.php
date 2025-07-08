<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Desenvolvedor extends Model
{
    protected $table = 'desenvolvedor'; 
    
    protected $fillable = [
        'nivel_id',
        'nome', 
        'sexo',
        'data_nascimento',
        'hobby'
    ];

    protected $casts = [
        'data_nascimento' => 'date'
    ];

    public function nivel()
    {
        return $this->belongsTo(Nivel::class);
    }
    
    public function getIdadeAttribute()
    {
        return $this->data_nascimento ? $this->data_nascimento->age : null;
    }
}