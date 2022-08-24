import { Game } from "../default";
import { modifier as DemoModifier } from "./demo";

// Modifier to make player 2 an IA
const modifier = (Mode: typeof Game): typeof Game => {
	// Get demo mode where both players are IA
	const DemoMode = DemoModifier(Mode);
	class BotGame extends Mode {
		constructor() {
			super();
			// Change player 2 update fonction to the demo's one
			this.players[1].gameModeUpdate = new DemoMode().players[1].gameModeUpdate.bind(this.players[1]) as (
				game: Game,
			) => void;

			// Set all user inputs to belong to the first player
			this.events.upP2 = this.events.upP1;
			this.events.downP2 = this.events.downP1;
		}
	}

	return BotGame;
};

export { modifier };
