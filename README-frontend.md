# 🎨 Frontend React - Loja Social IPCA

> **Projeto Académico**: Sistema web modular desenvolvido para demonstrar competências em desenvolvimento frontend moderno

## 📋 Visão Geral

Este frontend implementa uma **Single Page Application (SPA)** em React que serve como interface pública para a Loja Social do IPCA. O projeto segue as melhores práticas de desenvolvimento React e arquitetura modular.

## 🏗️ Arquitetura Modular

### Estrutura de Ficheiros
```
src/
├── components/          # 🧩 Componentes reutilizáveis
│   ├── Navbar.jsx      # Navegação principal com estado ativo
│   └── Footer.jsx      # Rodapé institucional estático
├── pages/              # 📄 Páginas da aplicação (SPA)
│   ├── InicioPage.jsx  # Landing page + campanhas dinâmicas
│   ├── StockPage.jsx   # Gráfico de transparência (Recharts)
│   └── DoarPage.jsx    # Informações + formulário de contacto
├── utils/              # 🔧 Utilitários e serviços
│   └── api.js          # Centralização de chamadas HTTP
├── App.jsx             # 🎯 Componente raiz (state management)
├── main.jsx            # 🚀 Entry point React
└── index.css           # 🎨 Estilos globais Tailwind
```

### Padrões Arquiteturais

#### 1. **Component-Based Architecture**
- **Separação de responsabilidades**: Cada componente tem uma função específica
- **Reutilização**: Componentes modulares podem ser reutilizados
- **Manutenibilidade**: Alterações isoladas não afetam outros componentes

#### 2. **Controlled Components Pattern**
```javascript
// Exemplo: Formulário controlado em DoarPage
const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });

const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

#### 3. **API Abstraction Layer**
```javascript
// Centralização em utils/api.js
export const api = {
  async getCampanhas() { /* ... */ },
  async getStockSummary() { /* ... */ },
  async sendContacto(data) { /* ... */ }
};
```

## 🚀 Comandos de Desenvolvimento

```bash
# 📦 Instalar dependências
npm install

# 🔥 Servidor de desenvolvimento (hot reload)
npm run dev

# 🏗️ Build otimizada para produção
npm run build

# 👀 Preview da build de produção
npm run preview
```

## 🔧 Stack Tecnológico

| Tecnologia | Versão | Propósito | Justificação |
|------------|--------|-----------|-------------|
| **React** | 18.2.0 | Framework principal | Ecosystem maduro, hooks modernos |
| **Vite** | 4.5.0 | Build tool | Performance superior ao CRA |
| **Tailwind CSS** | 3.3.5 | Framework CSS | Utility-first, responsivo |
| **Recharts** | 2.8.0 | Biblioteca de gráficos | Integração nativa com React |
| **Inter Font** | - | Tipografia | Legibilidade profissional |

## 🎨 Design System

### Paleta de Cores IPCA
```javascript
// tailwind.config.js
colors: {
  'ipca-green': {
    700: '#15803d',  // Principal (brand)
    800: '#166534',  // Escuro
  }
}
```

### Princípios de Design
- **Mobile-First**: Design responsivo começando pelo mobile
- **Acessibilidade**: Contrastes adequados, navegação por teclado
- **Consistência**: Componentes reutilizáveis com estilos uniformes

## 🔌 API Integration

Todas as chamadas à API estão centralizadas em `src/utils/api.js`:
- `getCampanhas()` - Lista campanhas
- `getStockSummary()` - Dados de stock
- `sendContacto()` - Envio de mensagens

**📖 Para documentação completa da arquitetura, consulte `ARQUITETURA.md`**