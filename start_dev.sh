#!/bin/sh
# Script to easily launch the project in dev mode

cd proxy
mv templates/default.conf.template ../
cp dev.default.conf.template templates/

cd ..
sudo chown -R 5050:5050 pgadmin/

docker-compose up $@
