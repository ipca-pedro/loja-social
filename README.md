📦 Projeto Loja Social IPCA - Solução Digital Integrada

Projeto académico desenvolvido no âmbito das unidades curriculares de Projeto Aplicado e Programação para Dispositivos Móveis (Android) da Licenciatura em Engenharia de Sistemas Informáticos do IPCA.

Ano Letivo: 2025/2026

Equipa:

25447 Ricardo Marques

25446 Vítor Leite

25453 Pedro Vilas Boas

25275 J. Filipe Ferreira

25457 Danilo Castro

Orientação: Sandro Carvalho

📖 Índice

🎯 Visão Geral

✨ Funcionalidades Atuais

🏛️ Arquitetura Detalhada

Arquitetura Geral

🎨 Frontend - React SPA

Estrutura Modular (Frontend)

Padrões Arquiteturais (Frontend)

Tecnologias (Frontend)

Estados e Ciclo de Vida

Design System

🔧 Backend - Node.js API

Estrutura Modular (Backend)

Endpoints da API

Tecnologias (Backend)

Middleware Stack

🗄️ Base de Dados - PostgreSQL

Schema Principal

VIEW de Transparência (RF7)

Triggers Automáticos

📊 Fluxo de Dados Exemplos

🔒 Segurança e Boas Práticas

🔧 Stack Tecnológico Completo

🚀 Como Executar Localmente (Recomendado com Docker)

Pré-requisitos

Configuração Inicial

Iniciar os Serviços Docker

Aceder ao Frontend

Verificar Serviços

Parar os Serviços Docker

Comandos Docker Úteis

☁️ Implementação na Akamai Connected Cloud (Linode)

Passo 1: Preparar o Servidor Akamai (Linode)

Passo 2: Instalar Docker e Docker Compose no Servidor

Passo 3: Transferir o Código do Projeto para o Servidor

Passo 4: Configurar e Executar os Containers Docker no Servidor

Passo 5: Aceder à Aplicação e Configurar o Frontend

Passo 6: (Opcional mas Recomendado) Configurações de Produção

🚧 Próximos Passos e Contribuição (Awareness para Colegas)

Tarefas Pendentes / Áreas para Contribuir

Como Contribuir

🎓 Valor Académico

🎯 Visão Geral

Este projeto visa modernizar a gestão da Loja Social do IPCA através de uma solução digital integrada, composta por:

Frontend Público (Website): Uma Single Page Application (SPA) desenvolvida em React para a comunidade académica e doadores. Apresenta informações sobre campanhas, permite a visualização agregada do stock (sem quantidades exatas - RF7) e facilita o contacto para doações.

Backend (API REST): Uma API desenvolvida em Node.js com Express.js que serve como intermediário seguro entre as aplicações e a base de dados. Contém a lógica de negócio e gere o acesso aos dados.

Base de Dados: Uma base de dados PostgreSQL para armazenar toda a informação (beneficiários, stock, campanhas, entregas, etc.).

Aplicação Móvel (Android - Futura): Uma aplicação nativa para uso interno dos colaboradores dos Serviços de Ação Social (SAS) para gestão de beneficiários, inventário e entregas. (A ser desenvolvida noutra UC).

Este repositório contém o código do Frontend Público e do Backend API, configurados para serem executados localmente e implementados através de Docker.

✨ Funcionalidades Atuais (Foco Website Público)

Página Inicial: Apresentação institucional e listagem dinâmica de campanhas ativas obtidas da API.

Página de Stock: Visualização gráfica (donut chart) da distribuição do stock por categoria (dados agregados, sem quantidades exatas - RF7).

Página Como Doar: Informações estáticas (local, horário) e formulário de contacto funcional para envio de mensagens via API.

Design Responsivo: Interface adaptada para desktop, tablet e mobile (Mobile-First).

Estética Profissional: Utilização de Tailwind CSS com a paleta de cores do IPCA.

🏛️ Arquitetura Detalhada

Arquitetura Geral

