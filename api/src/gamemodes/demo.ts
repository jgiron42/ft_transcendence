import { modifier } from "./modifiers/demo";
import { Game as DefaultGame } from "./default";

const Game = modifier(DefaultGame);

export { Game };
