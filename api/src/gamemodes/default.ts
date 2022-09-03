/* eslint-disable max-classes-per-file */

import _ from "lodash";
import boxIntersect from "box-intersect";
import { getIntersectionPoint } from "./utils/getIntersectionPoint";
import {
	BallInterface,
	CollisionResult,
	GameDataInterface,
	ImplementedEvents,
	PlayerInterface,
	Point2D,
	Vector2D,
} from "./types/geometry";
import config from "./config/default.config";

// Player (paddle) class
class Player implements PlayerInterface {
	// Position of the top left side of the paddle
	readonly pos: Vector2D = { x: 0, y: 0 };

	// Current paddle's speed (vertical only)
	speed = 0;

	// Width and height of the paddle
	readonly size: Vector2D = { x: config.players.width, y: config.players.height };

	// Update fonction reserved for gamemodes to inject
	gameModeUpdate = (__: Game) => {};

	// Data object reserved for gamemodes.
	gameModeData: Record<string, unknown> = {};

	constructor(x: number, y: number, gameConfig: typeof config) {
		// Init position.
		Object.assign(this.pos, { x, y });

		// Init size.
		Object.assign(this.size, { x: gameConfig.players.width, y: gameConfig.players.height });
	}

	// Moves the paddle to it's next position
	update = (game: Game) => {
		// Launch game mode injected code.
		this.gameModeUpdate(game);

		// Update position
		this.pos.y += this.speed * game.deltaTime;

		// Get boundary size
		const boundary = game.ball.size.y * 2;

		// Ensure player has not moved out of bounds.
		if (this.pos.y < boundary) this.pos.y = boundary;
		if (this.pos.y + this.size.y > game.area.height - boundary)
			this.pos.y = game.area.height - boundary - this.size.y;
	};

	// Clone player's member data
	cloneData() {
		return {
			pos: { ...this.pos },
			size: { ...this.size },
			speed: this.speed,
		};
	}

	// Replace player's member data (rollback)
	setData(data: PlayerInterface) {
		Object.assign(this.pos, data.pos);
		Object.assign(this.size, data.size);
		this.speed = data.speed;
	}
}

class Ball implements BallInterface {
	// Current ball raw speed
	speed: number;

	// Minimum ball raw speed
	minSpeed: number;

	// Maximum ball raw speed (unused)
	maxSpeed: number;

	// Ball's position (x,y)
	readonly pos: Vector2D;

	// Ball's directional speed (x,y)
	readonly dir: Vector2D;

	// Ball's width and height
	readonly size: Vector2D;

	// Accelration, is added to speed at each collision
	acc: number;

	constructor(gameConfig: typeof config) {
		this.pos = { ...gameConfig.ball.initialPos };
		this.dir = { ...gameConfig.ball.initialDir };
		this.size = { x: gameConfig.ball.width, y: gameConfig.ball.height };
		this.speed = gameConfig.ball.minSpeed;
		this.minSpeed = gameConfig.ball.minSpeed;
		this.maxSpeed = gameConfig.ball.maxSpeed;
		this.acc = gameConfig.ball.baseAcceleration;
	}

	update(game: Game, players: Player[]) {
		// Top and bottom boundary collisions
		if (
			this.pos.y + this.dir.y * game.deltaTime < 0 ||
			this.pos.y + this.dir.y * game.deltaTime + this.size.y > game.config.height
		)
			// Invert vertical direction
			this.dir.y = -this.dir.y;

		// Handle ball to paddles collisions
		this.collide(game, players);

		// Apply movement to ball position.
		this.pos.x += this.dir.x * game.deltaTime;
		this.pos.y += this.dir.y * game.deltaTime;
	}