O sistema segue uma arquitetura moderna desacoplada:

┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    SQL    ┌─────────────────┐
│                 │ ◄──────────────► │                 │ ◄────────► │                 │
│   Frontend      │                 │   Backend API   │           │   PostgreSQL    │
│   (React SPA)   │                 │   (Node.js)     │           │   Database      │
│     (Vite)      │                 │   (Express)     │           │ (Docker Container)│
│                 │                 │(Docker Container)│           │                 │
└─────────────────┘                 └─────────────────┘           └─────────────────┘


🎨 Frontend - React SPA

O frontend implementa uma Single Page Application (SPA) em React, servindo como interface pública para a Loja Social do IPCA.

Estrutura Modular (Frontend)

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


Padrões Arquiteturais (Frontend)

Component-Based Architecture:

Separação de responsabilidades: Cada componente tem uma função específica.

Reutilização: Componentes modulares (Navbar, Footer) podem ser reutilizados.

Manutenibilidade: Alterações isoladas não afetam outros componentes.

Single Page Application (SPA):

Navegação sem recarregamento de página.

Estado de navegação centralizado no componente App.jsx.

Renderização condicional das páginas baseada no estado paginaAtiva.

Controlled Components Pattern:

O formulário na DoarPage.jsx é controlado pelo estado React (formData).

Validação client-side básica implementada.

// Exemplo: Formulário controlado em DoarPage.jsx
const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });

const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};


API Abstraction Layer:

Todas as chamadas HTTP ao backend estão centralizadas em src/utils/api.js.

Facilita a manutenção (mudanças na URL da API só precisam ser feitas aqui).

Permite tratamento consistente de erros e headers no futuro.

// Centralização em src/utils/api.js
export const api = {
  async getCampanhas() { /* ... */ },
  async getStockSummary() { /* ... */ },
  async sendContacto(data) { /* ... */ }
};


Tecnologias (Frontend)

Tecnologia

Versão

Propósito

Justificação

React

18.2.0

Framework principal

Ecossistema maduro, hooks modernos

Vite

4.5.0

Build tool

Performance superior ao CRA

Tailwind

3.3.5

Framework CSS

Utility-first, responsivo

Recharts

2.8.0

Gráficos

Integração nativa com React

Inter

-

Tipografia

Legibilidade profissional

Estados e Ciclo de Vida

O estado principal da navegação (paginaAtiva) é gerido no App.jsx usando useState.

As páginas (InicioPage.jsx, StockPage.jsx) usam useState para gerir os seus dados (ex: campanhas, stockData) e estados de UI (ex: loading).

O hook useEffect é usado nas páginas para buscar dados da API quando o componente é montado (com um array de dependências vazio []).

// Exemplo de gestão de estado e busca de dados em InicioPage.jsx
const [campanhas, setCampanhas] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCampanhas = async () => {
    // ... busca dados da API ...
    setCampanhas(data.success ? data.data : []);
    setLoading(false);
  };
  fetchCampanhas();
}, []); // Array vazio = executa apenas na montagem


Design System

Paleta de Cores IPCA: Definida em tailwind.config.js (ipca-green).

// tailwind.config.js
theme: {
  extend: {
    colors: {
      'ipca-green': {
        // ... tons de verde ...
        700: '#15803d', // Principal
      }
    }
  }
}


Princípios: Mobile-First, acessibilidade (contrastes), consistência.

Tipografia: Fonte Inter (importada em src/index.css).

🔧 Backend - Node.js API

API RESTful que serve como intermediário seguro entre o frontend/app móvel e a base de dados.

Estrutura Modular (Backend)

