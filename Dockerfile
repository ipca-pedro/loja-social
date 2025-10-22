# Dockerfile multi-stage para otimização de produção

# Estágio 1: Build
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar ficheiros de dependências
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci --only=production && npm cache clean --force

# Estágio 2: Produção
FROM node:18-alpine AS production

# Criar utilizador não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar código da aplicação
COPY --chown=nodejs:nodejs . .

# Mudar para utilizador não-root
USER nodejs

# Expor porta da aplicação
EXPOSE 3000

# Comando de saúde para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar a aplicação
CMD ["node", "index.js"]