// app/niveis/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/app/services/api";

interface Nivel {
  id: number;
  nivel: string;
}

export default function NiveisPage() {
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [formData, setFormData] = useState({ nivel: "" });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Função para limpar mensagens após um tempo
  const clearMessages = () => {
    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 5000); // Mensagens desaparecem após 5 segundos
  };

  const fetchNiveis = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiService.getNiveis();
      setNiveis(data);
    } catch (err: any) {
      console.error("Erro ao carregar níveis:", err);
      setErrorMessage(err.message || "Erro ao carregar níveis.");
    } finally {
      setLoading(false);
      clearMessages();
    }
  };

  useEffect(() => {
    fetchNiveis();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const isUpdating = editandoId !== null;
    let confirmationMessage = isUpdating
      ? "Tem certeza que deseja salvar as alterações neste nível?"
      : "Tem certeza que deseja cadastrar este nível?";

    if (!window.confirm(confirmationMessage)) {
      return; // Aborta a operação se o usuário cancelar
    }

    try {
      let response;
      if (isUpdating) {
        response = await apiService.updateNivel(editandoId!, formData);
      } else {
        response = await apiService.createNivel(formData);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao ${isUpdating ? 'atualizar' : 'cadastrar'} nível.`);
      }

      // Se a resposta for OK, mas não houver corpo (e.g., PUT/DELETE com 204 No Content), trate.
      // Assumindo que seu backend Laravel retorna o objeto atualizado/criado.
      if (response.status !== 204) { // 204 No Content for successful delete, if any
          const result = await response.json();
          if (isUpdating) {
            setNiveis(niveis.map(nivel => nivel.id === editandoId ? result : nivel));
            setSuccessMessage("Nível atualizado com sucesso!");
          } else {
            setNiveis([...niveis, result]);
            setSuccessMessage("Nível cadastrado com sucesso!");
          }
      } else {
          
          setSuccessMessage(`Nível ${isUpdating ? 'atualizado' : 'cadastrado'} com sucesso!`);
          fetchNiveis(); 
      }


      setFormData({ nivel: "" });
      setEditandoId(null);
      fetchNiveis();
    } catch (err: any) {
      console.error("Erro na operação:", err.message);
      setErrorMessage(err.message);
    } finally {
      clearMessages();
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!window.confirm("Tem certeza que deseja excluir este nível?")) {
      return; 
    }

    try {
      const response = await apiService.deleteNivel(id);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar nível.');
      }
      setNiveis(niveis.filter((nivel) => nivel.id !== id));
      if (editandoId === id) {
        handleCancelEdit();
      }
      setSuccessMessage("Nível excluído com sucesso!");
    } catch (err: any) {
      console.error("Erro ao deletar:", err.message);
      setErrorMessage(err.message);
    } finally {
      clearMessages();
    }
  };

  const handleEdit = (nivel: Nivel): void => {
    setFormData({ nivel: nivel.nivel });
    setEditandoId(nivel.id);
  };

  const handleCancelEdit = (): void => {
    setEditandoId(null);
    setFormData({ nivel: "" });
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Carregando níveis...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Início
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Cadastro de Níveis</h1>

      {/* Mensagens de feedback */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline"> {successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nível
          </label>
          <input
            type="text"
            value={formData.nivel}
            onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editandoId !== null ? "Salvar Alterações" : "Cadastrar Nível"}
          </button>
          {editandoId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Níveis Cadastrados</h2>
        {niveis.length === 0 ? (
          <p className="text-gray-500">Nenhum nível cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {niveis.map((nivel) => (
              <div
                key={nivel.id}
                className="border-b pb-4 flex justify-between items-center"
              >
                <p>
                  <strong>Nível:</strong> {nivel.nivel}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(nivel)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(nivel.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}