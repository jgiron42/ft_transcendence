FROM node:17.4.0

ARG buildtarget

WORKDIR /app

COPY . .

# Remove copied build files to avoid side effects
RUN rm -rf node_modules/ dist/

RUN npm install

RUN npm run build

ENTRYPOINT ["bash", "entrypoint.sh"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s CMD curl --fail 127.0.0.1:3000 > /dev/null 2>&1 || pkill node
