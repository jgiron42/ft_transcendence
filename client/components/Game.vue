<!-- change component mode by changing menuid prop -->
<!-- 0 = online standard						   -->
<!-- 1 = local standard							   -->
<!-- 2 = online flappypong						   -->
<!-- 3 = local flappypong						   -->
<!-- 4 = demo mode								   -->
<template>
	<div class="flex w-full h-full">
		<div class="game_bis top-1/3">
			<canvas id="game" width="800" height="600"> </canvas>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

// Simple vector class
class Vector2D {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

// Vector quadratic
class Vector4D {
	x: number;
	y: number;
	z: number;
	w: number;
	constructor(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
}

// check if q is on Segment pr
function onSegment(p: Vector2D, q: Vector2D, r: Vector2D) {
	if (
		q.x <= Math.max(p.x, r.x) &&
		q.x >= Math.min(p.x, r.x) &&
		q.x <= Math.max(p.y, r.y) &&
		q.y >= Math.min(p.y, r.y)
	)
		return true;
}

// Check intersection orientation
function orientation(p: Vector2D, q: Vector2D, r: Vector2D) {
	const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.x);
	if (val === 0) return 0;
	return val > 0 ? 1 : 2;
}

// Check intersection depending on orientation

function intersect(p1: Vector2D, q1: Vector2D, p2: Vector2D, q2: Vector2D) {
	const o1 = orientation(p1, q1, p2);
	const o2 = orientation(p1, q1, q2);
	const o3 = orientation(p2, q2, p1);
	const o4 = orientation(p2, q2, q1);

	if (o1 !== o2 && o3 !== o4) return true;

	// Special cases
	if (o1 === 0 && onSegment(p1, p2, q1)) return true;
	if (o2 === 0 && onSegment(p1, q2, q1)) return true;
	if (o3 === 0 && onSegment(p2, p1, q2)) return true;
	return o4 === 0 && onSegment(p2, q1, q2);
}

class Player {
	pos: Vector2D;
	speed: number;
	size: Vector2D;
	minmaxVel: Vector4D;
	vel: Vector2D;
	acc: number;

	constructor(res: Vector2D, x: number) {
		this.size = new Vector2D(0.025 * res.y, 0.1 * res.y);
		this.pos = new Vector2D(x, res.y / 2 - 100 / 2);
		this.minmaxVel = new Vector4D(1.0, 1.0, 3.0, 3.0);
		this.speed = 7;
		this.vel = new Vector2D(0, 0);
		this.acc = 0.2;
	}

	update(vkUp: Boolean, vkDown: Boolean, res: Vector2D, gameMode: boolean, justPressed: boolean) {
		if (!gameMode) {
			// Standard controls
			if (vkUp && this.pos.y - this.speed > 40) {
				this.pos.y -= this.speed;
				if (this.vel.y + this.acc <= this.minmaxVel.w) this.vel.y += this.acc;
				if (this.vel.x + this.acc <= this.minmaxVel.z) this.vel.x += this.acc;
			} else if (vkDown && this.pos.y + this.speed < res.y - this.size.y - 40) {
				this.pos.y += this.speed;
				if (this.vel.y + this.acc <= this.minmaxVel.w) this.vel.y += this.acc;
				if (this.vel.x + this.acc <= this.minmaxVel.z) this.vel.x += this.acc;
			}
			if (!vkUp && !vkDown) {
				this.vel.y = 0;
				this.vel.x = 0;
			} else {
				this.speed = 7;
			}
		} else {
			this.speed = 4;
			if (this.pos.y + this.speed + this.size.y <= res.y) this.pos.y += this.speed;
			if (justPressed && this.pos.y - 1.5 * this.size.y >= 0) this.pos.y -= 1.5 * this.size.y;
		}
	}

	updatedPos(x: number) {
		this.pos.x = x;
	}

