/**
 * Página Inicial - Landing page da aplicação
 * 
 * Esta página implementa a interface pública principal da Loja Social IPCA.
 * Apresenta informações institucionais e campanhas ativas.
 * 
 * Funcionalidades:
 * - Hero section com mensagem institucional
 * - Lista dinâmica de campanhas obtidas via API
 * - Estados de loading para melhor UX
 * - Layout responsivo mobile-first
 * 
 * Hooks utilizados:
 * - useState: Gestão do estado local (campanhas, loading)
 * - useEffect: Carregamento de dados na montagem do componente
 */

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

/**
 * Componente da página inicial
 * 
 * @returns {JSX.Element} Elemento JSX da página inicial
 */
const InicioPage = () => {
  // Estado para armazenar a lista de campanhas
  const [campanhas, setCampanhas] = useState([]);
  
  // Estado para controlar o indicador de carregamento
  const [loading, setLoading] = useState(true);

  /**
   * Effect hook para carregar campanhas na montagem do componente
   * Executa apenas uma vez devido ao array de dependências vazio []
   */
  useEffect(() => {
    /**
     * Função assíncrona para buscar campanhas da API
     * Implementa tratamento de erros e gestão de estados
     */
    const fetchCampanhas = async () => {
      try {
        // Chama a API através do módulo centralizado
        const data = await api.getCampanhas();
        
        // Atualiza o estado apenas se a resposta for bem-sucedida
        setCampanhas(data.success ? data.data : []);
      } catch (error) {
        // Log do erro para debugging (em produção, usar serviço de logging)
        console.error('Erro ao carregar campanhas:', error);
      } finally {
        // Sempre remove o loading, independentemente do resultado
        setLoading(false);
      }
    };
    
    fetchCampanhas();
  }, []); // Array vazio = executa apenas na montagem

  return (
    <div>
      {/* 
        Hero Section - Seção principal de impacto visual
        Utiliza gradiente da cor institucional do IPCA
        Design responsivo com tipografia escalonada
      */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            {/* Título principal com tipografia melhorada */}
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="block">Apoie a</span>
              <span className="block bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">
                Comunidade Académica
              </span>
              <span className="block text-4xl md:text-5xl font-bold text-green-100 mt-2">do IPCA</span>
            </h1>
            
            {/* Subtítulo explicativo com melhor espaçamento */}
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-green-50">
              Juntos, criamos uma rede de solidariedade que apoia os nossos estudantes 
              em situação de vulnerabilidade social.
            </p>
          </div>
        </div>
      </div>

      {/* 
        Seção de Campanhas Ativas
        Apresenta dinamicamente as campanhas obtidas da API
        Implementa diferentes estados: loading, com dados, sem dados
      */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho da seção */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Campanhas Ativas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra as iniciativas em curso e como pode contribuir para o bem-estar da nossa comunidade estudantil.
            </p>
          </div>
          
          {/* Renderização condicional baseada no estado */}
          {loading ? (
            // Estado de carregamento melhorado
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-4"></div>
              <p className="text-gray-600 text-lg">A carregar campanhas...</p>
            </div>
          ) : campanhas.length > 0 ? (
            // Estado com dados - Grid responsivo de campanhas melhorado
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campanhas.map(campanha => (
                // Card individual de campanha com design melhorado
                <div key={campanha.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Header do card com gradiente */}
                  <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
                  
                  <div className="p-8">
                    {/* Ícone da campanha */}
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    
                    {/* Nome da campanha */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors">
                      {campanha.nome}
                    </h3>
                    
                    {/* Descrição com fallback para texto padrão */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {campanha.descricao || 'Campanha de apoio à comunidade académica.'}
                    </p>
                    
                    {/* Data de início (opcional) formatada para português */}
                    {campanha.data_inicio && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Início: {new Date(campanha.data_inicio).toLocaleDateString('pt-PT')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Estado sem dados melhorado
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma campanha ativa</h3>
              <p className="text-gray-600">Novas campanhas serão anunciadas em breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InicioPage;