├── index.js              # 🚀 Servidor Express principal
├── db.js                 # 🐘 Pool de conexões PostgreSQL
├── routes/               # 🛣️ Definição dos endpoints
│   ├── public.js         # Rotas públicas (website)
│   └── admin.js          # Rotas administrativas (app Android - placeholders)
├── utils/                # (Ex: auth.js - para futuras funções de autenticação)
│   └── auth.js           # (Placeholder para funções de hash/JWT)
├── package.json          # 📦 Dependências Node.js
├── Dockerfile            # 🐳 Containerização da API
├── docker-compose.yml    # 🚢 Orquestração API + BD
├── bd_lojasocial.sql     # 📜 Schema e dados iniciais da BD
├── .env.example          # ⚙️ Exemplo de variáveis de ambiente
└── .env                  # 🔑 (Ignorado pelo Git) Variáveis de ambiente reais


Endpoints da API

Rotas Públicas (/api/public/) - Acessíveis pelo Website:

GET /stock-summary: Retorna dados agregados de stock da VIEW public_stock_summary (RF7).

GET /campanhas: Lista campanhas ativas.

POST /contacto: Recebe dados do formulário de contacto e insere na tabela mensagens_contacto.

Rotas Administrativas (/api/) - A serem consumidas pela App Android (atualmente com lógica placeholder):

POST /login: (Placeholder) Deverá receber email/password, verificar hash com bcrypt e retornar um token JWT.

GET /beneficiarios: (Placeholder com query simples) Deverá listar beneficiários (protegido por token).

POST /stock: (Placeholder com query simples) Deverá adicionar item ao stock (protegido por token).

PUT /entregas/:id/concluir: (Placeholder com query simples) Deverá marcar uma entrega como 'entregue' (protegido por token). O trigger na BD tratará de abater ao stock.

(Outras rotas CRUD para gestão serão necessárias)

Tecnologias (Backend)

Tecnologia

Versão

Propósito

Node.js

18+

Runtime JavaScript

Express.js

4.18.2

Framework web

node-postgres (pg)

8.11.3

Driver PostgreSQL

dotenv

^16.0

Gestão de variáveis ambiente

cors

2.8.5

Cross-Origin Resource Sharing

Docker

-

Containerização

Middleware Stack

A ordem dos middlewares em index.js é importante:

app.use(cors());                    // Permite pedidos cross-origin (importante para dev local)
app.use(express.json());            // Parse de JSON no body das requests
app.use(express.urlencoded());      // Parse de Form data (menos comum para APIs JSON)
// ... (futuro middleware de autenticação para rotas admin) ...
app.use('/api/public', publicRoutes); // Regista as rotas públicas
app.use('/api', adminRoutes);       // Regista as rotas administrativas (protegidas)
// ... (middleware de tratamento de erros) ...


🗄️ Base de Dados - PostgreSQL

Armazena os dados da aplicação de forma relacional.

Schema Principal

Definido em bd_lojasocial.sql. Tabelas principais:

colaboradores: Utilizadores da app Android (com password_hash).

beneficiarios: Estudantes apoiados (dados pessoais - RGPD!).

campanhas: Campanhas de doação.

categorias: Categorias de produtos.

produtos: Definição de produtos.

stock_items: Inventário real (lotes de produtos com quantidade, validade, etc.).

entregas: Registos de agendamento e estado das entregas.

detalhes_entrega: Itens específicos (lotes de stock_items) incluídos em cada entrega.

mensagens_contacto: Mensagens recebidas do formulário público.

VIEW de Transparência (RF7)

A VIEW public_stock_summary em bd_lojasocial.sql é crucial para a segurança e cumpre o RF7:

CREATE OR REPLACE VIEW public_stock_summary AS
SELECT
    cat.nome AS categoria,
    prod.nome AS produto,
    -- Conta quantos "lotes" (registos) existem com quantidade > 0 e válidos
    COUNT(si.id) AS disponibilidade_lotes, -- NÃO expõe quantidade total
    -- Mostra a data de validade mais próxima para esse produto
    MIN(si.data_validade) AS validade_proxima
FROM stock_items si
JOIN produtos prod ON si.produto_id = prod.id
JOIN categorias cat ON prod.categoria_id = cat.id
WHERE
    si.quantidade_atual > 0 -- Só stock existente
    AND (si.data_validade IS NULL OR si.data_validade >= CURRENT_DATE) -- Só produtos válidos
