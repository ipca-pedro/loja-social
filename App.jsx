import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const API_URL = 'http://localhost:3000';

// Componente Navbar
const Navbar = ({ paginaAtiva, setPaginaAtiva }) => (
  <nav className="bg-white shadow-md fixed w-full top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-green-700">Loja Social IPCA</h1>
        </div>
        <div className="flex space-x-8">
          {[
            { id: 'inicio', label: 'Início' },
            { id: 'stock', label: 'Stock Disponível' },
            { id: 'doar', label: 'Como Doar' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPaginaAtiva(item.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                paginaAtiva === item.id 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-700 hover:text-green-700'
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

// Componente Footer
const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; 2025 IPCA - Instituto Politécnico do Cávado e do Ave</p>
    </div>
  </footer>
);

// Componente InicioPage
const InicioPage = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampanhas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/campanhas`);
        const data = await response.json();
        setCampanhas(data.success ? data.data : []);
      } catch (error) {
        console.error('Erro ao carregar campanhas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampanhas();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Apoie a Comunidade Académica do IPCA
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Juntos, criamos uma rede de solidariedade que apoia os nossos estudantes 
              em situação de vulnerabilidade social.
            </p>
          </div>
        </div>
      </div>

      {/* Campanhas Ativas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Campanhas Ativas
        </h2>
        
        {loading ? (
          <div className="text-center text-gray-600">A carregar...</div>
        ) : campanhas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campanhas.map(campanha => (
              <div key={campanha.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  {campanha.nome}
                </h3>
                <p className="text-gray-700">
                  {campanha.descricao || 'Campanha de apoio à comunidade académica.'}
                </p>
                {campanha.data_inicio && (
                  <p className="text-sm text-gray-500 mt-3">
                    Início: {new Date(campanha.data_inicio).toLocaleDateString('pt-PT')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Nenhuma campanha ativa no momento.
          </div>
        )}
      </div>
    </div>
  );
};

// Componente StockPage
const StockPage = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/stock-summary`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          // Processar dados para o gráfico
          const categories = {};
          data.data.forEach(item => {
            categories[item.categoria] = (categories[item.categoria] || 0) + 1;
          });
          
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

  const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Transparência de Stock
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Os dados apresentados são agregados e não mostram quantidades exatas, 
          garantindo a privacidade e segurança do nosso inventário, conforme as 
          melhores práticas de gestão social.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-600 py-8">A carregar...</div>
        ) : stockData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-600 py-8">
            Sem dados de stock disponíveis.
          </div>
        )}
      </div>
    </div>
  );
};

// Componente DoarPage
const DoarPage = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.mensagem) {
      setFeedback({ type: 'error', message: 'Email e mensagem são obrigatórios.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/public/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setFeedback({ type: 'success', message: 'Mensagem enviada com sucesso!' });
        setFormData({ nome: '', email: '', mensagem: '' });
      } else {
        setFeedback({ type: 'error', message: 'Erro ao enviar mensagem.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao enviar mensagem.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Informações de Doação */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Como Doar</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Local de Entrega</h3>
            <p className="text-gray-700 mb-4">
              Edifício dos SAS - Campus do IPCA<br />
              Lugar do Aldão, 4750-810 Barcelos
            </p>
            
            <h3 className="text-xl font-semibold text-green-700 mb-4">Horário</h3>
            <p className="text-gray-700 mb-4">Segunda a Sexta: 9h00 - 17h00</p>
            
            <h3 className="text-xl font-semibold text-green-700 mb-4">Produtos Aceites</h3>
            <ul className="text-gray-700 list-disc list-inside space-y-1">
              <li>Produtos alimentares não perecíveis</li>
              <li>Produtos de higiene pessoal</li>
              <li>Material escolar</li>
              <li>Vestuário em bom estado</li>
            </ul>
          </div>
        </div>

        {/* Formulário de Contacto */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contacto</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem *</label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'A enviar...' : 'Enviar Mensagem'}
              </button>
            </form>
            
            {feedback.message && (
              <div className={`mt-4 p-4 rounded-lg ${
                feedback.type === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente App Principal
const App = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('inicio');

  const renderPage = () => {
    switch (paginaAtiva) {
      case 'stock': return <StockPage />;
      case 'doar': return <DoarPage />;
      default: return <InicioPage />;
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Navbar paginaAtiva={paginaAtiva} setPaginaAtiva={setPaginaAtiva} />
      <main className="pt-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;