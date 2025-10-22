Guia: Implementar Backend (API Node.js + PostgreSQL) com Docker na Akamai

Este guia pressupõe que o seu projeto já está estruturado com um Dockerfile para a API e um docker-compose.yml funcional, como o que preparámos.

Objetivo: Ter a sua API Node.js e a base de dados PostgreSQL a correrem em containers Docker num servidor Linux na Akamai Connected Cloud.

Passo 1: Preparar o Servidor na Akamai

Criar Conta/Login: Se ainda não tem, crie uma conta na Akamai Connected Cloud.

Criar Instância (Linode):

Crie uma nova "Linode".

Distribuição: Escolha uma distribuição Linux estável (ex: Ubuntu 22.04 LTS).

Região: Escolha a região geograficamente mais próxima dos seus utilizadores (ex: Frankfurt, London).

Plano: Para um projeto académico, um plano partilhado pequeno (ex: Nanode 1GB ou Linode 2GB) é geralmente suficiente para começar.

Password Root: Defina uma password forte para o utilizador root.

Acesso SSH (Opcional, mas Recomendado): Adicione a sua chave pública SSH para acesso seguro sem password.

Clique em "Create Linode".

Aceder ao Servidor:

Após a criação (pode demorar alguns minutos), copie o endereço IP público da sua nova Linode.

Abra o seu terminal (ou PuTTY no Windows) e conecte-se via SSH:

ssh root@SEU_ENDERECO_IP_PUBLICO


(Se não usou chave SSH, ser-lhe-á pedida a password root que definiu).

Passo 2: Instalar Docker e Docker Compose no Servidor

Atualizar o Sistema:

apt update && apt upgrade -y


Instalar Docker: Siga as instruções oficiais para Ubuntu (Get Docker Engine on Ubuntu):

# Remover versões antigas (se existirem)
apt-get remove docker docker-engine docker.io containerd runc -y

# Instalar pré-requisitos
apt-get install ca-certificates curl gnupg lsb-release -y

# Adicionar chave GPG oficial do Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL [https://download.docker.com/linux/ubuntu/gpg](https://download.docker.com/linux/ubuntu/gpg) -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Configurar o repositório
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] [https://download.docker.com/linux/ubuntu](https://download.docker.com/linux/ubuntu) \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker Engine
apt-get update
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y


Verificar Instalação:

docker --version
docker compose version


Deverá ver as versões instaladas.

Passo 3: Transferir o Código do Projeto para o Servidor

Opção A (Recomendada): Usar Git

Certifique-se que o seu projeto está num repositório Git (GitHub, GitLab, etc.).

Instale o Git no servidor:

apt install git -y


Clone o seu repositório:

git clone SEU_URL_DO_REPOSITORIO nome_da_pasta_do_projeto
cd nome_da_pasta_do_projeto


Opção B: Usar SCP (Secure Copy)

No seu computador local, navegue até à pasta do seu projeto.

Copie a pasta inteira para o servidor:

# Substitua /caminho/local/projeto e SEU_ENDERECO_IP_PUBLICO
scp -r /caminho/local/projeto root@SEU_ENDERECO_IP_PUBLICO:/root/nome_da_pasta_do_projeto


No servidor, navegue para a pasta:

cd /root/nome_da_pasta_do_projeto


Passo 4: Construir e Correr os Containers com Docker Compose

Navegar para a Pasta: Certifique-se que está dentro da pasta do seu projeto no servidor (onde está o docker-compose.yml).

Configurar Variáveis de Ambiente (IMPORTANTE):

Copie o ficheiro de exemplo:

cp .env.example .env


Edite o ficheiro .env:

nano .env


MUITA ATENÇÃO: A DATABASE_URL NÃO será localhost aqui. O Docker Compose cria uma rede interna. O nome do serviço da base de dados no seu docker-compose.yml é db. Portanto, a URL DENTRO do .env no servidor deve ser semelhante a esta (usando as credenciais definidas no docker-compose.yml):

PORT=3000
DATABASE_URL=postgresql://loja_social_user:loja_social_password@db:5432/loja_social_db


loja_social_user e loja_social_password devem ser iguais aos POSTGRES_USER e POSTGRES_PASSWORD no docker-compose.yml.

db é o nome do serviço da base de dados no docker-compose.yml.

5432 é a porta interna do PostgreSQL no container.

Para produção real, use passwords fortes! Pode gerar passwords seguras e atualize tanto o .env como o docker-compose.yml.

Salve e feche o editor (Ctrl+X, depois Y, depois Enter no nano).

Construir e Iniciar os Containers:

Execute o Docker Compose. O comando --build força a reconstrução das imagens (útil se fez alterações no código ou Dockerfile) e -d corre em background (detached mode).

docker compose up --build -d


O Docker irá:

Fazer download da imagem do PostgreSQL.

Construir a imagem da sua API Node.js usando o Dockerfile.

Criar uma rede interna para os containers comunicarem.

Iniciar o container da base de dados, executar o script bd_lojasocial.sql (definido no volume do docker-compose.yml) e persistir os dados no volume postgres_data.

Iniciar o container da API, passando as variáveis de ambiente do .env.

Verificar o Estado:

docker compose ps


Deverá ver os dois containers (db e api) com o estado "running" ou "healthy".

Ver Logs (se necessário):

# Logs da API
docker compose logs api

# Logs da Base de Dados
docker compose logs db

# Seguir os logs em tempo real (Ctrl+C para sair)
docker compose logs -f api


Passo 5: Aceder à Aplicação

A sua API estará acessível publicamente através do IP do seu servidor na porta que expôs no docker-compose.yml (neste caso, 3000):
http://SEU_ENDERECO_IP_PUBLICO:3000

Pode testar o endpoint de health check:
http://SEU_ENDERECO_IP_PUBLICO:3000/health

Importante: Atualize a API_URL no seu código frontend React (src/utils/api.js) para apontar para este novo endereço antes de fazer o build final do frontend.

Passos Adicionais Recomendados (Para Produção Real):

Firewall: Configure a firewall do servidor (UFW no Ubuntu) para permitir tráfego apenas nas portas necessárias (SSH (22), HTTP (80), HTTPS (443) e talvez a 3000 temporariamente para testes).

Domínio e DNS: Configure um subdomínio (ex: api.seusite.com) para apontar para o IP público da sua Linode (usando os DNS da Akamai ou o seu provedor de domínio).

Reverse Proxy (Nginx ou Caddy): Instale um reverse proxy no servidor. Ele irá receber os pedidos em HTTP/HTTPS (portas 80/443) e encaminhá-los para a sua API que corre na porta 3000. Isto permite ter HTTPS e gerir múltiplos serviços no mesmo servidor.

HTTPS (Let's Encrypt): Configure o Nginx/Caddy para obter e renovar automaticamente certificados SSL/TLS gratuitos do Let's Encrypt.

Gestão de Volumes de Dados: O docker-compose.yml já cria um volume (postgres_data) para persistir os dados da base de dados. Certifique-se de ter uma estratégia de backup para este volume.

Seguindo este guia, terá o seu backend completo a correr de forma robusta e isolada na Akamai Cloud.