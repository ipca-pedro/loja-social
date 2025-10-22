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
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Título principal com tipografia responsiva */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Apoie a Comunidade Académica do IPCA
            </h1>
            
            {/* Subtítulo explicativo com largura limitada para legibilidade */}
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Campanhas Ativas
        </h2>
        
        {/* Renderização condicional baseada no estado */}
        {loading ? (
          // Estado de carregamento
          <div className="text-center text-gray-600">A carregar...</div>
        ) : campanhas.length > 0 ? (
          // Estado com dados - Grid responsivo de campanhas
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campanhas.map(campanha => (
              // Card individual de campanha
              <div key={campanha.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Nome da campanha */}
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  {campanha.nome}
                </h3>
                
                {/* Descrição com fallback para texto padrão */}
                <p className="text-gray-700">
                  {campanha.descricao || 'Campanha de apoio à comunidade académica.'}
                </p>
                
                {/* Data de início (opcional) formatada para português */}
                {campanha.data_inicio && (
                  <p className="text-sm text-gray-500 mt-3">
                    Início: {new Date(campanha.data_inicio).toLocaleDateString('pt-PT')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Estado sem dados
          <div className="text-center text-gray-600">
            Nenhuma campanha ativa no momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default InicioPage;