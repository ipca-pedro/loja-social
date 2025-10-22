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
  <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700">
    {/* Container com largura máxima e padding responsivo */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Logo e informação institucional */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold">Loja Social IPCA</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Apoiando a comunidade académica com solidariedade e transparência.
          </p>
        </div>
        
        {/* Links rápidos */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Contacto</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Edifício dos SAS</p>
            <p>Campus do IPCA</p>
            <p>4750-810 Barcelos</p>
          </div>
        </div>
        
        {/* Copyright e links */}
        <div className="text-center md:text-right">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">
              &copy; 2025 IPCA
            </p>
            <p className="text-xs text-gray-500">
              Instituto Politécnico do Cávado e do Ave
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <span className="sr-only">Website IPCA</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Linha separadora e texto final */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <p className="text-center text-xs text-gray-500">
          Desenvolvido com ❤️ para a comunidade académica do IPCA
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;