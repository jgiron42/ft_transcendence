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

echo NPM VERSION: "$(npm --version)"
echo NODE VERSION: "$(node --version)"
echo NODE_ENV: $NODE_ENV
echo RUN_SCRIPT: $RUN_SCRIPT

npm run $RUN_SCRIPT
