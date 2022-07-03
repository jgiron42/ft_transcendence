FROM node:17.4.0

ARG NODE_ENV=production

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["bash", "entrypoint.sh"]

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s CMD curl --fail 127.0.0.1:4000 > /dev/null 2>&1 || pkill node
