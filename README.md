# Loja Social IPCA - API Backend

API Backend para o projeto "Loja Social IPCA" desenvolvida em Node.js com Express.js e PostgreSQL.

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)

### Configuração com Docker (Recomendado)

1. **Clonar e configurar o projeto:**
```bash
# Copiar ficheiro de ambiente
cp .env.example .env
```

2. **Iniciar os serviços:**
```bash
# Construir e iniciar API + Base de Dados
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

3. **Verificar se está a funcionar:**
- API: http://localhost:3000/health
- Base de Dados: localhost:5432

### Desenvolvimento Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar .env com as suas configurações
```

3. **Iniciar em modo desenvolvimento:**
```bash
npm run dev
```

## 📋 Endpoints da API

### Rotas Públicas (Website)
- `GET /api/public/stock-summary` - Resumo público do stock
- `GET /api/public/campanhas` - Lista de campanhas
- `POST /api/public/contacto` - Formulário de contacto

### Rotas Administrativas (App Android)
- `POST /api/auth/login` - Login dos colaboradores
- `GET /api/beneficiarios` - Listar beneficiários
- `POST /api/stock` - Adicionar item ao stock
- `PUT /api/entregas/:id/concluir` - Concluir entrega

### Utilitários
- `GET /health` - Health check da API

## 🗄️ Base de Dados

A base de dados PostgreSQL é inicializada automaticamente com o esquema definido em `bd_lojasocial.sql`.

## 🐳 Comandos Docker Úteis

```bash
# Ver logs da API
docker-compose logs api

# Ver logs da Base de Dados
docker-compose logs db

# Parar serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados da BD)
docker-compose down -v

# Reconstruir apenas a API
docker-compose build api
```

## 📁 Estrutura do Projeto

```
├── index.js              # Ficheiro principal da aplicação
├── db.js                 # Configuração da base de dados
├── routes/
│   ├── public.js         # Rotas públicas (website)
│   └── admin.js          # Rotas administrativas (app)
├── package.json          # Dependências Node.js
├── Dockerfile            # Configuração Docker da API
├── docker-compose.yml    # Orquestração dos serviços
├── bd_lojasocial.sql     # Esquema da base de dados
└── .env.example          # Exemplo de variáveis de ambiente
```

## 🔧 Variáveis de Ambiente

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/loja_social_db
```

## 📝 Notas de Desenvolvimento

- As rotas administrativas são placeholders que precisam de implementação de autenticação
- A API está preparada para deployment em produção com Docker
- O esquema da base de dados inclui triggers automáticos para gestão de stock
- Todos os endpoints retornam JSON com formato consistente