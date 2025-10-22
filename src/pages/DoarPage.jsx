/**
 * Página de Doação - Informações e contacto para doações
 * 
 * Esta página combina informações estáticas sobre como doar
 * com um formulário de contacto funcional.
 * 
 * Funcionalidades:
 * - Informações de contacto e localização
 * - Formulário controlado com validação
 * - Feedback visual para o utilizador
 * - Estados de loading durante submissão
 * - Reset automático após envio bem-sucedido
 * 
 * Padrões implementados:
 * - Controlled Components para inputs
 * - Validação client-side
 * - Tratamento de erros
 * - UX responsiva
 */

import React, { useState } from 'react';
import { api } from '../utils/api';

/**
 * Componente da página de doação
 * 
 * @returns {JSX.Element} Elemento JSX da página de doação
 */
const DoarPage = () => {
  // Estado para dados do formulário (Controlled Components)
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    mensagem: '' 
  });
  
  // Estado para feedback visual (sucesso/erro)
  const [feedback, setFeedback] = useState({ 
    type: '', 
    message: '' 
  });
  
  // Estado para indicador de carregamento durante submissão
  const [loading, setLoading] = useState(false);

  /**
   * Handler para atualização dos campos do formulário
   * Utiliza o padrão de spread operator para imutabilidade
   * 
   * @param {Event} e - Evento de input
   */
  const handleInputChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  /**
   * Handler para submissão do formulário
   * Implementa validação, envio via API e feedback
   * 
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    // Previne o comportamento padrão do formulário
    e.preventDefault();
    
    // Validação client-side dos campos obrigatórios
    if (!formData.email || !formData.mensagem) {
      setFeedback({ 
        type: 'error', 
        message: 'Email e mensagem são obrigatórios.' 
      });
      return;
    }

    // Ativa estado de loading
    setLoading(true);
    
    try {
      // Envia dados via API centralizada
      const result = await api.sendContacto(formData);
      
      if (result.success) {
        // Sucesso: feedback positivo e reset do formulário
        setFeedback({ 
          type: 'success', 
          message: 'Mensagem enviada com sucesso!' 
        });
        setFormData({ nome: '', email: '', mensagem: '' });
      } else {
        // Erro da API: feedback negativo
        setFeedback({ 
          type: 'error', 
          message: 'Erro ao enviar mensagem.' 
        });
      }
    } catch (error) {
      // Erro de rede/exceção: feedback negativo
      setFeedback({ 
        type: 'error', 
        message: 'Erro ao enviar mensagem.' 
      });
    } finally {
      // Sempre desativa loading
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Como Doar
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            A sua contribuição faz a diferença na vida dos nossos estudantes
          </p>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Informações de Doação */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Informações Importantes</h2>
              </div>
              
              {/* Local de Entrega */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Local de Entrega</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">Edifício dos SAS - Campus do IPCA</p>
                  <p>Lugar do Aldão</p>
                  <p>4750-810 Barcelos</p>
                </div>
              </div>
              
              {/* Horário */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Horário de Funcionamento</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Segunda a Sexta</span>
                    <span className="font-semibold text-gray-900">9h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Fim de Semana</span>
                    <span className="text-red-600 font-medium">Encerrado</span>
                  </div>
                </div>
              </div>
              
              {/* Produtos Aceites */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Produtos Aceites</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Produtos alimentares não perecíveis',
                    'Produtos de higiene pessoal',
                    'Material escolar',
                    'Vestuário em bom estado'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário de Contacto */}
            <div>
              <div className="sticky top-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Entre em Contacto</h2>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="O seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Email *
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="exemplo@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Mensagem *
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        rows="5"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none"
                        placeholder="Escreva a sua mensagem aqui..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>A enviar...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>Enviar Mensagem</span>
                        </>
                      )}
                    </button>
                  </form>
                  
                  {feedback.message && (
                    <div className={`mt-6 p-4 rounded-xl border-2 ${
                      feedback.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {feedback.type === 'success' ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span className="font-medium">{feedback.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoarPage;