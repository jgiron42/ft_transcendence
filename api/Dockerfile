FROM node:18.0.0
ARG NODE_ENV=production

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["bash", "entrypoint.sh"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s CMD curl --fail 127.0.0.1:3000 > /dev/null 2>&1 || exit 1
