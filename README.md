# Piloto Financeiro Backend

Backend unificado da plataforma **Piloto Financeiro + Observatório**.

## Arquitetura
- **Banco de Dados**: Supabase (PostgreSQL) `ocjgtbeswwprayuexwrf`
- **Storage**: Cloudflare R2
- **Deploy**: Railway
- **ORM**: Drizzle ORM
- **Domínio API**: `api.pilotofinanceiro.com.br`

## Variáveis de Ambiente Necessárias
Consulte o arquivo `.env.example` para a lista completa de variáveis.

## Comandos Principais
- **Build**: `npm run build`
- **Start**: `npm start`
- **Migration**: `npm run db:push`

## Deploy no Railway
O projeto está configurado para o Railway através do arquivo `railway.json`. 
A URI de redirecionamento do Google OAuth deve ser:
`https://api.pilotofinanceiro.com.br/api/oauth/callback`
