#! /bin/bash

# Check if config file is set & export to environment
if [ $CONFIG_FILE ]
then
	export $(cat $CONFIG_FILE) >/dev/null
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
		export "RUN_SCRIPT=dev"
	fi
fi

# Check if another command is provided & execute them
if [[ ! -z "$@" ]]
then
	$@
else
	npm run $RUN_SCRIPT
fi
