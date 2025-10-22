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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 
        Cabeçalho da página com explicação sobre transparência
        Implementa o requisito RF7 de não expor quantidades exatas
      */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Transparência de Stock
        </h1>
        
        {/* Texto explicativo sobre a agregação de dados */}
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Os dados apresentados são agregados e não mostram quantidades exatas, 
          garantindo a privacidade e segurança do nosso inventário, conforme as 
          melhores práticas de gestão social.
        </p>
      </div>
      
      {/* 
        Container do gráfico com design consistente
        Largura limitada para melhor legibilidade
      */}
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        {/* Renderização condicional baseada no estado dos dados */}
        {loading ? (
          // Estado de carregamento
          <div className="text-center text-gray-600 py-8">A carregar...</div>
        ) : stockData.length > 0 ? (
          // Gráfico Recharts responsivo
          <ResponsiveContainer width="100%" height={400}>
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
                innerRadius={60}  // Raio interno (furo)
                outerRadius={120} // Raio externo
                paddingAngle={5}  // Espaçamento entre segmentos
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          // Estado sem dados
          <div className="text-center text-gray-600 py-8">
            Sem dados de stock disponíveis.
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;