	handleVerticalCollisions(
		game: Readonly<Game>,
		pad: Readonly<Player>,
		currentPointPosition: Readonly<Point2D>,
		nextPointPosition: Readonly<Point2D>,
	): CollisionResult {
		// Compute ball horizontal direction.
		const isRight = this.dir.x < 0;

		// Get potential collision horizontal position
		const hitColX = isRight ? pad.pos.x + pad.size.x : pad.pos.x;

		// Find a potential intersection with Player vertical sides.
		const intersection = getIntersectionPoint(
			{ p1: currentPointPosition, p2: nextPointPosition },
			{ p1: { x: hitColX, y: pad.pos.y }, p2: { x: hitColX, y: pad.pos.y + pad.size.y } },
		);

		// Create collision effects callback.
		const applyCollisionEffects = () => {
			// Ensure the intersection exists.
			if (!intersection) return;

			// Increase ball raw speed.
			this.speed += this.acc * this.speed >= 0 ? 1 : -1;

			// Invert horizontal direction.
			this.dir.x = -this.dir.x;

			// Split the Player side in three equal parts (top, middle, bottom)
			const [middleUpBoundary, middleDownBoundary] = [
				pad.pos.y + pad.size.y / 3,
				pad.pos.y + pad.size.y * (2 / 3),
			];

			this.dir.x = Math.abs(this.dir.x) * (isRight ? 1 : -1);
			// Handle hits on the top side.
			if (intersection.y < middleUpBoundary)
				this.dir.y =
					this.minSpeed < game.config.players.baseSpeed
						? -game.config.players.baseSpeed * 1.2
						: -this.minSpeed;
			// Handle hits on the bottom side.
			else if (intersection.y > middleDownBoundary)
				this.dir.y =
					this.minSpeed < game.config.players.baseSpeed ? game.config.players.baseSpeed * 1.2 : this.minSpeed;
			// Handle hits on the middle side.
			else
				Object.assign(this.dir, {
					y: 0,
					x: Math.sqrt(2 * Math.pow(this.minSpeed, 2)) * (isRight ? 1 : -1),
				});
		};

		// Return intersection and function to apply effects
		return { intersection, applyCollisionEffects };
	}

	handleHorizontalCollisions(
		game: Readonly<Game>,
		pad: Readonly<Player>,
		currentPointPosition: Readonly<Point2D>,
		nextPointPosition: Readonly<Point2D>,
	): CollisionResult {
		// Compute direction.
		// Handle case where ball is hit by a moving paddle
		if ((pad.speed > 0 && this.dir.y <= 0) || (pad.speed < 0 && this.dir.y >= 0)) {
			// Compute intersection between rectancle formed by current and next paddle position and the ball position
			const boxIntersections = boxIntersect([
				[pad.pos.x, pad.pos.y, pad.pos.x + pad.size.x, pad.pos.y + pad.size.y],
				[this.pos.x, this.pos.y, this.pos.x + this.size.x, this.pos.y + this.size.y],
			]);

			// Ensure there is at least one intersection
			if (boxIntersections.length) {
				// Create effects callback.
				const applyMovingPaddleCollisionEffects = () => {
					this.dir.y = pad.speed ? pad.speed * 1.2 : -this.dir.y;
					this.dir.x = Math.abs(this.dir.x) * (currentPointPosition.x < pad.pos.x + pad.size.x / 2 ? -1 : 1);
				};

				// Craft an appropriate intersection point that won't lead to overlapping.
				const movingPaddleIntersection = {
					x: currentPointPosition.x,
					y: pad.pos.y + (pad.speed > 0 ? pad.size.y + 5 : -5),
				};

				// Return intersection and callback.
				return {
					intersection: movingPaddleIntersection,
					applyCollisionEffects: applyMovingPaddleCollisionEffects,
				};
			}
		}
		// Try to find an intersection with either bottom or top side depending on direction.
		const intersection = getIntersectionPoint(
			{ p1: currentPointPosition, p2: nextPointPosition },
			{
				p1: { x: pad.pos.x, y: pad.pos.y + (currentPointPosition.y > pad.size.y ? pad.size.y : 0) },
				p2: {
					x: pad.pos.x + pad.size.x,
					y: pad.pos.y + (currentPointPosition.y > pad.size.y ? pad.size.y : 0),
				},
			},
		);

		// Create effects apply callback.
		const applyCollisionEffects = () => {
			// Apply 1.1 of the Player speed to the ball to ensure they won't overlap.
			this.dir.y *= -1;

			// Invert horizontal direction.
			this.dir.x =
				Math.abs(this.dir.x) *
				(pad.pos.x > game.config.width / 2 && currentPointPosition.x < pad.pos.x + pad.size.x / 2 ? -1 : 1);
		};

		// Return potential intersection and effects applying callback.
		return { intersection, applyCollisionEffects };
	}

