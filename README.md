# 📦 Loja Social IPCA - Sistema Web Completo

> **Projeto Académico IPCA 2024/2025** - Sistema full-stack para gestão de doações e transparência de stock

## 🎯 Visão Geral

Sistema web moderno que moderniza a gestão da Loja Social do IPCA através de:

- **Frontend Público (React)**: Website responsivo para visualização de campanhas e stock
- **Backend API (Node.js)**: API REST segura com autenticação bcrypt
- **Base de Dados (PostgreSQL)**: Schema completo com triggers automáticos
- **Containerização (Docker)**: Deploy simplificado e escalável

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+
- Git

### 1. Clonar Projeto
```bash
git clone https://github.com/ipca-pedro/loja-social.git
cd loja-social
```

### 2. Executar com Docker (Recomendado)
```bash
# Configurar ambiente
cp .env.example .env

# Iniciar backend + base de dados
docker-compose up -d --build

# Verificar se funciona
curl http://localhost:3000/health
```

### 3. Executar Frontend
```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Abrir: http://localhost:5173
```

## 🔧 Desenvolvimento Local

### Backend (API)
```bash
# Usar package.json do backend
cp package-backend.json package.json
npm install

# Gerar hashes de passwords
npm run hash-passwords

# Iniciar API
npm run dev
```

### Frontend (React)
```bash
# Instalar dependências React
npm install

# Servidor de desenvolvimento
npm run dev
```

## 🔐 Autenticação

### Credenciais Padrão
```
Email: admin@lojasocial.pt
Password: password123
```

### Segurança
- Passwords protegidas com **bcrypt** (salt rounds 12)
- Hashes geradas automaticamente
- Login seguro em `/api/auth/login`

## 📋 Endpoints da API

### Públicos
- `GET /api/public/campanhas` - Lista campanhas
- `GET /api/public/stock-summary` - Dados agregados de stock
- `POST /api/public/contacto` - Formulário de contacto

### Administrativos
- `POST /api/auth/login` - Login com bcrypt
- `GET /api/beneficiarios` - Listar beneficiários
- `POST /api/stock` - Adicionar stock
- `PUT /api/entregas/:id/concluir` - Concluir entrega

### Utilitários
- `GET /health` - Health check

## 🗄️ Base de Dados

### Schema Principal
- `colaboradores` - Utilizadores do sistema
- `beneficiarios` - Estudantes apoiados
- `campanhas` - Campanhas de doação
- `stock_items` - Inventário com triggers automáticos
- `entregas` - Gestão de entregas

### Funcionalidades Automáticas
- **Triggers**: Atualização automática de stock após entregas
- **VIEW Segura**: `public_stock_summary` (RF7 - sem quantidades exatas)
- **Constraints**: Integridade referencial garantida

## 🐳 Docker

### Comandos Úteis
```bash
# Ver logs
docker-compose logs api
docker-compose logs db

# Parar serviços
docker-compose down

# Reconstruir
docker-compose up --build
```

### Estrutura
- **API Container**: Node.js + Express
- **DB Container**: PostgreSQL 15
- **Volume**: Persistência de dados
- **Network**: Comunicação interna segura

## 🎨 Frontend

### Tecnologias
- **React 18** - Framework moderno
- **Vite** - Build tool rápido
- **Tailwind CSS** - Styling profissional
- **Recharts** - Gráficos interativos

### Funcionalidades
- **SPA** - Navegação sem reload
- **Responsivo** - Mobile-first design
- **Componentes modulares** - Arquitetura limpa
- **API Integration** - Chamadas centralizadas

## 📁 Estrutura do Projeto

```
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   └── utils/             # Utilitários (API)
├── routes/                # Rotas da API
├── utils/                 # Utilitários backend
├── scripts/               # Scripts auxiliares
├── index.js               # Servidor Express
├── db.js                  # Conexão PostgreSQL
├── docker-compose.yml     # Orquestração
└── bd_lojasocial.sql     # Schema da BD
```

## 🔄 Comandos Principais

```bash
# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build

# Backend
npm run dev          # API desenvolvimento
npm run start        # API produção
npm run hash-passwords # Gerar hashes

# Docker
docker-compose up -d    # Iniciar serviços
docker-compose down     # Parar serviços
docker-compose logs     # Ver logs
```

## 🌐 Deploy Produção

### 1. Servidor (Akamai/Linode)
```bash
# No servidor
git clone <repo-url>
cd loja-social
cp .env.example .env
docker-compose up -d --build
```

### 2. Frontend (Netlify/Vercel)
```bash
# Local
npm run build
# Deploy pasta dist/
```

## 🎓 Valor Académico

### Competências Demonstradas
- **Full-Stack Development** - Frontend + Backend + BD
- **Segurança** - Bcrypt, SQL injection prevention
- **DevOps** - Docker, containerização
- **Arquitetura** - Modular, escalável, maintível
- **Boas Práticas** - Documentação, testes, CI/CD ready

### Tecnologias Modernas
- React 18 com Hooks
- Node.js/Express REST API
- PostgreSQL com triggers
- Docker containerização
- Tailwind CSS design system

## 👥 Equipa

**IPCA - Engenharia de Sistemas Informáticos**
- 25447 Ricardo Marques
- 25446 Vítor Leite  
- 25453 Pedro Vilas Boas
- 25275 J. Filipe Ferreira
- 25457 Danilo Castro

**Orientação**: Sandro Carvalho

---

**📖 Documentação completa**: Ver `ARQUITETURA.md`  
**🔗 Repositório**: https://github.com/ipca-pedro/loja-social  
**📧 Contacto**: Serviços de Ação Social - IPCA