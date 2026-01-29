FROM node:20-alpine AS build
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
RUN apk add --no-cache ffmpeg
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/types build 2>/dev/null || true
RUN cd apps/api && npx prisma generate
RUN pnpm --filter diarytvideo-api build

# production
FROM node:20-alpine AS production
RUN apk add --no-cache ffmpeg
WORKDIR /app

# API 빌드 결과물
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

# 의존성 (pnpm 심링크 구조 유지)
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/node_modules/.pnpm ./node_modules/.pnpm

# 워크스페이스 의존성: @repo/types
COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/packages/types/package.json ./packages/types/package.json

ENV NODE_ENV=production
EXPOSE 4000

WORKDIR /app/apps/api
CMD ["node", "dist/main"]
