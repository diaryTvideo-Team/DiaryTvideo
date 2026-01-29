FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
RUN apk add --no-cache ffmpeg
WORKDIR /app

# install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
RUN pnpm install --frozen-lockfile

# build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY . .
RUN pnpm --filter @repo/types build 2>/dev/null || true
RUN cd apps/api && npx prisma generate
RUN pnpm --filter diarytvideo-api build

# production
FROM node:20-alpine AS production
RUN apk add --no-cache ffmpeg
WORKDIR /app

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/node_modules/.pnpm ./node_modules/.pnpm

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/main"]
