FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile
COPY apps/backend/ ./apps/backend/
RUN pnpm --filter=backend build
RUN pnpm deploy --filter=backend --prod /prod/backend

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /prod/backend/node_modules ./node_modules
COPY --from=builder /prod/backend/package.json ./
COPY --from=builder /app/apps/backend/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
