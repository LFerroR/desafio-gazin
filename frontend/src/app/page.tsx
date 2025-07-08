// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Bem-vindo à Gestão de Desenvolvedores e Níveis
      </h1>
      <nav className="flex space-x-6">
        <Link 
          href="/niveis" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Cadastrar Níveis
        </Link>
        <Link 
          href="/desenvolvedores" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Cadastrar Desenvolvedores
        </Link>
      </nav>
    </div>
  );
}