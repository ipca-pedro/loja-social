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

export default DoarPage;