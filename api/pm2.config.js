/* eslint-disable no-multi-str */
/* eslint-disable camelcase */
module.exports = {
	/*
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// First application
		{
			name: "ft_transcendance-api",
			script: "npm run start:prod",
			min_uptime: "5s",
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
	deploy: {
		production: {
			"key": process.env.ID_RSA,
			"user": "app",
			"host": [{ host: "oracle.nollium.com", port: "22" }],
			"ref": "origin/master",
			"repo": "git@gitlab.com:ft_transcendance/ft_transcendance.git",
			"path": "/home/app/deploy/ft_transcendance",
			"ssh_options": "StrictHostKeyChecking=no",
			"post-deploy":
				"cd api/;\
                                echo '- Copying prod config file';\
                                cp -f /home/app/deploy/ft_transcendance/config/api-config.json ./config.json;\
                                echo '- npm install';\
                                node --version;\
                                npm install;\
                                echo '- npm build';\
                                npm run build;\
                                echo '- Restarting with pm2';pm2 startOrGracefulReload pm2.config.js --env production",
		},
	},
};
