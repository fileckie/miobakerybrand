FROM node:24-slim AS build
WORKDIR /app
RUN echo 'deb https://mirrors.aliyun.com/debian bookworm main' > /etc/apt/sources.list && \
    echo 'deb https://mirrors.aliyun.com/debian bookworm-updates main' >> /etc/apt/sources.list && \
    echo 'deb https://mirrors.aliyun.com/debian-security bookworm-security main' >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci
COPY . .
RUN npm run build

FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN echo 'deb https://mirrors.aliyun.com/debian bookworm main' > /etc/apt/sources.list && \
    echo 'deb https://mirrors.aliyun.com/debian bookworm-updates main' >> /etc/apt/sources.list && \
    echo 'deb https://mirrors.aliyun.com/debian-security bookworm-security main' >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server
EXPOSE 8787
CMD ["node", "server/index.mjs"]
