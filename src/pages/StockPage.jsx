/**
 * Página de Stock - Visualização de transparência do inventário
 * 
 * Esta página implementa o requisito RF7 de transparência pública do stock.
 * Apresenta dados agregados sem revelar quantidades exatas por segurança.
 * 
 * Funcionalidades:
 * - Gráfico donut interativo com Recharts
 * - Dados obtidos da VIEW 'public_stock_summary' do PostgreSQL
 * - Processamento de dados para visualização
 * - Estados de loading e erro
 * 
 * Tecnologias:
 * - Recharts: Biblioteca de gráficos React
 * - ResponsiveContainer: Gráfico responsivo
 * - PieChart: Gráfico circular com furo central (donut)
 */

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../utils/api';

/**
 * Componente da página de stock
 * 
 * @returns {JSX.Element} Elemento JSX da página de stock
 */
const StockPage = () => {
  // Estado para armazenar dados processados para o gráfico
  const [stockData, setStockData] = useState([]);
  
  // Estado para controlar o indicador de carregamento
  const [loading, setLoading] = useState(true);

  /**
   * Effect hook para carregar e processar dados de stock
   */
  useEffect(() => {
    /**
     * Função assíncrona para buscar e processar dados de stock
     * Transforma dados da API em formato adequado para o gráfico
     */
    const fetchStock = async () => {
      try {
        // Obtém dados da VIEW public_stock_summary
        const data = await api.getStockSummary();
        
        if (data.success && data.data.length > 0) {
          // Processa dados: agrupa por categoria e conta itens
          const categories = {};
          data.data.forEach(item => {
            categories[item.categoria] = (categories[item.categoria] || 0) + 1;
          });
          
          // Transforma objeto em array para o Recharts
          const chartData = Object.entries(categories).map(([categoria, count]) => ({
            categoria,
            value: count
          }));
          
          setStockData(chartData);
        }
      } catch (error) {
        console.error('Erro ao carregar stock:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStock();
  }, []);

  // Paleta de cores verde IPCA para o gráfico
  const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* 
        Cabeçalho da página com explicação sobre transparência
        Implementa o requisito RF7 de não expor quantidades exatas
      */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Badge de transparência */}
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dados Verificados e Seguros
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              <span className="block">Transparência de</span>
              <span className="block bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Stock
              </span>
            </h1>
            

          </div>
          
          {/* 
            Container do gráfico com design melhorado
            Layout responsivo com informações adicionais
          */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Informações laterais */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Como Interpretar</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  O gráfico mostra a distribuição por categorias de produtos, 
                  sem revelar quantidades específicas por questões de segurança.
                </p>
              </div>
              

            </div>
            
            {/* Container principal do gráfico */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Renderização condicional baseada no estado dos dados */}
                {loading ? (
                  // Estado de carregamento melhorado
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200"></div>
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    </div>
                    <p className="text-gray-600 text-lg mt-6">A carregar dados do stock...</p>
                    <p className="text-gray-400 text-sm mt-2">Processando informações agregadas</p>
                  </div>
                ) : stockData.length > 0 ? (
                  <div>
                    {/* Título do gráfico */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Distribuição por Categoria</h3>
                      <p className="text-gray-600">Visão geral do stock disponível</p>
                    </div>
                    
                    {/* Gráfico Recharts responsivo */}
                    <ResponsiveContainer width="100%" height={450}>
                      <PieChart>
                        {/* 
                          Componente Pie configurado como donut
                          - innerRadius: cria o furo central
                          - outerRadius: define o tamanho do gráfico
                          - paddingAngle: espaçamento entre segmentos
                        */}
                        <Pie
                          data={stockData}
                          cx="50%"          // Centro horizontal
                          cy="50%"          // Centro vertical
                          innerRadius={80}  // Raio interno (furo)
                          outerRadius={160} // Raio externo
                          paddingAngle={3}  // Espaçamento entre segmentos
                          dataKey="value"   // Campo dos dados a usar
                        >
                          {/* Mapeia cores para cada segmento do gráfico */}
                          {stockData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        
                        {/* Legenda automática baseada nos dados */}
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                          wrapperStyle={{
                            paddingTop: '20px',
                            fontSize: '14px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Estatísticas adicionais */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                      {stockData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                          <p className="text-sm font-medium text-gray-900">{item.categoria}</p>
                          <p className="text-xs text-gray-500">{item.value} tipos</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Estado sem dados melhorado
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sem dados de stock</h3>
                    <p className="text-gray-600">Os dados serão atualizados automaticamente quando disponíveis.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPage;