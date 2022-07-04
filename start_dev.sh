#!/bin/sh

# Script to easily launch the project in dev mode

# Setup pgadmin volume to work correctly with docker
sudo chown -R 5050:5050 pgadmin/

# Automatically set env values when in a gitpod workspace
if ! [ -z "$GITPOD_WORKSPACE_ID" ];then
    export API_PORT=8080
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export WSS_BASE_URL=wss://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export NGINX_DEV_HOST="$GITPOD_WORKSPACE_HOST"
fi

# If we're relaunching everything, ensure services aren't already running.
if [ "$#" -eq 0 ];then docker-compose down; fi

export NODE_ENV=development

# Remove dir created by empty volume
rm -rf api/.env/

cp .env.sample .env
cp api.env.sample api.env
cp db.env.sample db.env

# Launch services.
docker-compose up $@
