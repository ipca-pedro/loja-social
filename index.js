const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rotas
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite pedidos de qualquer origem
app.use(express.json()); // Parse JSON no body das requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/public', publicRoutes);
app.use('/api', adminRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Loja Social IPCA está a funcionar',
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Pública: http://localhost:${PORT}/api/public`);
  console.log(`🔐 API Admin: http://localhost:${PORT}/api`);
});

module.exports = app;