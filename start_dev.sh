#!/bin/sh

# Script to easily launch the project in dev mode

# Setup pgadmin volume to work correctly with docker
sudo chown -R 5050:5050 pgadmin/

# Automatically set env values when in a gitpod workspace
if [ -n "$GITPOD_WORKSPACE_ID" ];then
    export API_PORT=8080
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export WSS_BASE_URL=wss://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export NGINX_DEV_HOST="$GITPOD_WORKSPACE_HOST"
fi

export NODE_ENV=development

cp .env.sample .env
cp api.env.sample api.env
cp db.env.sample db.env

# (re)Launch services.
docker-compose restart $@ && docker-compose logs -f $@ --tail 10