	collide(game: Game, padArray: Player[]) {
		// Initialize variable storing ball position at potential intersection.
		const newPos = this.pos;

		// Initialize callback applying collisions effects.
		let applyEffectsCallback = () => {};

		// Initialize farthest intersection distance.
		let farthestDistance = 0;

		// Inizialize collision flag.
		let updateBallPosition = false;

		type CollisionHandler = typeof Ball.prototype.handleHorizontalCollisions;

		// Iterate over paddles
		for (const pad of padArray) {
			// Initialize array of collisions functions.
			const collisionFunctions = [
				this.handleHorizontalCollisions.bind(this),
				this.handleVerticalCollisions.bind(this),
			] as CollisionHandler[];

			// Partition each ball side in (1 / collisionStep) points to approximate collisions.
			const relativePositionsSampleArray = (() => {
				// Initialize array.
				const samplesArray = [];

				// Generate every samples.
				for (let i = 0; i <= 1; i += game.config.collisionStep)
					samplesArray.push({ x: 0, y: i }, { x: 1, y: i }, { x: i, y: 0 }, { x: i, y: 1 });

				// Sort the array depending on points distance to sides' middle to prioritize collisions with centered points.
				// e.g.: collision with a big ball moving in a straigth horizontal line hitting the middle of a paddle
				// should register as a collision in the paddle's middle
				samplesArray.sort((val1, val2) => {
					const dist1 = Math.abs(0.5 - (val1.x === 0 || val1.x === 1 ? val1.y : val1.x));
					const dist2 = Math.abs(0.5 - (val2.x === 0 || val2.x === 1 ? val2.y : val2.x));

					return dist1 - dist2;
				});

				// Return samples array.
				return samplesArray;
			})();

			// Try every collision handlers
			for (const collisionHandler of collisionFunctions) {
				// Compute intersections with every ball position sample points.
				for (const relativeSidePositionSample of relativePositionsSampleArray) {
					// Compute absolute sample form relative position.
					const currentSidePositionSample = {
						x: this.pos.x + this.size.x * relativeSidePositionSample.x,
						y: this.pos.y + this.size.y * relativeSidePositionSample.y,
					} as const;

					// Compute sample position after applying it's movement.
					const nextSidePositionSample = {
						x: currentSidePositionSample.x + this.dir.x * game.deltaTime,
						y: currentSidePositionSample.y + this.dir.y * game.deltaTime,
					} as const;

					// Find a potential intersection with the segment formed by current and next pos.
					const result = collisionHandler(game, pad, currentSidePositionSample, nextSidePositionSample);

					// Handle found intersection
					if (result.intersection) {
						// Calculate the exceedance distance after the intersection point.
						const distance = Math.sqrt(
							Math.pow(result.intersection.x - nextSidePositionSample.x, 2) +
								Math.pow(result.intersection.y - nextSidePositionSample.y, 2),
						);

						// Update new pos and callback when found distance is the greatest yet.
						if (distance > farthestDistance) {
							// Assign ball position at intersection to stored future position.
							_.merge(newPos, {
								x: result.intersection.x - this.size.x * relativeSidePositionSample.x,
								y: result.intersection.y - this.size.y * relativeSidePositionSample.y,
							});

							// Update farthest distance.
							farthestDistance = distance;

							// Update effects callback.
							applyEffectsCallback = result.applyCollisionEffects;

							// Flag that a collision has happened.
							updateBallPosition = true;
						}
					}
				}
			}
		}

		// Apply collision effects (e.g.: Inverting X and/or Y direction).
		(applyEffectsCallback.bind(this) as typeof applyEffectsCallback)();

		// Compute collisions again to apply potential collisions caused by applied effects right away.
		if (updateBallPosition) {
			// Update ball position.
			Object.assign(this.pos, {
				x: newPos.x + this.dir.x - (newPos.x - this.pos.x),
				y: newPos.y + this.dir.y - (newPos.y - this.pos.y),
			});

			// Accelerate the ball
			this.minSpeed += this.acc;
			// this.collide(padArray);
		}
	}

	// Clones the ball's data
	cloneData() {
		return {
			acc: this.acc,
			dir: { ...this.dir },
			maxSpeed: this.maxSpeed,
			minSpeed: this.minSpeed,
			pos: { ...this.pos },
			size: { ...this.size },
			speed: this.speed,
		};
	}

	// Replaces the ball's data (used for rollbacks)
	setData(data: BallInterface) {
		this.acc = data.acc;
		Object.assign(this.dir, data.dir);
		this.maxSpeed = data.maxSpeed;
		this.minSpeed = data.minSpeed;
		Object.assign(this.pos, data.pos);
		Object.assign(this.size, data.size);
		this.speed = data.speed;
	}
}

// Class containing all the game's functions and data
class Game {
	// Keep a clone of the config
	config = _.cloneDeep(config);

	// Init ball
	ball: Ball = new Ball(this.config);

	// Init score
	score: { p1: number; p2: number } = { p1: 0, p2: 0 };

