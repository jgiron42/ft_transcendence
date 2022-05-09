#!/bin/bash

# This scripts run on your server to deploy your project with bare docker/docker-compose.
# It is designed to run as root with a sudo rule.

####### ENV SANITIZATION #######

# Sanitize binaries used to clean env
env=/usr/bin/env
grep=/bin/grep
cat=/bin/cat

# Unset all env variables
unset $($env | $grep -o '^[^=]*')

# Export sane supplied env variables
export $($cat "$DEPLOY_PATH/.env")

########### CONFIG #############
DEPLOY_PATH="/root/deploy"
REPOSITORY_URL="git@gitlab.com:ft_transcendance/ft_transcendance.git"
REPOSITORY_BRANCH="main"

# If no PATH is set, set a default value
if [ -z "$PATH" ]; then
        export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
fi

###########   INIT  ############

# If DEPLOY_PATH directory doesnt exist, create it and clone the project in it
if [ ! -d "$DEPLOY_PATH" ]; then
        mkdir -p "$DEPLOY_PATH"
        cd "$DEPLOY_PATH"
        git clone -b "$REPOSITORY_BRANCH" "$REPOSITORY_URL" .
fi

###### REPOSITORY UPDATE #######

echo "------------------"
echo "  DEPLOYING $@"
echo "    AS $(id)"
echo "-----------------"

cd "$DEPLOY_PATH/ft_transcendance"

echo "--- FECTHING FROM ---"
echo "   $(git remote get-url origin)"
echo

git stash && git pull

echo
echo "--- CD to $PWD ---"
echo

#######


whitelisted_services="client api ft_proxy db"

echo "--- WHITELISTED SERVICES ---"
echo "    $whitelisted_services"
echo

allowed_services=""

for service in $@;do
        for whitelisted in $whitelisted_services; do
                if [ "$whitelisted" = "$service" ];then
                        allowed_services="$service $allowed_services"
                fi
        done
done

echo "--- DEPLOYING: ---"
echo "      $allowed_services"
if [ -z "$allowed_services" ];then
        echo '##################### ERROR #########################'
        echo 'NO ALLOWED SERVICES HAVE BEEN PASSED AS ARGUMENTS'
        echo "WHITELISTED SERVICES ARE: $whitelisted_services"
        echo '##################### EXITING ######################'
        exit 1
fi
echo "------------------"

docker-compose up -d --build $allowed_services

echo
echo "--- DEPLOYMENT DONE ---"
echo "-----------------------"
