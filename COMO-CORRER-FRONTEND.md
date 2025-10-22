# 🚀 Como Correr o Frontend React

## Opção 1: Com Node.js (Recomendado)

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# ✅ Abrir no browser: http://localhost:5173
```

## Opção 2: Servidor HTTP Simples

### Python (se tiver instalado)
```bash
# Na pasta web_projects
python -m http.server 8080

# ✅ Abrir: http://localhost:8080/index.html
```

### Node.js serve
```bash
# Instalar serve globalmente
npm install -g serve

# Servir ficheiros estáticos
serve .

# ✅ Abrir: http://localhost:3000/index.html
```

## ⚠️ Nota Importante

O website React precisa da **API backend** para funcionar completamente:
- Sem API: Layout funciona, mas sem dados dinâmicos
- Com API: Funcionalidade completa (campanhas, stock, contacto)

Para testar com dados reais, inicie também o backend:
```bash
docker-compose up -d
```