	// Time at which the last update() was performed (used for delta timing)
	lastUpdate = 0;

	// Delay between lastUpdate and current update
	deltaTime = 0;

	// Set of events (i.e.: up,down)
	eventQueue = new Set<ImplementedEvents>();

	// Virtual game area
	area = { width: this.config.width, height: this.config.height };

	// Init players (must be only two)
	players: Player[] = [
		new Player(this.config.players.self.initialPos.x, this.config.players.self.initialPos.y, this.config),
		new Player(this.config.players.opponent.initialPos.x, this.config.players.opponent.initialPos.y, this.config),
	];

	// Init input event map
	events = {
		upP2: () => {
			this.players[1].speed = -this.config.players.baseSpeed;
		},
		downP2: () => {
			this.players[1].speed = this.config.players.baseSpeed;
		},
		stopP2: () => {
			this.players[1].speed = 0;
		},
		upP1: () => {
			this.players[0].speed = -this.config.players.baseSpeed;
		},
		downP1: () => {
			this.players[0].speed = this.config.players.baseSpeed;
		},
		stopP1: () => {
			this.players[0].speed = 0;
		},
	};

	// Game mode reserved arbitrary data object.
	gameModeData: Record<string, unknown> = {};

	// Game mode reserved update fonction
	gameModeUpdate = () => {};

	// Flag marking finished games (score > maxScore)
	ended = false;

	// Update the game to it's current state (move the players, ball, etc..)
	update = () => {
		// Don't update finished game.
		if (this.ended) return;

		// Initialize lastUpdate
		if (!this.lastUpdate) this.lastUpdate = Date.now();

		// Compute elapsed time since last update
		this.deltaTime = Date.now() - this.lastUpdate;

		// Advance the game state.
		this.gameModeUpdate();

		// Update ball's state
		this.ball.update(this, this.players);

		// Update all players state
		this.players.forEach((p: Player) => p.update(this));

		// Handle score exceeding the maximum
		if (this.score.p1 === this.config.maxScore || this.score.p2 === this.config.maxScore) this.ended = true;

		// Update score and reset positions.
		this.scorePoint();

		// Process inputs
		this.eventQueue.forEach((event) => this.events[event]());

		// Clear processed input
		this.eventQueue.clear();

		// Update update time (use deltaTime to avoid taking update's processing time in account)
		this.lastUpdate = this.lastUpdate + this.deltaTime;
	};

	// Check if ball oob & update score
	scorePoint() {
		if (this.ball.pos.x + this.ball.dir.x <= 0) {
			// Handle right player marking a point
			// Increase right player' score
			this.score.p2++;

			// Reset ball's position
			Object.assign(this.ball.pos, { ...this.config.ball.initialPos });

			// Reset ball's direction
			Object.assign(this.ball.dir, {
				x: this.config.ball.initialDir.x * -1,
				y: this.config.ball.initialDir.y * -1,
			});

			// Reset ball' speed
			this.ball.speed = this.config.ball.minSpeed;

			// Reset ball's base speed
			this.ball.minSpeed = this.config.ball.minSpeed;
		} else if (this.ball.pos.x + this.ball.dir.x >= this.config.width) {
			// Handle left player marking a point
			// Increase right player' score
			this.score.p1++;

			// Reset ball's position
			Object.assign(this.ball.pos, { ...this.config.ball.initialPos });

			// Reset ball's direction
			Object.assign(this.ball.dir, { ...this.config.ball.initialDir });

			// Reset ball' speed
			this.ball.speed = this.config.ball.minSpeed;

			// Reset ball's base speed
			this.ball.minSpeed = this.config.ball.minSpeed;
		}
	}

	// Clone all the game data.
	cloneData(): GameDataInterface {
		return {
			area: { ...this.area },
			ball: this.ball.cloneData(),
			config: _.cloneDeep({ ...this.config }),
			lastUpdate: this.lastUpdate,
			players: this.players.map((p) => p.cloneData()),
			score: { ...this.score },
			ended: this.ended,
		};
	}

	// Replace all the game data. (rollback)
	setData(data: GameDataInterface) {
		Object.assign(this.area, data.area);
		this.ball.setData(_.cloneDeep(data.ball));
		_.merge(this.config, _.cloneDeep(data.config));
		this.lastUpdate = new Date(data.lastUpdate).getTime();
		this.players.forEach((p, i) => p.setData(data.players[i]));
		Object.assign(this.score, data.score);
		this.ended = data.ended;
	}
}

export { Game, Player };
