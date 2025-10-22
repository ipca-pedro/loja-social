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
  <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 fixed w-full top-0 z-50">
    {/* Container principal com largura máxima e padding responsivo */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        {/* Logo/Título da aplicação com melhor tipografia */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loja Social</h1>
            <p className="text-sm text-green-700 font-medium -mt-1">IPCA</p>
          </div>
        </div>
        
        {/* Menu de navegação com design melhorado */}
        <div className="hidden md:flex items-center space-x-1">
          {/* Array de itens de menu - facilita adição/remoção de páginas */}
          {[
            { id: 'inicio', label: 'Início' },
            { id: 'stock', label: 'Stock Disponível' },
            { id: 'doar', label: 'Como Doar' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPaginaAtiva(item.id)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                // Aplica estilos diferentes para o item ativo vs inativo
                paginaAtiva === item.id 
                  ? 'text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg shadow-green-200'  // Estado ativo
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'  // Estado inativo com hover
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Menu mobile (hamburger) */}
        <div className="md:hidden">
          <button className="p-2 rounded-lg text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;