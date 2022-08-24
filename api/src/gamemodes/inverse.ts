import { modifier } from "./modifiers/inverse";
import { Game as DefaultGame } from "./default";

const Game = modifier(DefaultGame);

export { Game };