	draw(ctx: CanvasRenderingContext2D, unitx: number, unity: number) {
		ctx.beginPath();
		ctx.rect(this.pos.x + 2 + unitx, this.pos.y + 2 + unity, this.size.x, this.size.y);
		ctx.fillStyle = "#FF11FF";
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.rect(this.pos.x + unitx, this.pos.y + unity, this.size.x, this.size.y);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
		ctx.closePath();
	}
}

class Ball {
	speed: number;
	minspd: number;
	maxspd: number;
	pos: Vector2D;
	dir: Vector2D;
	size: Vector2D;
	acc: number;
	constructor(res: Vector2D) {
		this.speed = 5;
		// Set ball in middle of the screen
		this.pos = new Vector2D(res.x / 2, res.y / 2);

		this.dir = new Vector2D(this.speed, 0);
		this.size = new Vector2D(0.05 * res.y, 0.05 * res.y);
		this.minspd = 5;
		this.maxspd = 10;
		this.acc = 0.05;
	}

	update(res: Vector2D, players: Array<Player>) {
		if (this.pos.y + this.dir.y < 10 || this.pos.y + this.dir.y > res.y - this.size.x - 10)
			this.dir.y = -this.dir.y;

		this.pos.x += this.dir.x;
		this.pos.y += this.dir.y;
		for (let i = 0; i < players.length; i++) {
			this.collide(players[i], res);
		}
	}

	draw(ctx: CanvasRenderingContext2D, unitx: number, unity: number) {
		ctx.beginPath();
		ctx.rect(this.pos.x + 2 + unitx, this.pos.y + 2 + unity, this.size.x, this.size.x);
		ctx.fillStyle = "#0000FF";
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.rect(this.pos.x + unitx, this.pos.y + unity, this.size.x, this.size.x);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
		ctx.closePath();
	}

	rightVerticalCol(pad: Player) {
		this.speed += this.acc;
		this.dir.x = -this.dir.x * (1 + this.acc);
		let part = 0;
		if (
			this.pos.y + this.dir.y > pad.pos.y + pad.size.y / 3 &&
			this.pos.y + this.dir.y + this.size.x / 2 < pad.pos.y + (2 * pad.size.y) / 3
		)
			part = 1;
		else if (this.pos.y + this.dir.y + this.size.x >= pad.pos.y + (2 * pad.size.y) / 3) part = 2;
		if (part === 0) this.dir.y = -1 * this.speed;
		else if (part === 1) {
			this.dir.y = 0;
			this.dir.x = -this.minspd;
		} else this.dir.y = this.speed;
	}

	leftVerticalCol(pad: Player) {
		this.speed += this.acc;
		this.dir.x = -this.dir.x + this.acc * pad.vel.x;
		let part = 0;
		if (
			this.pos.y + this.dir.y + this.size.x > pad.pos.y + pad.size.y / 3 &&
			this.pos.y + this.dir.y + this.size.x / 2 < pad.pos.y + (2 * pad.size.y) / 3
		)
			part = 1;
		else if (this.pos.y + this.dir.y + this.size.x >= pad.pos.y + (2 * pad.size.y) / 3) part = 2;
		if (part === 0) this.dir.y = -this.speed;
		else if (part === 1) {
			this.dir.y = 0;
			this.dir.x = this.minspd;
		} else this.dir.y = this.speed * pad.vel.y;
	}

	topHorizontalCol(pad: Player) {
		if (
			intersect(
				this.pos,
				new Vector2D(this.pos.x + this.dir.x, this.pos.y + this.dir.y + this.size.x),
				pad.pos,
				new Vector2D(pad.pos.x + pad.size.x, pad.pos.y),
			)
		) {
			if (this.dir.y > 0) this.dir.y = -this.dir.y;
		}
	}

	bottomHorizontalCol(pad: Player) {
		if (
			intersect(
				this.pos,
				new Vector2D(this.pos.x + this.dir.x + this.size.x, this.pos.y + this.dir.y),
				new Vector2D(pad.pos.x, pad.pos.y + pad.size.y),
				new Vector2D(pad.pos.x + pad.size.x, pad.pos.y + pad.size.y),
			)
		) {
			if (this.dir.y < 0) this.dir.y = -this.dir.y;
		}
	}

