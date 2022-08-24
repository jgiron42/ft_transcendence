interface TwoDimensionalInterface {
	x: number;
	y: number;
}

// Type representing all possible events
type ImplementedEvents = "upP1" | "downP1" | "upP2" | "downP2" | "stopP1" | "stopP2";

// Point (x,y) type
type Point2D = TwoDimensionalInterface;

// Vector (x,y) type
type Vector2D = TwoDimensionalInterface;

// Interface for Player (paddle) class
interface PlayerInterface {
	pos: Point2D;
	speed: number;
	size: TwoDimensionalInterface;
}

// Interface for Ball class
interface BallInterface {
	acc: number;
	speed: number;
	minSpeed: number;
	maxSpeed: number;
	pos: Point2D;
	dir: Vector2D;
	size: TwoDimensionalInterface;
}

// Interface for game data
interface GameDataInterface {
	config: Record<string, unknown>;
	players: PlayerInterface[];
	ball: BallInterface;
	score: { p1: number; p2: number };
	area: { width: number; height: number };
	lastUpdate: number;
	ended: boolean;
}

// Type for return of collision handlers
interface CollisionResult {
	// Point of intersection (undefined when there is none)
	intersection: Point2D | undefined;

	// Function applying collision effects (inverting speed, etc)
	applyCollisionEffects: () => void;
}

interface SegmentInterface {
	p1: TwoDimensionalInterface;
	p2: TwoDimensionalInterface;
}

export {
	TwoDimensionalInterface,
	PlayerInterface,
	BallInterface,
	GameDataInterface,
	CollisionResult,
	ImplementedEvents,
	Point2D,
	Vector2D,
	SegmentInterface,
};
