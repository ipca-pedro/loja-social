# Estágio 1: Build do Frontend (React + Vite)
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
# Copia ficheiros de dependências do frontend
COPY package.json package-lock.json ./
# Instala dependências do frontend (incluindo devDependencies para build)
RUN npm install
# Copia o resto do código do frontend
COPY . .
# Constrói o frontend
RUN npm run build

# Estágio 2: Build do Backend (Node.js + Express)
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
# Copia ficheiros de dependências do backend (usa o package-backend.json)
COPY package-backend.json ./package.json
COPY package-lock.json ./package-lock.json
# Instala apenas dependências de produção do backend
RUN npm ci --only=production && npm cache clean --force

# Estágio 3: Imagem Final de Produção
FROM node:18-alpine AS production
# Cria utilizador não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
# Copia dependências do backend do estágio anterior
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules
# Copia código do backend (ajusta se a estrutura for diferente)
COPY --chown=nodejs:nodejs index.js ./
COPY --chown=nodejs:nodejs db.js ./
COPY --chown=nodejs:nodejs utils ./utils
COPY --chown=nodejs:nodejs routes ./routes
COPY --chown=nodejs:nodejs package-backend.json ./package.json
# Copia os ficheiros estáticos construídos do frontend para uma pasta 'public'
COPY --from=frontend-builder --chown=nodejs:nodejs /app/frontend/dist ./public
# Mudar para utilizador não-root
USER nodejs
# Expor porta da aplicação
EXPOSE 3000
# Comando de saúde para Docker (mantido do original)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
# Comando para iniciar a aplicação
CMD ["node", "index.js"]