GROUP BY cat.nome, prod.nome;


Triggers Automáticos

O trigger trg_on_entrega_concluida associado à função fn_atualizar_stock_apos_entrega em bd_lojasocial.sql automatiza a atualização do stock_items.quantidade_atual quando uma entrega é marcada como 'entregue' (ou revertida), garantindo a integridade dos dados (RF3).

📊 Fluxo de Dados Exemplos

Carregamento de Campanhas (Início):
InicioPage (React useEffect) → api.getCampanhas() (JS fetch) → GET /api/public/campanhas (Node/Express) → SELECT * FROM campanhas (PostgreSQL) → JSON → setState → Renderização dos cards.

Visualização de Stock:
StockPage (React useEffect) → api.getStockSummary() → GET /api/public/stock-summary → SELECT * FROM public_stock_summary (PostgreSQL View) → JSON (dados agregados) → Processamento para Recharts → setState → Renderização do gráfico Donut.

Envio de Contacto:
DoarPage (React handleSubmit) → Validação → api.sendContacto(formData) → POST /api/public/contacto → INSERT INTO mensagens_contacto (PostgreSQL) → JSON (sucesso/erro) → setState (feedback).

(Futuro) Concluir Entrega (App Android):
App Android (Botão "Concluir") → Request à API (com Token JWT) → PUT /api/entregas/:id/concluir → Middleware de Autenticação → UPDATE entregas SET estado = 'entregue' (PostgreSQL) → Trigger trg_on_entrega_concluida → UPDATE stock_items SET quantidade_atual = ... (PostgreSQL) → Resposta à App.

🔒 Segurança e Boas Práticas

Frontend:

Validação básica client-side no formulário.

JSX previne XSS por defeito.

Nenhuma lógica sensível ou credenciais expostas.

Backend:

CORS configurado para permitir pedidos (ajustar em produção para origens específicas).

Validação de input (ainda por implementar).

Prevenção de SQL Injection (uso de queries parametrizadas com node-postgres).

Dockerfile configurado para correr com utilizador não-root (nodejs).