	collide(pad: Player, res: Vector2D) {
		// Collisions verticales
		if (
			this.pos.y + this.dir.y + this.size.x / 2 >= pad.pos.y - this.size.x &&
			this.pos.y + this.dir.y + this.size.x / 2 <= pad.pos.y + pad.size.y + this.size.x
		) {
			if (this.pos.x + this.size.x / 2 > res.x / 2) {
				if (this.pos.x + this.dir.x < pad.pos.x && this.pos.x + this.dir.x + this.size.x > pad.pos.x)
					this.rightVerticalCol(pad);
			} else if (this.pos.x + this.size.x / 2 < res.x / 2) {
				if (
					this.pos.x + this.size.x + this.dir.x > pad.pos.x + pad.size.x &&
					this.pos.x + this.dir.x < pad.pos.x + pad.size.x
				)
					this.leftVerticalCol(pad);
			}
		}
		// Collisions horizontales
		this.topHorizontalCol(pad);
		this.bottomHorizontalCol(pad);
	}
}

export default Vue.extend({
	props: {
		menuid: {
			type: Number,
			default: 4,
		},
	},
	data: () => ({
		ingame: false,
		unitx: 0,
		unity: 0,
		canvas: null as HTMLCanvasElement | null,
		ctx: null as CanvasRenderingContext2D | null,
		interval: 5,
		vkUp: false,
		vkDown: false,
		p1Up: false,
		p1Down: false,
		score_p1: 0,
		score_p2: 0,
		res: null as Vector2D | null,
		ball: new Ball(new Vector2D(450, 300)),
		players: null as Array<Player> | null,
		justPressed: false,
		p1Pressed: false,
	}),
	mounted() {
		// Init Canvas and apply ratio
		this.canvas = document.getElementById("game") as HTMLCanvasElement;
		this.res = new Vector2D(this.canvas.width, this.canvas.height);
		// Setup player's array
		const p2 = new Player(this.res, this.res.x - this.res.x / 10);
		const p1 = new Player(this.res, this.res.x / 10 - p2.size.x);
		this.players = new Array(2);
		if (p1 && p2 && this.players) {
			this.players[0] = p1;
			this.players[1] = p2;
		}
		// Init canvas ctx
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		// Adding event hooks
		document.addEventListener("keydown", this.handleKeyPress, false);
		document.addEventListener("keyup", this.handleKeyRelease, false);

		// Create Entities
		setInterval(this.draw, 10);
	},
	methods: {
		// Rendering loop
		draw() {
			if (this.ctx && this.players && this.ball && this.res) {
				this.update();
				this.redraw();
			}
			// reset single press Singleton
			if (this.justPressed) this.justPressed = false;
			if (this.p1Pressed) this.p1Pressed = false;
		},
		redraw() {
			// render
			if (this.ctx && this.players && this.res && this.canvas) {
				// Make canvas responsive
				if (this.canvas.width !== window.innerWidth * 0.8) {
					this.unitx = this.canvas.width - window.innerWidth * 0.8;
					this.canvas.width = window.innerWidth * 0.8;
				}
				if (this.canvas.height !== window.innerWidth * 0.6) {
					this.unity = this.canvas.height - window.innerWidth * 0.6;
					this.canvas.height = window.innerWidth * 0.6;
				}
				this.res.x = this.canvas.width;
				this.res.y = this.canvas.height;
				this.clear();
				this.ball.draw(this.ctx, this.unitx, this.unity);
				this.players[0].draw(this.ctx, this.unitx, this.unity);
				this.players[1].draw(this.ctx, this.unitx, this.unity);
			}
		},
		// Check if ball oob & update score
		scorePoint() {
			if (this.res) {
				if (this.ball.pos.x + this.ball.dir.x <= 0) {
					this.score_p2 += 1;
					this.ball.pos.x = this.res.x / 2;
					this.ball.pos.y = this.res.y / 2;
					this.ball.dir.y = 1;
					if (this.ball.dir.x < 0) this.ball.dir.x = -this.ball.dir.x;
					this.ball.dir.x = 5;
					this.ball.speed = 5;
				} else if (this.ball.pos.x + this.ball.dir.x >= this.res.x) {
					this.score_p1 += 1;
					this.ball.pos.x = this.res.x / 2;
					this.ball.pos.y = this.res.y / 2;
					if (this.ball.dir.x > 0) this.ball.dir.x = -this.ball.dir.x;
					else this.ball.dir.x = 5;
					this.ball.dir.y = -1;
					this.ball.speed = 5;
				}
			}
		},
		update() {
			// update
			if (this.res && this.players) {
				this.players[0].updatedPos(this.res.x / 10 - this.players[0].size.x);
				this.players[1].updatedPos(this.res.x - this.res.x / 10);
				this.scorePoint();

				// If in menu, p1 follow ball else move on input
				if (this.menuid !== 4) {
					this.players[0].update(
						this.p1Down,
						this.p1Up,
						this.res,
						this.menuid === 2 || this.menuid === 3,
						this.p1Pressed,
					);
				} else if (this.ball.pos.y + this.ball.dir.y < this.players[0].pos.y)
					this.players[0].update(true, false, this.res, false, false);
				else if (this.ball.pos.y + this.ball.dir.y > this.players[0].pos.y + this.players[0].size.y)
					this.players[0].update(false, true, this.res, false, false);
				// 	player 2 inputs
				if (this.menuid !== 4) {
					if (this.menuid === 1 || this.menuid === 3) {
						this.players[1].update(this.vkUp, this.vkDown, this.res, this.menuid === 3, this.justPressed);
					} else {
						// get p2 inputs from server
					}
				} else if (this.ball.pos.y + this.ball.dir.y < this.players[1].pos.y)
					this.players[1].update(true, false, this.res, false, false);
				else if (this.ball.pos.y + this.ball.dir.y > this.players[1].pos.y + this.players[1].size.y)
					this.players[1].update(false, true, this.res, false, false);
				// Update ball
				this.ball.update(this.res, this.players);
			}
			if (this.score_p1 === 11 || this.score_p2 === 11) {
				this.score_p1 = 0;
				this.score_p2 = 0;
			}
		},
		// display background, playground and scores
		clear() {
			if (this.ctx && this.res && this.unitx && this.unity && this.canvas) {
				this.ctx.beginPath();
				this.ctx.fillStyle = "#ffffff";
				this.ctx.fillRect(0, 0, this.res.x, this.res.y);
				this.ctx.fillStyle = "#000000";
				this.ctx.fillRect(10, 10, this.res.x - 20, this.res.y - 20);
				this.ctx.fillStyle = "#ffffff";
				this.ctx.font = "100px roboto";
				this.ctx.fillText(String(this.score_p1), this.canvas.width * 0.4 + this.unitx - 75, 10 + this.unity + 100);
				this.ctx.fillText(String(this.score_p2), this.canvas.width * 0.6 + this.unitx + 25, 10 + this.unity + 100);
				this.ctx.fillRect(this.res.x / 2, 0, this.res.y / 60, this.res.y);
			}
		},
		// Event Handling
		handleKeyPress(event: KeyboardEvent) {
			if (event.key === "Up" || event.key === "ArrowUp") {
				this.vkUp = true;
				this.justPressed = true;
			} else if (event.key === "Down" || event.key === "ArrowDown") {
				this.vkDown = true;
			} else if (event.keyCode === 87) {
				this.p1Down = true;
				this.p1Pressed = true;
			} else if (event.keyCode === 83) {
				this.p1Up = true;
			}
		},
		handleKeyRelease(event: KeyboardEvent) {
			if (event.key === "Up" || event.key === "ArrowUp") this.vkUp = false;
			else if (event.key === "Down" || event.key === "ArrowDown") this.vkDown = false;
			else if (event.keyCode === 83) this.p1Up = false;
			else if (event.keyCode === 87) this.p1Down = false;
		},
	},
});
</script>

<style scoped>
canvas {
	padding: 0;
	margin: auto;
	display: block;
}

.game_bis {
	margin-left: auto;
	margin-right: auto;
	display: grid;
	align-content: center;
	justify-content: center;
}
</style>
