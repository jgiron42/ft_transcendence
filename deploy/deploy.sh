#!/bin/bash


####### ENV SANITIZATION #######

env=/usr/bin/env
grep=/bin/grep
cat=/bin/cat

unset $($env | $grep -o '^[^=]*')

export $($cat /root/deploy/.env)

###### REPOSITORY UPDATE #######

echo "------------------"
echo "  DEPLOYING $@"
echo "    AS $(id)"
echo "-----------------"

cd /root/deploy/ft_transcendance

echo "--- FECTHING FROM ---"
echo "   $(git remote get-url origin)"
echo

git stash && git pull

echo
echo "--- CD to $PWD ---"
echo

#######


whitelisted_services="client api proxy db pgadmin"

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

export DUMMY_MOUNT="/dummy:/dummy"
export PGADMIN_VOLUME_PATH="/pgadmin"

docker-compose up -d --build --remove-orphans  $allowed_services

echo
echo "--- DEPLOYMENT DONE ---"
echo "-----------------------"