#! /bin/bash

# Set useful env values
export NODE_PATH=$PWD
: ${NODE_ENV:=production}

# Set the default npm run script
if [ -z "$RUN_SCRIPT" ]
then
	if [ "$NODE_ENV" = 'production' ]
	then
		export "RUN_SCRIPT=start"
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
