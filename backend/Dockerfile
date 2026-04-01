# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat 

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

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./ 

EXPOSE 3001

# Production command: runs migrations then starts the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
