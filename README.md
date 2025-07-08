Documentação do Projeto de Cadastro de Níveis e Desenvolvedores
Este projeto é dividido em duas partes: backend (Laravel) e frontend (Next.js). Ele permite o cadastro e listagem de níveis e desenvolvedores.

Requisitos
Certifique-se de ter as seguintes ferramentas instaladas:

PHP: Versão 8.0 ou superior

Composer: Gerenciador de dependências do PHP

Node.js: Versão 14.x ou superior

npm: Gerenciador de pacotes do Node.js (já vem com o Node.js)

Banco de Dados: MySQL, PostgreSQL, SQLite ou outro compatível com Laravel

Configuração e Execução
1. Backend (Laravel)
Clone o repositório

git clone [URL_DO_SEU_REPOSITORIO]
cd [pasta_do_backend]
Instale as dependências


composer install
Configure o .env
Copie o exemplo:


cp .env.example .env
Edite as credenciais do banco no .env:

env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=seu_banco_de_dados
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha

Gere a chave da aplicação

Rode as migrações
php artisan migrate
Isso criará as tabelas para níveis e desenvolvedores.

Inicie o servidor
php artisan serve --port=8080
O backend estará acessível em: http://localhost:8080

2. Frontend (Next.js)

Instale as dependências
npm install
criar um arquivo .env.local na pasta pricipal do frontend com:
NEXT_PUBLIC_API_URL=http://localhost:8080/api
Inicie o servidor de desenvolvimento

npm run dev
O frontend estará acessível em: http://localhost:3000

Como Usar o Sistema
Após iniciar ambos os servidores, acesse http://localhost:3000 no navegador.

Cadastro de Níveis
A interface exibe um formulário para cadastrar novos níveis.

Níveis cadastrados aparecerão listados abaixo do formulário.

Cadastro de Desenvolvedores
É necessário ter pelo menos um nível cadastrado.

O formulário permite selecionar um nível existente.

Desenvolvedores cadastrados serão listados logo abaixo.






