# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

ENV DATABASE_URL=postgresql://user:password@db:5432/taskdb?schema=public

CMD ["sh","-c","sleep 10 && npx prisma db push --schema=prisma/schema.prisma && node dist/index.js"]