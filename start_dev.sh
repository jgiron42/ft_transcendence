#!/bin/bash

# Script to easily launch the project in dev mode

source ~/.nvm/nvm-lazy.sh

# Setup pgadmin volume to work correctly with docker
sudo chown -R 5050:5050 pgadmin/

export NODE_ENV=development
nvm install 18
nvm use 18
cd api ; npm i ; cd ..
cd client ; npm i ; cd ..

cp .env.sample .env
cp api.env.sample api.env
cp db.env.sample db.env

# Automatically set env values when in a gitpod workspace
if [ -n "$GITPOD_WORKSPACE_ID" ];then
    export DOCKER_PROXY_HTTP_PORT=80
    export API_PORT=$DOCKER_PROXY_HTTP_PORT
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/api/
    export BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/
    export NGINX_DEV_HOST="$API_PORT-$GITPOD_WORKSPACE_HOST"
    export WSS_BASE_URL="$BASE_URL"
    export BROWSER_BASE_URL="$BASE_URL""api/"

    echo API_BASE_URL="$API_BASE_URL" >> .env
    echo WSS_BASE_URL="$WSS_BASE_URL" >> .env
    echo NGINX_DEV_HOST="$NGINX_DEV_HOST" >> .env
    echo BASE_URL="$BASE_URL" >> .env
    echo BROWSER_BASE_URL="$BROWSER_BASE_URL" >> .env
fi

echo "NODE_ENV=$NODE_ENV" > .env

if [ -v INTRA42_PASSWORD ];then
  TOKEN=$(curl -s -c cookies.txt -b cookies.txt 'https://signin.intra.42.fr/users/sign_in' --compressed)
  TOKEN=$(echo "$TOKEN" | sed '/<meta name="csrf-token" content="/!d;s//&\n/;s/.*\n//;:a;/"/bb;$!{n;ba};:b;s//\n&/;P;D')
  TOKEN=$(echo "$TOKEN" | sed 's/+/%2B/g' | sed 's/\//%2F/g' | sed 's/=/%3D/g')

  curl -s -c cookies.txt -b cookies.txt 'https://signin.intra.42.fr/users/sign_in' \
  --data-raw "utf8=%E2%9C%93&authenticity_token=$TOKEN&user%5Blogin%5D=$INTRA42_USERNAME&user%5Bpassword%5D=$INTRA42_PASSWORD&commit=Sign+in" \
  --compressed > /dev/null
else
  echo WARN: Intra username or password was not provided.
fi


echo API_BASE_URL="$API_BASE_URL" >> api.env

INTRA_APP_ID=9598

CSRF_TOKEN=$(curl -s -c cookies.txt -b cookies.txt "https://profile.intra.42.fr/oauth/applications/$INTRA_APP_ID" $COOKIE_OPT --compressed | grep csrf-token | awk -F '"' '{print $4}')

curl  -s -c cookies.txt -b cookies.txt "https://profile.intra.42.fr/oauth/applications/$INTRA_APP_ID" \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundaryLFclr9aAe0GQip6L' \
  --data-raw $'------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="utf8"\r\n\r\n✓\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="_method"\r\n\r\npatch\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="authenticity_token"\r\n\r\n'$CSRF_TOKEN$'\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[name]"\r\n\r\ntrans\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[image_cache]"\r\n\r\n\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[image]"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[description]"\r\n\r\ntrans\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[website]"\r\n\r\n\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[public]"\r\n\r\n0\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[scopes]"\r\n\r\npublic projects profile elearning tig forum\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[redirect_uri]"\r\n\r\n'$API_BASE_URL$'/auth/42\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nprojects\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nprofile\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nelearning\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\ntig\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nforum\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="commit"\r\n\r\nSubmit\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L--\r\n' \
  --compressed

response=$(curl -s -c cookies.txt -b cookies.txt "https://profile.intra.42.fr/oauth/applications/$INTRA_APP_ID" --compressed)

INTRA_UID=$(grep -A10  UID <<< "$response" | grep data-app-uid | awk -F "'" '{print $4}')
INTRA_SECRET=$(grep -A10 Secret <<< "$response" | grep data-app-secret| awk -F "'" '{print $4}')
echo INTRA42_UID="$INTRA_UID" >> api.env
echo INTRA42_SECRET="$INTRA_SECRET" >> api.env

# Can't use docker restart because I want to be able to use --build flags and logs attached out-of-the-box
docker-compose stop $@
docker-compose up $@
