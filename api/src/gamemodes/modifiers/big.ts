import { Game } from "../default";

// Modifier making the ball's bigger (x4)
const modifier = (Mode: typeof Game): typeof Game => {
	class BigBall extends Mode {
		constructor() {
			super();
			this.config.ball.height *= 4;
			this.config.ball.width *= 4;
			this.ball.size.x = this.config.ball.width;
			this.ball.size.y = this.config.ball.height;
		}
	}

	return BigBall;
};

export { modifier };
