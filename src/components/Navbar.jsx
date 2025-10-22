/**
 * Componente Navbar - Barra de navegação principal da aplicação
 * 
 * Implementa navegação SPA (Single Page Application) sem recarregamento de página.
 * Utiliza o padrão de "Controlled Component" onde o estado é gerido pelo componente pai.
 * 
 * Características:
 * - Fixa no topo da página (position: fixed)
 * - Responsiva com breakpoints Tailwind
 * - Indicação visual da página ativa
 * - Transições suaves nos hover states
 */

import React from 'react';

/**
 * Componente funcional que renderiza a barra de navegação
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.paginaAtiva - ID da página atualmente ativa
 * @param {Function} props.setPaginaAtiva - Função para alterar a página ativa
 * @returns {JSX.Element} Elemento JSX da navbar
 */
const Navbar = ({ paginaAtiva, setPaginaAtiva }) => (
  <nav className="bg-white shadow-md fixed w-full top-0 z-50">
    {/* Container principal com largura máxima e padding responsivo */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        {/* Logo/Título da aplicação */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-green-700">Loja Social IPCA</h1>
        </div>
        
        {/* Menu de navegação */}
        <div className="flex space-x-8">
          {/* Array de itens de menu - facilita adição/remoção de páginas */}
          {[
            { id: 'inicio', label: 'Início' },
            { id: 'stock', label: 'Stock Disponível' },
            { id: 'doar', label: 'Como Doar' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPaginaAtiva(item.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                // Aplica estilos diferentes para o item ativo vs inativo
                paginaAtiva === item.id 
                  ? 'text-green-700 bg-green-50'  // Estado ativo
                  : 'text-gray-700 hover:text-green-700'  // Estado inativo com hover
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;