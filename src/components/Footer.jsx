/**
 * Componente Footer - Rodapé da aplicação
 * 
 * Componente estático que apresenta informações de copyright.
 * Implementa design consistente com o resto da aplicação.
 * 
 * Características:
 * - Design minimalista e profissional
 * - Responsivo com container centralizado
 * - Cores contrastantes para acessibilidade
 */

import React from 'react';

/**
 * Componente funcional que renderiza o rodapé
 * 
 * @returns {JSX.Element} Elemento JSX do footer
 */
const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    {/* Container com largura máxima e padding responsivo */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Informação de copyright */}
      <p>&copy; 2025 IPCA - Instituto Politécnico do Cávado e do Ave</p>
    </div>
  </footer>
);

export default Footer;