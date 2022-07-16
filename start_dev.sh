#!/bin/bash

# Script to easily launch the project in dev mode

# Setup pgadmin volume to work correctly with docker
sudo chown -R 5050:5050 pgadmin/

# Automatically set env values when in a gitpod workspace
if [ -n "$GITPOD_WORKSPACE_ID" ];then
    export API_PORT=80
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export WSS_BASE_URL=wss://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export NGINX_DEV_HOST="$API_PORT-$GITPOD_WORKSPACE_HOST"
    export BASE_URL="$NGINX_DEV_HOST"
    export BROWSER_BASE_URL="$BASE_URL"
fi

export NODE_ENV=development
cd api ; npm i ; cd ..
cd client ; npm i ; cd ..

cp .env.sample .env
cp api.env.sample api.env
cp db.env.sample db.env
echo API_BASE_URL="$API_BASE_URL" >> api.env
curl -L >/dev/null -s 'https://profile.intra.42.fr/oauth/applications/9598' -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundaryC6HMA2sOEGkq4rJo' -H 'cookie: _intra_42_session_production=dd43539ee5e5b4dd4ddec4bc31c1f8a8' --data-raw $'------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="utf8"\r\n\r\n✓\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="_method"\r\n\r\npatch\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="authenticity_token"\r\n\r\navJay4GYA97693CQgriFNQlgAQtiU5RDTEc1d4QIJ1pR4Jn78gZJi4DyJEDF+/UgJopsR34CqQ52yZIfa9IbIw==\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[name]"\r\n\r\ntrans\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[image_cache]"\r\n\r\n\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[image]"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[description]"\r\n\r\ntrans\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[website]"\r\n\r\n\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[public]"\r\n\r\n0\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[scopes]"\r\n\r\npublic projects profile elearning tig forum\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="doorkeeper_application[redirect_uri]"\r\n\r\n'"$API_BASE_URL/auth/42"$'\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nprojects\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nprofile\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nelearning\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\ntig\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nforum\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo\r\nContent-Disposition: form-data; name="commit"\r\n\r\nSubmit\r\n------WebKitFormBoundaryC6HMA2sOEGkq4rJo--\r\n'

# Can't use docker restart because I want to be able to use --build flags and logs attached out-of-the-box
docker-compose stop $@
docker-compose up $@
