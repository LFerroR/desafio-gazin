// app/desenvolvedores/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/app/services/api";

interface Nivel {
  id: number;
  nivel: string;
}

interface Desenvolvedor {
  id: number;
  nome: string;
  sexo: string;
  data_nascimento: string;
  idade: number; 
  hobby: string;
  nivel: Nivel | undefined;
}

export default function Desenvolvedores() {
  const [desenvolvedores, setDesenvolvedores] = useState<Desenvolvedor[]>([]);
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [formData, setFormData] = useState({
    nivel_id: "",
    nome: "",
    sexo: "M",
    data_nascimento: "",
    hobby: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const clearMessages = () => {
    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 5000); 
  };


  const fetchNiveis = async () => {
    setErrorMessage(null);
    try {
      const data = await apiService.getNiveis();
      setNiveis(data);
    } catch (err: any) {
      console.error("Erro ao carregar níveis:", err);
      setErrorMessage(err.message || "Erro ao carregar níveis.");
    }
  };

  
  const fetchDesenvolvedores = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiService.getDesenvolvedores();
      setDesenvolvedores(data);
    } catch (err: any) {
      console.error("Erro ao carregar desenvolvedores:", err);
      setErrorMessage(err.message || "Erro ao carregar desenvolvedores.");
    } finally {
      setLoading(false);
      clearMessages();
    }
  };

  useEffect(() => {
    fetchNiveis();
    fetchDesenvolvedores();
  }, []);

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const isUpdating = editandoId !== null;
    let confirmationMessage = isUpdating
      ? "Tem certeza que deseja salvar as alterações neste desenvolvedor?"
      : "Tem certeza que deseja cadastrar este desenvolvedor?";

    if (!window.confirm(confirmationMessage)) {
      return; 
    }

   
    const dataToSend = {
      ...formData,
      data_nascimento: formData.data_nascimento,
      idade: calcularIdade(formData.data_nascimento), 
    };

    try {
      let response;
      if (isUpdating) {
        response = await apiService.updateDesenvolvedor(editandoId!, dataToSend);
      } else {
        response = await apiService.createDesenvolvedor(dataToSend);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao ${isUpdating ? 'atualizar' : 'cadastrar'} desenvolvedor.`);
      }

      if (response.status !== 204) {
          const result = await response.json();
          if (isUpdating) {
            setDesenvolvedores(desenvolvedores.map(dev => dev.id === editandoId ? result : dev));
            setSuccessMessage("Desenvolvedor atualizado com sucesso!");
          } else {
            setDesenvolvedores([...desenvolvedores, result]);
            setSuccessMessage("Desenvolvedor cadastrado com sucesso!");
          }
      } else {
          setSuccessMessage(`Desenvolvedor ${isUpdating ? 'atualizado' : 'cadastrado'} com sucesso!`);
          fetchDesenvolvedores();
      }

      setFormData({
        nivel_id: "",
        nome: "",
        sexo: "M",
        data_nascimento: "",
        hobby: "",
      });
      setEditandoId(null);
      fetchDesenvolvedores(); 
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

    if (!window.confirm("Tem certeza que deseja excluir este desenvolvedor?")) {
      return; 
    }

    try {
      const response = await apiService.deleteDesenvolvedor(id);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar desenvolvedor.');
      }
      setDesenvolvedores(desenvolvedores.filter((dev) => dev.id !== id));
      if (editandoId === id) {
        handleCancelEdit();
      }
      setSuccessMessage("Desenvolvedor excluído com sucesso!");
    } catch (err: any) {
      console.error("Erro ao deletar:", err.message);
      setErrorMessage(err.message);
    } finally {
      clearMessages();
    }
  };

  const handleEdit = (dev: Desenvolvedor): void => {
    setFormData({
      nivel_id: dev.nivel?.id.toString() || "",
      nome: dev.nome,
      sexo: dev.sexo,
      data_nascimento: dev.data_nascimento,
      hobby: dev.hobby,
    });
    setEditandoId(dev.id);
  };

  const handleCancelEdit = (): void => {
    setEditandoId(null);
    setFormData({
      nivel_id: "",
      nome: "",
      sexo: "M",
      data_nascimento: "",
      hobby: "",
    });
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Carregando desenvolvedores...</div>;
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

      <h1 className="text-2xl font-bold mb-6">Cadastro de Desenvolvedores</h1>

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

      {niveis.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>
            Você precisa cadastrar pelo menos um nível antes de cadastrar
            desenvolvedores.
          </p>
          <Link href="/niveis" className="text-blue-500 hover:underline">
            Cadastrar Níveis
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nível
            </label>
            <select
              value={formData.nivel_id}
              onChange={(e) =>
                setFormData({ ...formData, nivel_id: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
              disabled={niveis.length === 0}
            >
              <option value="">Selecione um nível</option>
              {niveis.map((nivel) => (
                <option key={nivel.id} value={nivel.id}>
                  {nivel.nivel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sexo
            </label>
            <select
              value={formData.sexo}
              onChange={(e) =>
                setFormData({ ...formData, sexo: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={formData.data_nascimento}
              onChange={(e) =>
                setFormData({ ...formData, data_nascimento: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hobby
            </label>
            <input
              type="text"
              value={formData.hobby}
              onChange={(e) =>
                setFormData({ ...formData, hobby: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={niveis.length === 0}
          >
            {editandoId !== null
              ? "Salvar Alterações"
              : "Cadastrar Desenvolvedor"}
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
        <h2 className="text-xl font-bold mb-4">Desenvolvedores Cadastrados</h2>
        {desenvolvedores.length === 0 ? (
          <p className="text-gray-500">Nenhum desenvolvedor cadastrado</p>
        ) : (
          <div className="space-y-4">
            {desenvolvedores.map((dev) => (
              <div
                key={dev.id}
                className="border-b pb-4 flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>Nome:</strong> {dev.nome}
                  </p>
                  <p>
                    <strong>Sexo:</strong>{" "}
                    {dev.sexo === "M" ? "Masculino" : "Feminino"}
                  </p>
                  <p>
                    <strong>Data de Nascimento:</strong> {dev.data_nascimento}
                  </p>
                  <p>
                    <strong>Idade:</strong> {calcularIdade(dev.data_nascimento)} anos
                  </p>
                  <p>
                    <strong>Hobby:</strong> {dev.hobby}
                  </p>
                  <p>
                    <strong>Nível:</strong> {dev.nivel?.nivel || "Não informado"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(dev)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(dev.id)}
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