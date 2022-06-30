#!/bin/sh
# Script to easily launch the project in dev mode

cd proxy
mv templates/default.conf.template .
cp dev.default.conf.template templates/default.conf.template

cd ..
sudo chown -R 5050:5050 pgadmin/

if ! [ -z "$GITPOD_WORKSPACE_ID" ];then
    export API_PORT=3000
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST
    export WSS_BASE_URL=wss://$API_PORT-$GITPOD_WORKSPACE_HOST
fi

docker-compose up $@
