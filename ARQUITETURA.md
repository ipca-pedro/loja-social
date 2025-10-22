# 🏗️ Arquitetura do Projeto - Loja Social IPCA

## 📋 Visão Geral

Este documento detalha a arquitetura completa do projeto "Loja Social IPCA", um sistema web full-stack desenvolvido para apoiar a gestão de doações e transparência de stock da instituição.

## 🎯 Objetivos do Projeto

- **Transparência**: Permitir visualização pública do stock sem expor quantidades exatas
- **Gestão**: Facilitar o controlo interno de doações e entregas
- **Comunicação**: Fornecer canal de contacto para potenciais doadores
- **Profissionalismo**: Demonstrar competências técnicas em desenvolvimento web moderno

## 🏛️ Arquitetura Geral

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    SQL    ┌─────────────────┐
│                 │ ◄──────────────► │                 │ ◄────────► │                 │
│   Frontend      │                 │   Backend API   │           │   PostgreSQL    │
│   (React SPA)   │                 │   (Node.js)     │           │   Database      │
│                 │                 │                 │           │                 │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
```

## 🎨 Frontend - React SPA

### Estrutura Modular

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navbar.jsx      # Navegação principal
│   └── Footer.jsx      # Rodapé institucional
├── pages/              # Páginas da aplicação
│   ├── InicioPage.jsx  # Landing page com campanhas
│   ├── StockPage.jsx   # Visualização de transparência
│   └── DoarPage.jsx    # Informações e contacto
├── utils/              # Utilitários e serviços
│   └── api.js          # Centralização de chamadas HTTP
├── App.jsx             # Componente raiz
├── main.jsx            # Entry point React
└── index.css           # Estilos globais Tailwind
```

### Padrões Arquiteturais Implementados

#### 1. **Single Page Application (SPA)**
- Navegação sem recarregamento de página
- Estado centralizado no componente App
- Renderização condicional baseada em estado

#### 2. **Component-Based Architecture**
- Separação clara de responsabilidades
- Componentes reutilizáveis e modulares
- Props drilling controlado

#### 3. **Controlled Components**
- Formulários geridos por estado React
- Validação client-side
- Feedback imediato ao utilizador

#### 4. **API Abstraction Layer**
- Centralização de chamadas HTTP em `api.js`
- Reutilização e manutenibilidade
- Tratamento consistente de erros

### Tecnologias Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.2.0 | Framework principal |
| **Vite** | 4.5.0 | Build tool e dev server |
| **Tailwind CSS** | 3.3.5 | Framework CSS utilitário |
| **Recharts** | 2.8.0 | Biblioteca de gráficos |
| **Inter Font** | - | Tipografia profissional |

### Estados e Ciclo de Vida

```javascript
// Exemplo de gestão de estado típica
const [data, setData] = useState([]);           // Dados da API
const [loading, setLoading] = useState(true);   // Estado de carregamento
const [error, setError] = useState(null);       // Tratamento de erros

useEffect(() => {
  // Carregamento de dados na montagem
  fetchData();
}, []); // Dependency array vazio = executa uma vez
```

## 🔧 Backend - Node.js API

### Estrutura Modular

```
├── index.js              # Servidor Express principal
├── db.js                 # Pool de conexões PostgreSQL
├── routes/
│   ├── public.js         # Rotas públicas (website)
│   └── admin.js          # Rotas administrativas (app)
├── package.json          # Dependências e scripts
├── Dockerfile            # Containerização
├── docker-compose.yml    # Orquestração de serviços
└── bd_lojasocial.sql     # Schema da base de dados
```

### Endpoints da API

#### Rotas Públicas (`/api/public/`)
```javascript
GET  /stock-summary    // Dados agregados de stock (RF7)
GET  /campanhas        // Lista de campanhas ativas
POST /contacto         // Envio de mensagens de contacto
```

#### Rotas Administrativas (`/api/`)
```javascript
POST /auth/login           // Autenticação de colaboradores
GET  /beneficiarios        // Listagem de beneficiários
POST /stock               // Adição de itens ao stock
PUT  /entregas/:id/concluir // Conclusão de entregas
```

### Tecnologias Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express.js** | 4.18.2 | Framework web |
| **PostgreSQL** | 15 | Base de dados relacional |
| **pg (node-postgres)** | 8.11.3 | Driver PostgreSQL |
| **Docker** | - | Containerização |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |

### Middleware Stack

```javascript
app.use(cors());                    // Permite requests cross-origin
app.use(express.json());            // Parse JSON bodies
app.use(express.urlencoded());      // Parse form data
app.use(logging);                   // Request logging
app.use('/api/public', publicRoutes); // Rotas públicas
app.use('/api', adminRoutes);       // Rotas administrativas
```

## 🗄️ Base de Dados - PostgreSQL

### Schema Principal

```sql
-- Tabelas principais
colaboradores     -- Utilizadores do sistema
beneficiarios     -- Estudantes apoiados
campanhas         -- Campanhas de doação
categorias        -- Categorias de produtos
produtos          -- Definição de produtos
stock_items       -- Inventário real
entregas          -- Registos de entregas
detalhes_entrega  -- Itens por entrega
mensagens_contacto -- Formulário público
```

### VIEW de Transparência (RF7)

