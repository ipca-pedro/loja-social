/**
 * Módulo de API - Centraliza todas as chamadas HTTP para o backend
 * 
 * Este módulo implementa o padrão de separação de responsabilidades,
 * isolando a lógica de comunicação com a API do resto da aplicação.
 * 
 * Vantagens:
 * - Reutilização: Funções podem ser usadas em múltiplos componentes
 * - Manutenção: Mudanças na API só requerem alterações neste ficheiro
 * - Testabilidade: Fácil de mockar para testes unitários
 * - Consistência: Padroniza o tratamento de erros e headers
 */

// URL base da API backend - configurável por ambiente
export const API_URL = 'http://localhost:3000';

/**
 * Objeto que encapsula todas as operações de API
 * Utiliza async/await para programação assíncrona moderna
 */
export const api = {
  /**
   * Obtém a lista de campanhas ativas
   * 
   * @returns {Promise<Object>} Resposta da API com array de campanhas
   * @throws {Error} Erro de rede ou servidor
   */
  async getCampanhas() {
    const response = await fetch(`${API_URL}/api/public/campanhas`);
    return response.json();
  },

  /**
   * Obtém resumo agregado do stock disponível
   * 
   * Esta função consome a VIEW 'public_stock_summary' do PostgreSQL
   * que agrega dados sem expor quantidades exatas (requisito RF7)
   * 
   * @returns {Promise<Object>} Dados agregados por categoria
   * @throws {Error} Erro de rede ou servidor
   */
  async getStockSummary() {
    const response = await fetch(`${API_URL}/api/public/stock-summary`);
    return response.json();
  },

  /**
   * Envia mensagem de contacto através do formulário público
   * 
   * @param {Object} data - Dados do formulário
   * @param {string} data.nome - Nome do remetente (opcional)
   * @param {string} data.email - Email do remetente (obrigatório)
   * @param {string} data.mensagem - Conteúdo da mensagem (obrigatório)
   * @returns {Promise<Object>} Confirmação do envio
   * @throws {Error} Erro de rede, validação ou servidor
   */
  async sendContacto(data) {
    const response = await fetch(`${API_URL}/api/public/contacto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};