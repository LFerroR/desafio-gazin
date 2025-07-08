<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nivel extends Model
{
    protected $fillable =["nivel"];

    public function desenvolvedores(){
        return $this->hasMany(Desenvolvedor::class);
    }
}
