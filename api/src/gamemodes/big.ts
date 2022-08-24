import { modifier } from "./modifiers/big";
import { Game as DefaultGame } from "./default";

const Game = modifier(DefaultGame);

export { Game };
