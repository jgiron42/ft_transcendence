#! /bin/bash

# Check if config file is set & export to environment
# https://gist.github.com/mihow/9c7f559807069a03e302605691f85572
if ! [ -z "$CONFIG_FILE" ]
then
	set -o allexport
	source "$CONFIG_FILE" set +o allexport
fi

# Set useful env values
export NODE_PATH=$PWD
export NODE_ENV=$DOCKER_NODE_ENV
if [ "$NODE_ENV" = "" ]
then
	unset NODE_ENV
fi

# Set the default npm run script
if [ ! $RUN_SCRIPT ]
then
	if [ "$NODE_ENV" = 'production' ]
	then
		export "RUN_SCRIPT=start:prod"
	else
		export "RUN_SCRIPT=start:dev"
	fi
fi

echo NPM VERSION: $(npm --version)
echo NODE VERSION: $(node --version)
echo NODE_ENV: $NODE_ENV
echo RUN_SCRIPT: $RUN_SCRIPT

# Check if another command is provided & execute them
if [[ ! -z "$@" ]]
then
	$@
else
	npm run $RUN_SCRIPT
fi
