/**
 * Componente App - Componente raiz da aplicação
 * 
 * Este é o componente principal que orquestra toda a aplicação SPA.
 * Implementa o padrão de "Container Component" gerindo o estado global
 * da navegação e renderizando os componentes apropriados.
 * 
 * Arquitetura:
 * - SPA (Single Page Application) sem roteamento externo
 * - Estado centralizado para navegação
 * - Renderização condicional de páginas
 * - Layout consistente com header/main/footer
 * 
 * Padrões implementados:
 * - Lifting State Up: Estado da navegação gerido aqui
 * - Component Composition: Combinação de componentes modulares
 * - Conditional Rendering: Renderização baseada em estado
 */

import React, { useState } from 'react';

// Importação de componentes modulares
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InicioPage from './pages/InicioPage';
import StockPage from './pages/StockPage';
import DoarPage from './pages/DoarPage';

/**
 * Componente principal da aplicação
 * 
 * @returns {JSX.Element} Elemento JSX da aplicação completa
 */
const App = () => {
  // Estado global para controlar a página ativa
  // Implementa navegação SPA sem react-router
  const [paginaAtiva, setPaginaAtiva] = useState('inicio');

  /**
   * Função de renderização condicional de páginas
   * Mapeia o estado da navegação para o componente correspondente
   * 
   * @returns {JSX.Element} Componente da página ativa
   */
  const renderPage = () => {
    switch (paginaAtiva) {
      case 'stock': 
        return <StockPage />;
      case 'doar': 
        return <DoarPage />;
      default: 
        return <InicioPage />;
    }
  };

  return (
    // Container principal com altura mínima de tela completa
    <div className="bg-white font-sans min-h-screen antialiased">
      {/* 
        Navbar fixa com props para controlo de estado
        Implementa o padrão "Controlled Component"
      */}
      <Navbar 
        paginaAtiva={paginaAtiva} 
        setPaginaAtiva={setPaginaAtiva} 
      />
      
      {/* 
        Conteúdo principal com padding-top para compensar navbar fixa
        Renderiza dinamicamente a página ativa
      */}
      <main className="pt-20">
        {renderPage()}
      </main>
      
      {/* Footer estático */}
      <Footer />
    </div>
  );
};

export default App;