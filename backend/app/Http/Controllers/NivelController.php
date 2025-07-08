<?php

namespace App\Http\Controllers;

use App\Models\Nivel;
use Illuminate\Cache\Repository;
use Illuminate\Http\Request;

class NivelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $niveis = Nivel::all();
        if($niveis->isEmpty()){
            return response()->json(['message' => 'Nenhum nível cadastrado'],404);
        }

        return response()->json($niveis, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['nivel' => 'required|string|max:255']);
        $nivel = Nivel::create($request->all());
        
        return response()->json($nivel, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
              $nivel = Nivel::find($id);
        
        if (!$nivel) {
            return response()->json(['message' => 'Nível não encontrado'], 404);
        }
        
        return response()->json($nivel, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nivel $nivel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
         $nivel = Nivel::find($id);
        
        if (!$nivel) {
            return response()->json(['message' => 'Nível não encontrado'], 400);
        }

        $request->validate([
            'nivel' => 'required|string|max:255'
        ]);

        $nivel->update($request->all());
        return response()->json($nivel, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
         $nivel = Nivel::find($id);
        
        if (!$nivel) {
            return response()->json(['message' => 'Nível não encontrado'], 400);
        }

        if ($nivel->desenvolvedores()->count() > 0) {
            return response()->json([
                'message' => 'Não é possível remover o nível pois há desenvolvedores associados'
            ], 400);
        }

        $nivel->delete();
        return response()->json(['message' => 'Nivel excluido com Sucesso'], 204);
    }
    
}
