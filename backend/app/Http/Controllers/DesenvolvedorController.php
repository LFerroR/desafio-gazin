<?php

namespace App\Http\Controllers;

use App\Models\Desenvolvedor;
use Illuminate\Http\Request;

class DesenvolvedorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $desenvolvedores = Desenvolvedor::with('nivel')->get();
        
        if ($desenvolvedores->isEmpty()) {
            return response()->json(['message' => 'Nenhum desenvolvedor encontrado'], 400);
        }
        
        $desenvolvedores = $desenvolvedores->map(function ($dev) {
            return [
                'id' => $dev->id,
                'nome' => $dev->nome,
                'sexo' => $dev->sexo,
                'data_nascimento' => $dev->data_nascimento->format('Y-m-d'),
                'idade' => $dev->idade,
                'hobby' => $dev->hobby,
                'nivel' => [
                    'id' => $dev->nivel->id,
                    'nivel' => $dev->nivel->nivel
                ]
            ];
        });
        
        return response()->json($desenvolvedores, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nivel_id' => 'required|exists:nivels,id',
                'nome' => 'required|string|max:255',
                'sexo' => 'required|string|size:1|in:M,F', 
                'data_nascimento' => 'required|date',
                'hobby' => 'required|string|max:255'
            ]);

            $desenvolvedor = Desenvolvedor::create($validatedData);
            $desenvolvedor->load('nivel');
            
            $response = [
                'id' => $desenvolvedor->id,
                'nome' => $desenvolvedor->nome,
                'sexo' => $desenvolvedor->sexo,
                'data_nascimento' => $desenvolvedor->data_nascimento->format('Y-m-d'),
                'idade' => $desenvolvedor->idade,
                'hobby' => $desenvolvedor->hobby,
                'nivel' => [
                    'id' => $desenvolvedor->nivel->id,
                    'nivel' => $desenvolvedor->nivel->nivel
                ]
            ];

            return response()->json($response, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $desenvolvedor = Desenvolvedor::with('nivel')->find($id);

        if (!$desenvolvedor) {
            return response()->json(['message' => 'Desenvolvedor não encontrado'], 404);
        }

        $response = [
            'id' => $desenvolvedor->id,
            'nome' => $desenvolvedor->nome,
            'sexo' => $desenvolvedor->sexo,
            'data_nascimento' => $desenvolvedor->data_nascimento->format('Y-m-d'),
            'idade' => $desenvolvedor->idade,
            'hobby' => $desenvolvedor->hobby,
            'nivel' => [
                'id' => $desenvolvedor->nivel->id,
                'nivel' => $desenvolvedor->nivel->nivel
            ]
        ];

        return response()->json($response, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $desenvolvedor = Desenvolvedor::with('nivel')->find($id);

            if (!$desenvolvedor) {
                return response()->json(['message' => 'Desenvolvedor não encontrado'], 400);
            }

            $validatedData = $request->validate([
                'nivel_id' => 'sometimes|exists:nivels,id',
                'nome' => 'sometimes|string|max:255',
                'sexo' => 'sometimes|string|size:1|in:M,F', 
                'data_nascimento' => 'sometimes|date',
                'hobby' => 'sometimes|string|max:255'
            ]);

            $desenvolvedor->update($validatedData);
            $desenvolvedor->load('nivel');

            $response = [
                'id' => $desenvolvedor->id,
                'nome' => $desenvolvedor->nome,
                'sexo' => $desenvolvedor->sexo,
                'data_nascimento' => $desenvolvedor->data_nascimento->format('Y-m-d'),
                'idade' => $desenvolvedor->idade,
                'hobby' => $desenvolvedor->hobby,
                'nivel' => [
                    'id' => $desenvolvedor->nivel->id,
                    'nivel' => $desenvolvedor->nivel->nivel
                ]
            ];

            return response()->json($response);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $desenvolvedor = Desenvolvedor::find($id);

        if (!$desenvolvedor) {
            return response()->json(['message' => 'Desenvolvedor não remoção.'], 400);
        }

        $desenvolvedor->delete();
        return response()->json(['message' => 'Desenvolvedor removido com Sucesso.'], 204);
    }
}