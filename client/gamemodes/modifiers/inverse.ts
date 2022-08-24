import { Game, Player } from "../default";

// Modifier to invert paddles and ball size
const modifier = (Mode: typeof Game): typeof Game => {
	class InverseGame extends Mode {
		constructor() {
			// Construct the base mode
			super();

			// Change config values
			this.config.players.height = this.ball.size.y;
			this.config.players.width = this.ball.size.x;

			Object.assign(this.ball.size, { ...this.players[0].size });

			this.config.ball.width = this.ball.size.x;
			this.config.ball.height = this.ball.size.y;

			this.config.players.self = {
				initialPos: {
					x: this.area.width * 0.1,
					y: (this.area.height - this.config.players.height) / 2,
				},
			};

			this.config.players.opponent = {
				initialPos: {
					x: this.area.width * 0.9 - this.config.players.width,
					y: (this.area.height - this.config.players.height) / 2,
				},
			};

			// Reset players with new settings.
			this.players = [
				new Player(this.config.players.self.initialPos.x, this.config.players.self.initialPos.y, this.config),
				new Player(
					this.config.players.opponent.initialPos.x,
					this.config.players.opponent.initialPos.y,
					this.config,
				),
			];
		}
	}

	// Return modified game mode.
	return InverseGame;
};

export { modifier };
