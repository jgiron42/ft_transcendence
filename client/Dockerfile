FROM node:17.4.0

ARG NUXT_ENV_API_URL NUXT_ENV_SENTRY_DISABLED NUXT_ENV_SENTRY_DSN
ENV NUXT_ENV_API_URL ${NUXT_ENV_API_URL}
ENV NUXT_ENV_SENTRY_DISABLED ${NUXT_ENV_SENTRY_DISABLED}
ENV NUXT_ENV_SENTRY_DSN ${NUXT_ENV_SENTRY_DSN}

ARG buildtarget

WORKDIR /app

COPY . .

ENV DOCKER_NODE_ENV=${buildtarget}

RUN npm install

RUN NODE_ENV=$DOCKER_NODE_ENV npm run build

ENTRYPOINT ["bash", "entrypoint.sh"]

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s CMD curl --fail 127.0.0.1:4000 > /dev/null 2>&1 || kill $(ps aux|grep -v grep|grep node|tail -n1|awk -F ' ' '{print $2}')