Autenticação JWT (A implementar): Essencial para proteger as rotas /api/admin/*.

Hashing de Passwords (A implementar): Usar bcrypt para password_hash.

Base de Dados:

Constraints (Foreign Keys, Checks) garantem integridade referencial.

Triggers automatizam lógica crítica.

VIEW public_stock_summary expõe apenas dados seguros.

Credenciais de acesso geridas via variáveis de ambiente (.env).

🔧 Stack Tecnológico Completo

Frontend: React 18, Vite, Tailwind CSS, Recharts

Backend: Node.js 18+, Express.js, node-postgres (pg), dotenv, cors (futuramente: bcrypt, jsonwebtoken)

Base de Dados: PostgreSQL 15

DevOps: Docker, Docker Compose

Tipografia: Inter

🚀 Como Executar Localmente (Recomendado com Docker)

A forma mais simples e recomendada para executar todo o sistema (Frontend + Backend + BD) localmente, garantindo que funciona como em produção:

Pré-requisitos

Docker e Docker Compose instalados (Docker Desktop é a forma mais fácil).

Node.js e npm (v18+ recomendado) - necessário para o frontend.

Git.

Configuração Inicial

Clonar o Repositório:

git clone <URL_DO_REPOSITORIO_GIT>
cd nome_da_pasta_do_projeto


Configurar Variáveis de Ambiente (Backend):

Na raiz do projeto, copie o ficheiro de exemplo:

cp .env.example .env


Não precisa de editar o .env se for correr apenas com Docker Compose localmente. As configurações no docker-compose.yml (utilizador/password loja_social_..., host db) já estão preparadas para a comunicação entre os containers.

Iniciar os Serviços Docker

Construir e Iniciar os Containers (API + BD):

Abra um terminal na raiz do projeto.

Execute o comando:

docker compose up --build -d


--build: Garante que a imagem Docker da API é construída (ou reconstruída se houver alterações no Dockerfile ou código).

-d: Executa os containers em background (detached mode). Remova -d para ver os logs diretamente no terminal.

Na primeira execução, isto pode demorar um pouco enquanto faz download da imagem do PostgreSQL e constrói a imagem da API.

O Docker Compose irá:

Criar uma rede interna para os containers comunicarem.

Iniciar o container db (PostgreSQL).

Esperar que a BD esteja pronta (usando o healthcheck).

Executar o script bd_lojasocial.sql para criar o schema e popular com dados iniciais.

Construir a imagem api (se ainda não existir ou --build for usado).

Iniciar o container api (Node.js/Express), que se ligará ao container db.

Aceder ao Frontend

Instalar Dependências e Iniciar o Servidor de Desenvolvimento (Vite):

Abra outro terminal (ou use o mesmo se parou o docker compose up sem -d).

Navegue até à raiz do projeto (onde está o package.json do frontend).

Instale as dependências do frontend:

npm install


Inicie o servidor de desenvolvimento Vite:

npm run dev


Abrir no Browser:

O Vite indicará o endereço (normalmente http://localhost:5173). Abra-o no seu browser.

Verificar Serviços

Frontend: Deverá ver o site em http://localhost:5173.

API Health Check: Abra http://localhost:3000/health no browser. Deverá ver uma mensagem JSON indicando que a API está a funcionar.

(Opcional) Base de Dados: Pode usar uma ferramenta como DBeaver, pgAdmin ou a extensão do VS Code para ligar-se à base de dados em localhost:5432 com o utilizador loja_social_user, password loja_social_password e base de dados loja_social_db (definidos no docker-compose.yml).

Parar os Serviços Docker

Para parar os containers (API e BD):

docker compose down


Importante: Se quiser apagar os dados da base de dados (para recomeçar com os dados iniciais do .sql na próxima vez que executar up), use:

docker compose down -v


(-v remove os volumes associados).

🐳 Comandos Docker Úteis

Ver estado dos containers: docker compose ps

Ver logs da API: docker compose logs api (ou docker compose logs -f api para seguir em tempo real)

Ver logs da BD: docker compose logs db

Parar containers: docker compose stop

Iniciar containers parados: docker compose start

Reconstruir a imagem da API: docker compose build api

Aceder a um shell dentro do container da API (para debugging): docker compose exec api sh

Aceder a um shell dentro do container da BD (para usar psql): docker compose exec db psql -U loja_social_user -d loja_social_db

☁️ Implementação na Akamai Connected Cloud (Linode)

Este guia detalha os passos para implementar a aplicação (Backend API + Base de Dados PostgreSQL) num servidor Linux na Akamai Connected Cloud (anteriormente Linode) usando Docker e Docker Compose. O Frontend React será implementado separadamente.

Passo 1: Preparar o Servidor Akamai (Linode)

Criar Instância Linode:

Aceda ao Cloud Manager da Akamai.

Clique em "Create" > "Linode".

Choose a Distribution: Selecione uma distribuição Linux estável. Ubuntu 22.04 LTS é uma excelente escolha.

Region: Escolha a região geograficamente mais próxima dos seus utilizadores (ex: Frankfurt, London).

Linode Plan: Para um projeto académico, o plano Nanode 1GB (Shared CPU) é geralmente suficiente para começar. Pode redimensionar mais tarde se necessário.

Linode Label: Dê um nome descritivo (ex: loja-social-ipca-server).

Root Password: Defina uma password forte e segura para o utilizador root. Guarde-a num local seguro.

(Opcional mas Recomendado) Add SSH Keys: Se já tiver um par de chaves SSH, adicione a sua chave pública aqui. Isto permite aceder ao servidor sem password, o que é mais seguro e conveniente.

Para gerar chaves SSH (se não tiver): ssh-keygen -t ed25519 -C "your_email@example.com" no seu terminal local. A chave pública estará em ~/.ssh/id_ed25519.pub. Copie o conteúdo desse ficheiro.

Add-ons / Options: Geralmente, não são necessários backups automáticos ou IPs privados para este tipo de projeto inicialmente.

Clique em "Create Linode". Aguarde alguns minutos até a instância estar provisionada e a correr ("Running").

Aceder ao Servidor via SSH:

Encontre o Endereço IP Público da sua Linode no Cloud Manager.

Abra o seu terminal local.

Se adicionou a chave SSH:

ssh root@SEU_IP_PUBLICO


Se não adicionou a chave SSH:

ssh root@SEU_IP_PUBLICO


Ser-lhe-á pedida a password root que definiu.

Aceite a chave do host na primeira ligação.

(Opcional mas Recomendado) Criar um Utilizador Não-Root:

É uma boa prática não usar o utilizador root para operações diárias.

No servidor (ligado como root):

# Criar novo utilizador (substitua 'deployuser' pelo nome desejado)
adduser deployuser
# Adicionar ao grupo sudo (para permissões administrativas)
usermod -aG sudo deployuser
# (Opcional) Copiar chave SSH pública para o novo utilizador
rsync --archive --chown=deployuser:deployuser ~/.ssh /home/deployuser


Saia (exit) e volte a ligar-se com o novo utilizador: ssh deployuser@SEU_IP_PUBLICO.

Passo 2: Instalar Docker e Docker Compose no Servidor

Atualizar o Sistema: (Ligue-se ao servidor como root ou com o seu utilizador sudo)

sudo apt update
sudo apt upgrade -y


Instalar Docker Engine: Siga as instruções oficiais da Docker para Ubuntu: Install Docker Engine on Ubuntu

Resumidamente (verifique sempre a documentação oficial para os comandos mais recentes):

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL [https://download.docker.com/linux/ubuntu/gpg](https://download.docker.com/linux/ubuntu/gpg) -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] [https://download.docker.com/linux/ubuntu](https://download.docker.com/linux/ubuntu) \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker Engine, CLI, Containerd, and Docker Compose plugin
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y


(Pós-Instalação) Permitir Utilizador Não-Root executar Docker (Opcional mas Conveniente):

# Adicionar o seu utilizador ao grupo docker (substitua 'deployuser')
sudo usermod -aG docker deployuser
# IMPORTANTE: Precisa de fazer logout e login novamente para que esta alteração tenha efeito!
exit
# Volte a ligar-se: ssh deployuser@SEU_IP_PUBLICO


Verificar Instalação:

docker --version
docker compose version
# (Se adicionou o utilizador ao grupo) Tente correr sem sudo:
docker run hello-world


Passo 3: Transferir o Código do Projeto para o Servidor

Instalar Git (se ainda não estiver instalado):

sudo apt install git -y


Clonar o Repositório:

Navegue para o diretório onde quer guardar o projeto (ex: /home/deployuser/).

Use git clone com a URL do seu repositório (HTTPS ou SSH).

# Exemplo com HTTPS
git clone [https://github.com/SEU_USER/SEU_REPO.git](https://github.com/SEU_USER/SEU_REPO.git) loja-social
# Ou com SSH (se configurou chaves)
# git clone git@github.com:SEU_USER/SEU_REPO.git loja-social

cd loja-social


Passo 4: Configurar e Executar os Containers Docker no Servidor

Criar e Configurar o Ficheiro .env:

Dentro da pasta do projeto (loja-social) no servidor:

cp .env.example .env


Edite o ficheiro .env NO SERVIDOR: Use um editor como nano (nano .env).

A DATABASE_URL deve continuar a usar db como hostname, pois essa é a comunicação interna do Docker Compose:

DATABASE_URL=postgresql://loja_social_user:loja_social_password@db:5432/loja_social_db


IMPORTANTE: Altere loja_social_password (e loja_social_user se quiser) para passwords fortes e seguras! Terá de alterar estas mesmas passwords também no ficheiro docker-compose.yml para o serviço db.

Pode adicionar outras variáveis de ambiente necessárias para produção aqui (ex: segredos JWT, etc.).

Guarde as alterações (em nano: Ctrl+X, depois Y, depois Enter).

Construir e Iniciar os Containers:

docker compose up --build -d


Isto irá construir a imagem da API (se for a primeira vez no servidor) e iniciar os containers da API e da Base de Dados em background.

Verificar o Estado:

docker compose ps


Deverá ver os dois serviços (db e api) com o estado "running" ou "healthy".

Verifique os logs se algo correr mal:

docker compose logs api
docker compose logs db


Testar a API:

A partir do seu computador local, tente aceder ao health check da API usando o IP público do servidor:

curl http://SEU_IP_PUBLICO:3000/health


Deverá receber a resposta JSON de sucesso. Se não conseguir ligar, verifique a firewall (ver Passo 6).

Passo 5: Aceder à Aplicação e Configurar o Frontend

Atualizar a URL da API no Frontend:

No código do seu projeto local (não no servidor), edite o ficheiro src/utils/api.js.

Altere a constante API_URL para apontar para o IP público do seu servidor Akamai:

// src/utils/api.js
export const API_URL = 'http://SEU_IP_PUBLICO:3000';


Faça commit e push destas alterações para o seu repositório Git.

No servidor, atualize o código com git pull. (Não precisa de reiniciar os containers Docker, pois a alteração é no frontend).

Construir o Frontend para Produção:

No seu computador local, na pasta do projeto:

npm run build


Isto criará uma pasta dist com os ficheiros estáticos otimizados (HTML, CSS, JS).

Implementar ("Deploy") os Ficheiros do Frontend:

Opção A (Simples - GitHub Pages/Netlify/Vercel):

Faça push do seu código (incluindo a API_URL atualizada) para o GitHub.

Configure o GitHub Pages (ou Netlify/Vercel ligado ao seu repo) para fazer deploy automático a partir da pasta dist após o build.

Opção B (Akamai Object Storage):

Crie um "Bucket" no Object Storage da Akamai.

Configure-o para alojamento de sites estáticos.

Faça upload do conteúdo da pasta dist para o bucket.

Opção C (No Mesmo Servidor Linode com Nginx): (Mais complexo - ver Passo 6)

Instale Nginx no servidor (sudo apt install nginx).

Copie o conteúdo da pasta dist para uma pasta no servidor (ex: /var/www/loja-social).

Configure o Nginx para servir esses ficheiros estáticos (e opcionalmente fazer proxy para a API - ver Passo 6).

Aceder ao Website: Abra o URL fornecido pelo seu serviço de alojamento (GitHub Pages, Netlify, IP do servidor com Nginx, etc.). O site deverá carregar e conseguir comunicar com a API em http://SEU_IP_PUBLICO:3000.

Passo 6: (Opcional mas Recomendado) Configurações de Produção

Estas configurações aumentam a segurança e profissionalismo da sua aplicação.

Configurar Firewall (UFW - Uncomplicated Firewall):

Permitir apenas as portas necessárias (SSH, HTTP, HTTPS e a porta da API se não usar Reverse Proxy):

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
# sudo ufw allow 3000/tcp # Apenas se NÃO usar Nginx como reverse proxy
sudo ufw enable
sudo ufw status


Configurar Domínio/DNS:

Adquira um nome de domínio (ex: lojasocialipca.pt).

No seu fornecedor de domínio, configure um registo DNS do tipo A que aponte o seu domínio (e/ou subdomínio como api.lojasocialipca.pt) para o IP Público da sua Linode.

Configurar Reverse Proxy (Nginx):

Instalar Nginx: sudo apt install nginx

Configurar o Nginx para:

Servir os ficheiros estáticos do frontend (se os alojou no mesmo servidor).

Redirecionar pedidos para /api/* (ou num subdomínio api.*) para a sua API Node.js que corre na porta 3000 (proxy_pass http://localhost:3000;).

Crie um ficheiro de configuração em /etc/nginx/sites-available/loja-social e crie um link simbólico para /etc/nginx/sites-enabled/.

Exemplo básico de configuração Nginx (/etc/nginx/sites-available/loja-social):

server {
    listen 80;
    server_name lojasocialipca.pt www.lojasocialipca.pt; # Seu domínio

    # Servir Frontend (ajuste o root para a pasta dist)
    root /var/www/loja-social/dist;
    index index.html;

    location / {
        try_files $uri /index.html; # Para SPAs React
    }

    # Redirecionar API
    location /api/ {
        proxy_pass http://localhost:3000; # API Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}


Ative a configuração e reinicie o Nginx:

sudo ln -s /etc/nginx/sites-available/loja-social /etc/nginx/sites-enabled/
sudo nginx -t # Testar configuração
sudo systemctl restart nginx


Configurar HTTPS (Let's Encrypt):

Use o Certbot para obter e renovar certificados SSL gratuitos:

sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d lojasocialipca.pt -d www.lojasocialipca.pt # Siga as instruções


Certbot configurará automaticamente o Nginx para usar HTTPS e redirecionar HTTP.

Estratégia de Backups:

O Docker Compose guarda os dados da BD no volume postgres_data.

Configure backups regulares desse volume ou use ferramentas específicas de backup do PostgreSQL (como pg_dump) para guardar os dados num local seguro (ex: Akamai Object Storage). Pode criar um script e agendá-lo com cron.

🚧 Próximos Passos e Contribuição (Awareness para Colegas)

Este projeto tem uma base sólida, mas ainda há trabalho a fazer, especialmente no backend e na futura app Android.

Tarefas Pendentes / Áreas para Contribuir

Completar API Backend (routes/admin.js):

Autenticação Segura: Implementar login (/api/login) com bcrypt para comparar passwords e JWT (JSON Web Tokens) para gestão de sessão. Criar middleware de autenticação para proteger as rotas admin. (Ver utils/auth.js como ponto de partida).

Implementar CRUD completo: Desenvolver a lógica real para todas as rotas de gestão (Beneficiários GET/POST/PUT, Stock GET/POST/DELETE, Entregas GET/POST/PUT, Campanhas GET/POST/PUT/DELETE, etc.) que irão interagir com a base de dados usando queries SQL parametrizadas.

Validação de Input: Adicionar validação robusta aos dados recebidos nas rotas da API (ex: usar bibliotecas como express-validator).

Tratamento de Erros: Melhorar o tratamento de erros (ex: middleware de erro centralizado).

Testes: Escrever testes unitários e de integração para a API (ex: usando Jest/Supertest).

Desenvolver Aplicação Android:

Criar o projeto Android Studio (Kotlin recomendado).

Desenvolver a interface de utilizador para as funcionalidades de gestão (Login, Listas, Formulários).

Integrar a App com a API Backend (usando bibliotecas como Retrofit ou Ktor).

Gerir o token de autenticação JWT de forma segura na App.

Melhorias Frontend:

Adicionar feedback visual mais detalhado (ex: toasts ou mensagens inline para sucesso/erro no formulário DoarPage).

Otimizar performance (embora com Vite e React seja geralmente bom, verificar se há necessidade de React.memo, lazy loading, etc., à medida que cresce).

Melhorar acessibilidade (adicionar mais ARIA labels, garantir boa navegação por teclado).

Adicionar estado de erro visual se a API falhar em carregar campanhas ou stock.

Testes unitários e de integração para componentes React (ex: usando Vitest/React Testing Library).

DevOps:

Implementar os passos de produção do Guia de Implementação (Firewall, Nginx, HTTPS).

Configurar um pipeline CI/CD (ex: GitHub Actions) para automatizar o build do frontend, build da imagem Docker da API, e o deploy para o servidor Akamai.