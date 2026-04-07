FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copia arquivos do monorepo da raiz
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/

# Instala dependências
RUN pnpm install --frozen-lockfile

# Copia código do backend
COPY apps/backend/ ./apps/backend/

# Build
WORKDIR /app/apps/backend
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/index.js"]
