import { Point } from "line-intersect";
import { Game } from "../default";
// eslint-disable-next-line
import getIntersectionPoint from "../utils/getIntersectionPoint";

// Modifier to make both players IAs (local only)
const modifier = (Mode: typeof Game): typeof Game => {
	// Inherit from passed game mode
	class DemoGame extends Mode {
		constructor() {
			// Construct base game mode.
			super();

			// Replace the players update functions
			this.players.forEach(
				(p) =>
					(p.gameModeUpdate = function (game: Game) {
						this.speed = 0;
						// Handle case where ball is not going in players direction
						if (
							(game.ball.dir.x > 0 && this.pos.x < game.ball.pos.x) ||
							(game.ball.dir.x < 0 && this.pos.x > game.ball.pos.x)
						) {
							// Return the paddle to middle
							const padMiddle = this.pos.y + this.size.y / 2;

							// Do nothing when paddle is in the middle
							if (
								game.area.height / 2 - game.config.players.baseSpeed <= padMiddle &&
								padMiddle <= game.area.height / 2 + game.config.players.baseSpeed
							)
								return;

							// Move the paddle towards the middle
							this.speed = game.config.players.baseSpeed * (game.area.height / 2 <= padMiddle ? -1 : 1);
						} else {
							// Get preferred top hitpoint
							const padTop = this.pos.y + this.size.y / 10;

							// Get preferred bottom hitpoint
							const padBottom = this.pos.y + this.size.y - this.size.y / 10;

							// Declare variable storing where the ball will hit the paddle's Y axis
							let predictedHit;

							// Compute the segment corresponding to the paddle's Y axis.
							const playerSegment = {
								p1: { x: this.pos.x + (game.ball.dir.x < 0 ? this.size.x : 0), y: 0 },
								p2: { x: this.pos.x + (game.ball.dir.x < 0 ? this.size.x : 0), y: game.area.height },
							};

							// Set the segment corresponding to the game area's top side
							const topSegment = { p1: { x: 0, y: 0 }, p2: { x: game.area.width, y: 0 } };

							// Set the segment corresponding to the game area's bottom side
							const bottomSegment = {
								p1: { x: 0, y: game.area.height },
								p2: { x: game.area.width, y: game.area.height },
							};

							// Init current ball trajectory point
							let pos = {
								x: game.ball.pos.x + game.ball.size.x / 2,
								y: game.ball.pos.y + game.ball.size.y / 2,
							};

							// Init current ball trajectory direction
							const dir = { ...game.ball.dir };

							// Trace the ball's trajectory until finding an intersection with the paddle's Y axis
							while (predictedHit === undefined) {
								// Create a line starting from current trajectory position, to an enough far away point to ensure finding an intersection
								const ballSegment = {
									p1: pos,
									p2: {
										x: pos.x + dir.x * (game.area.height + game.area.width) * 10,
										y: pos.y + dir.y * (game.area.height + game.area.width) * 10,
									},
								};

								// Try to find an intersection (hit) with the paddle's Y axis
								predictedHit = getIntersectionPoint(ballSegment, playerSegment);

								// Break when a hit is found
								if (predictedHit) break;

								// No hit was found, so get the intersection between top or bottom boundary and advance the trajectory to it.
								pos = getIntersectionPoint(
									ballSegment,
									dir.y > 0 ? bottomSegment : topSegment,
								) as Point;

								// In the cases where no intersection if found (e.g.: the ball is behind the paddle)
								// Fallback to a more naive tracking method
								if (!pos) break;

								// Invert ball's Y direction
								dir.y *= -1;
							}

							// When no hit was found, just move towards the next ball position
							predictedHit = predictedHit || {
								x: 0,
								y: game.ball.pos.y + game.ball.dir.y * game.deltaTime * 2 + game.ball.size.y / 2,
							};

							// Init selected hit point (paddle's bottom or top)
							let selectedPoint;

							// Selected the closest point to the predicted hit position
							if (Math.abs(padTop - predictedHit.y) > Math.abs(padBottom - predictedHit.y))
								selectedPoint = padBottom;
							else selectedPoint = padTop;

							// Don't move when we're close enough to the hit point.
							if (selectedPoint - 2 <= predictedHit.y && predictedHit.y <= selectedPoint + 2) return;

							// Move the paddle towards the hitpoint.
							this.speed = game.config.players.baseSpeed * (selectedPoint > predictedHit.y ? -1 : 1);
						}
					}),
			);

			// Disable all user input.
			this.events = {
				upP2: () => {},
				downP2: () => {},
				stopP2: () => {},
				upP1: () => {},
				downP1: () => {},
				stopP1: () => {},
			};
		}
	}

	// Return the modified class
	return DemoGame;
};

export { modifier };