```sql
CREATE VIEW public_stock_summary AS
SELECT
    cat.nome AS categoria,
    prod.nome AS produto,
    COUNT(DISTINCT si.produto_id) AS disponibilidade,
    MIN(si.data_validade) AS validade_proxima
FROM stock_items si
JOIN produtos prod ON si.produto_id = prod.id
JOIN categorias cat ON prod.categoria_id = cat.id
WHERE si.quantidade_atual > 0
  AND (si.data_validade IS NULL OR si.data_validade > CURRENT_DATE)
GROUP BY cat.nome, prod.nome;
```

### Triggers Automáticos

```sql
-- Atualização automática de stock após entregas
CREATE TRIGGER trg_on_entrega_concluida
AFTER UPDATE ON entregas
FOR EACH ROW
WHEN (NEW.estado = 'entregue')
EXECUTE FUNCTION fn_atualizar_stock_apos_entrega();
```

## 🐳 DevOps e Deployment

### Containerização Docker

#### Multi-stage Dockerfile
```dockerfile
# Estágio 1: Build dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Estágio 2: Production image
FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 3000
CMD ["node", "index.js"]
```

#### Docker Compose Orchestration
```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: loja_social_db
    volumes:
      - ./bd_lojasocial.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - postgres_data:/var/lib/postgresql/data
    
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/loja_social_db
```

### Health Checks

```javascript
// API Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Loja Social IPCA está a funcionar',
    timestamp: new Date().toISOString()
  });
});
```

## 🔒 Segurança e Boas Práticas

### Frontend
- **Validação Client-side**: Validação de formulários antes do envio
- **Error Boundaries**: Tratamento gracioso de erros React
- **Sanitização**: Prevenção de XSS através de JSX
- **HTTPS Ready**: Preparado para deployment seguro

### Backend
- **CORS Configurado**: Controlo de origens permitidas
- **Input Validation**: Validação de dados de entrada
- **SQL Injection Prevention**: Uso de prepared statements
- **Non-root Container**: Execução com utilizador não-privilegiado

### Base de Dados
- **Constraints**: Integridade referencial garantida
- **Triggers**: Lógica de negócio automática
- **Views**: Abstração de dados sensíveis
- **Indexes**: Performance otimizada

## 📊 Fluxo de Dados

### 1. Carregamento de Campanhas
```
InicioPage → useEffect → api.getCampanhas() → GET /api/public/campanhas → PostgreSQL → VIEW → JSON → setState → Render
```

### 2. Visualização de Stock
```
StockPage → useEffect → api.getStockSummary() → GET /api/public/stock-summary → public_stock_summary VIEW → Recharts → Donut Chart
```

### 3. Envio de Contacto
```
DoarPage → Form Submit → Validation → api.sendContacto() → POST /api/public/contacto → INSERT mensagens_contacto → Success Feedback
```

## 🚀 Performance e Otimização

### Frontend
- **Code Splitting**: Componentes carregados sob demanda
- **Lazy Loading**: Imagens e recursos otimizados
- **Memoization**: React.memo para componentes estáticos
- **Bundle Optimization**: Vite tree-shaking automático

### Backend
- **Connection Pooling**: Pool de conexões PostgreSQL
- **Caching Headers**: Cache de recursos estáticos
- **Compression**: Gzip para responses JSON
- **Health Checks**: Monitorização automática

### Base de Dados
- **Indexes**: Otimização de queries frequentes
- **Views**: Pré-computação de dados agregados
- **Constraints**: Validação ao nível da BD
- **Triggers**: Lógica automática eficiente

## 🧪 Testabilidade

### Estrutura Modular
- **Unit Tests**: Cada componente testável isoladamente
- **Integration Tests**: APIs testáveis com mocks
- **E2E Tests**: Fluxos completos testáveis

### Mocking Strategy
```javascript
// Exemplo de mock da API para testes
jest.mock('../utils/api', () => ({
  api: {
    getCampanhas: jest.fn(() => Promise.resolve({ success: true, data: [] }))
  }
}));
```

## 📈 Escalabilidade

### Horizontal Scaling
- **Stateless API**: Múltiplas instâncias possíveis
- **Database Pooling**: Conexões otimizadas
- **Container Ready**: Deploy em Kubernetes

### Vertical Scaling
- **Efficient Queries**: Views otimizadas
- **Memory Management**: Garbage collection otimizada
- **Resource Limits**: Containers com limites definidos

## 🔄 Manutenibilidade

### Code Organization
- **Separation of Concerns**: Cada módulo com responsabilidade única
- **DRY Principle**: Reutilização de código
- **SOLID Principles**: Design orientado a objetos
- **Documentation**: Comentários detalhados

### Version Control
- **Git Flow**: Branches organizadas
- **Semantic Versioning**: Versionamento consistente
- **Commit Messages**: Mensagens descritivas
- **Code Reviews**: Qualidade garantida

## 🎓 Valor Académico

Este projeto demonstra competências em:

1. **Full-Stack Development**: Frontend + Backend + Database
2. **Modern JavaScript**: ES6+, async/await, modules
3. **React Ecosystem**: Hooks, state management, component architecture
4. **Node.js Backend**: Express, middleware, REST APIs
5. **Database Design**: PostgreSQL, views, triggers, constraints
6. **DevOps**: Docker, containerization, orchestration
7. **Security**: Best practices, validation, sanitization
8. **Performance**: Optimization, caching, efficient queries
9. **Documentation**: Professional code documentation
10. **Project Architecture**: Scalable, maintainable design

---

**Desenvolvido por**: [Seu Nome]  
**Instituição**: IPCA - Instituto Politécnico do Cávado e do Ave  
**Ano Letivo**: 2024/2025