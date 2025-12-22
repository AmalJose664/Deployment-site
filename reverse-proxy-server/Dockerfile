FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build



FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 7000
CMD ["/start.sh"]
