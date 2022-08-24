import { Game, Player } from "../default";

// Modifier to invert paddle's width and height and have a big ball
const modifier = (Mode: typeof Game): typeof Game => {
	class HorizontalGame extends Mode {
		constructor() {
			// Construct the base mode
			super();

			// Change config values
			this.config.players.height = this.config.height * 0.01;
			this.config.players.width = this.config.width * 0.1;

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
	return HorizontalGame;
};

export { modifier };
