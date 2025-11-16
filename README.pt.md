# SmartStock AI

Gerenciamento de estoque com IA. Backend: Laravel 12 (PHP 8.2). Frontend: Next.js 16 (React 19). Ambiente de desenvolvimento com Docker.

- API (Laravel + PHP-FPM): http://localhost:8080
- Web (Next.js): http://localhost:3000
- PgAdmin: http://localhost:5050

## Início rápido (Docker)

Pré-requisitos: Docker Desktop 4.24+ e Compose V2.

1) Criar o arquivo de ambiente (apenas na primeira vez):

```bash
cp .env.docker .env
```

2) Subir os serviços:

```bash
./scripts/docker-up.sh
```

3) Acesse:
- API: http://localhost:8080
- Frontend: http://localhost:3000
- PgAdmin: http://localhost:5050 (admin@admin.com / admin)

Comandos úteis:

```bash
./scripts/migrate.sh          # Rodar migrações
./scripts/seed.sh             # Popular base de dados (seed)
./scripts/clear.sh            # Limpar caches do Laravel
./scripts/docker-logs.sh      # Ver logs
./scripts/docker-restart.sh   # Reiniciar serviços
./scripts/docker-down.sh      # Parar e remover containers/volumes
```

## Local (sem Docker)

Backend:
- PHP 8.2+, Composer, SQLite/Postgres
- Comandos: `composer install && cp .env.example .env && php artisan key:generate && php artisan migrate --seed && php artisan serve`

Frontend:
- Node.js 20+, pnpm/yarn/npm
- Comandos: `cd public/smartstock-frontend && cp .env.local.example .env.local && npm i && npm run dev`

## Configuração

- Laravel usa Postgres no Docker. Padrões:
  - Host: postgres, Porta: 5432, DB: smartstock_ai, User: smartuser, Pass: smartpass
- Frontend usa `NEXT_PUBLIC_API_BASE_URL` (padrão: http://localhost:8080)
- CORS/Sanctum já preparados para localhost:3000 e 8080 via `.env.docker`

## Estrutura do projeto

- backend (Laravel) na raiz do repositório
- frontend (Next.js) em `public/smartstock-frontend`
- Arquivos do Docker em `docker/` e scripts em `scripts/`

## Testes

Rode os testes dentro do container da aplicação:

```bash
docker compose exec -u www-data app php artisan test
```

## Solução de problemas

- Porta em uso: ajuste as portas publicadas no `docker-compose.yml`
- 502 Bad Gateway: verifique se o container `app` está saudável e o PHP-FPM ouvindo na porta 9000
- Migrações falharam no primeiro boot: rode `./scripts/migrate.sh` após o Postgres ficar pronto

## Licença

MIT (veja LICENSE)

## Demo

Screenshots da aplicação (pasta `demo/`):

<p align="center">
  <img src="demo/1.png" alt="Screenshot Dashboard" />
  <img src="demo/2.png" alt="Screenshot Inventário" />
  <img src="demo/3.png" alt="Screenshot Movimentos"  />
</p>

Se as imagens não renderizarem por causa de caracteres especiais nos nomes, considere renomeá-las (ex.: `demo/dashboard.png`, `demo/inventory.png`, `demo/movements.png`) e atualizar os paths.
