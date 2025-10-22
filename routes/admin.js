const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();

// POST /api/auth/login - Login dos colaboradores com bcrypt
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e password são obrigatórios'
      });
    }

    // Buscar colaborador na base de dados
    const result = await pool.query(
      'SELECT id, nome, email, password_hash FROM colaboradores WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const colaborador = result.rows[0];
    
    // Comparar password com hash usando bcrypt
    const passwordMatch = await bcrypt.compare(password, colaborador.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Login bem-sucedido
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        id: colaborador.id,
        nome: colaborador.nome,
        email: colaborador.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/beneficiarios - Listar beneficiários (placeholder)
router.get('/beneficiarios', async (req, res) => {
  try {
    // TODO: Adicionar autenticação/autorização
    const result = await pool.query('SELECT id, nome_completo, num_estudante, curso, estado FROM beneficiarios ORDER BY nome_completo');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao obter beneficiários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/stock - Adicionar item ao stock (placeholder)
router.post('/stock', async (req, res) => {
  try {
    // TODO: Adicionar autenticação/autorização
    const { produto_id, quantidade_inicial, data_validade, campanha_id, colaborador_id } = req.body;
    
    // Validação básica
    if (!produto_id || !quantidade_inicial || !colaborador_id) {
      return res.status(400).json({
        success: false,
        message: 'Produto, quantidade e colaborador são obrigatórios'
      });
    }

    const result = await pool.query(
      `INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, campanha_id, colaborador_id) 
       VALUES ($1, $2, $2, $3, $4, $5) RETURNING id`,
      [produto_id, quantidade_inicial, data_validade, campanha_id, colaborador_id]
    );

    res.status(201).json({
      success: true,
      message: 'Item adicionado ao stock',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Erro ao adicionar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/entregas/:id/concluir - Concluir entrega (placeholder)
router.put('/entregas/:id/concluir', async (req, res) => {
  try {
    // TODO: Adicionar autenticação/autorização
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE entregas SET estado = $1 WHERE id = $2 RETURNING id, estado',
      ['entregue', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Entrega não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Entrega concluída com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao concluir entrega:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;