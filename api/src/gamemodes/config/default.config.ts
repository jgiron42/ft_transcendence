const playerSizeRatio = { x: 0.01, y: 0.1 } as const;

const width = 1600;
const height = 900;

const minSpeed = 0.5;

const config = {
	width,
	height,
	maxScore: 11,
	spectating: false,
	collisionStep: 1 / 10,
	ball: {
		minSpeed,
		maxSpeed: 5,
		baseAcceleration: 0.02,
		initialDir: { x: minSpeed, y: 0 },
		initialPos: { x: (width - height * 0.02) / 2, y: (height - height * 0.02) / 2 },
		width: height * 0.02,
		height: height * 0.02,
	},
	players: {
		baseSpeed: 1,
		width: playerSizeRatio.x * width,
		height: playerSizeRatio.y * height,
		self: {
			initialPos: {
				x: width * 0.1 + playerSizeRatio.x * width,
				y: (height - playerSizeRatio.y * height) / 2,
			},
		},
		opponent: {
			initialPos: {
				x: width * 0.9 - playerSizeRatio.x * width,
				y: (height - playerSizeRatio.y * height) / 2,
			},
		},
	},
};

export default config;
