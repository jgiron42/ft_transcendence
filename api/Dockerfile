FROM node:17.4.0

ARG buildtarget

WORKDIR /app

COPY . .

ENV DOCKER_NODE_ENV=${buildtarget}

RUN NODE_ENV=$DOCKER_NODE_ENV npm install

RUN npm run build

ENTRYPOINT ["bash", "entrypoint.sh"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s CMD curl --fail 127.0.0.1:3000 > /dev/null 2>&1 || kill $(ps aux|grep -v grep|grep node|tail -n1|awk -F ' ' '{print $2}')
