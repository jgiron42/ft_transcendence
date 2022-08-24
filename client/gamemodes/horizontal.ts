import { modifier as horizontalModifier } from "./modifiers/horizontal";
import { modifier as bigModifier } from "./modifiers/big";

import { Game as DefaultGame } from "./default";

const Game = horizontalModifier(bigModifier(DefaultGame));

export { Game };
