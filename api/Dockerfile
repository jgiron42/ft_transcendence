FROM node:18.0.0
ARG NODE_ENV=production

WORKDIR /app

COPY package.json .

RUN npm install --log-level=error --no-update-notifier 2>/dev/null

COPY . .

RUN npm run build --log-level=error 2>/dev/null

ENTRYPOINT ["bash", "entrypoint.sh"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s CMD curl --fail 127.0.0.1:3000 > /dev/null 2>&1 || exit 1
