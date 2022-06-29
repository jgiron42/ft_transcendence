<template>
	<div class="flex w-full h-full">
		<div class="top-1/3">
			<canvas id="game" width="896" height="504"> </canvas>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";


// cap value to -1 1
function normalize(x: number) {
	if (x < -1) {
		while (x < -1)
			x += 1;
		return x;
	}
	else if (x > 1) {
		while (x > 1) {
			x -= 1;
		}
		return x;
	}
	return x;
}

function intersection(p1: Vector2D, p2: Vector2D, p3: Vector2D, p4: Vector2D) {
	let ua, ub, denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
	if (denom == 0) {
		return null
	}
	ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.y - p3.y)) / denom
	ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.y - p3.y)) / denom
	return new Vector2D(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
}

// Translate x from one range to another
function translate(x:number, s1: number, e1:number, s2: number, e2: number) {
	let leftSpan = e1 - s1	
	let rightSpan = e2 - s2
	let scaled = (x - s1) / leftSpan
	return normalize(s2 - (scaled*rightSpan))
}

class Vector2D {
	x: number;
	y: number;
	constructor(x: number, y:number) {
		this.x = x
		this.y = y
	}
}

class Player {
	pos: Vector2D
	speed: number
	size: Vector2D
	constructor(res: Vector2D, x: number) {
		this.size = new Vector2D(20, 100)
		this.pos = new Vector2D(x, (res.y / 2) - 100 / 2)
		this.speed = 10;
	}
	update(vk_up: Boolean, vk_down: Boolean, res: Vector2D) {
		if (vk_up && this.pos.y - this.speed > 0) {
			this.pos.y -= this.speed;
		}
		else if (vk_down && this.pos.y + this.speed < res.y - this.size.y) {
			this.pos.y += this.speed;
		}
	}
	draw(ctx: CanvasRenderingContext2D, res: Vector2D) {
		ctx.beginPath()
		ctx.rect(this.pos.x + 2, this.pos.y +2, this.size.x, this.size.y)
		ctx.fillStyle = "#0000FF"
		ctx.fill()
		ctx.closePath();
		ctx.beginPath()
		ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
		ctx.fillStyle = "#FFFFFF"
		ctx.fill()
		ctx.closePath();
	}
	get_width() {
		return this.size.x
	}
	get_height() {
		return this.size.y
	}
}

class Ball {
	speed: number;
	pos: Vector2D;
	dir: Vector2D;
	ballradius: number;
	constructor(res: Vector2D) {
		this.speed = 5;
		this.pos = new Vector2D(res.x / 2, res.y / 2)
		this.dir = new Vector2D(this.speed, 0)
		this.ballradius = 10;
	}
	update(res: Vector2D, ctx: CanvasRenderingContext2D) {
		if (this.pos.y + this.dir.y < this.ballradius / 2 || this.pos.y + this.dir.y > res.y - this.ballradius / 2)
			this.dir.y = -this.dir.y;
			
		this.pos.x += this.dir.x
		this.pos.y += this.dir.y
	}
	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath()
		ctx.arc(this.pos.x + 2, this.pos.y + 2, this.ballradius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ff0000";
		ctx.fill()
		ctx.closePath()
		ctx.beginPath()
		ctx.arc(this.pos.x, this.pos.y, this.ballradius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ffffff";
		ctx.fill();
		ctx.closePath();
	}
	bounce(x: number, y:number) {
		this.dir.x *= x;
		this.dir.y *= y;
	}
	collide(pad: Player, res: Vector2D) {
		// Colision pad right
		if (this.pos.y + this.dir.y >= pad.pos.y && this.pos.y + this.dir.y <= pad.pos.y + pad.size.y) {
			if (this.pos.x > res.x / 2) {
				if (this.pos.x < pad.pos.x && this.pos.x + this.dir.x > pad.pos.x) {
					this.dir.x = -this.dir.x
					let part = 0
					if (this.pos.y + this.dir.y > pad.pos.y + pad.size.y/3 && this.pos.y + this.dir.y < pad.pos.y + 2*pad.size.y/3)
						part = 1
					else if (this.pos.y + this.dir.y >= pad.pos.y + 2 * pad.size.y/3)
						part = 2
					if (part == 0)
						this.dir.y = -1
					else if (part == 1)
						this.dir.y = 0
					else
						this.dir.y = 1
				}
			} else if (this.pos.x < res.x / 2) {
				if (this.pos.x > pad.pos.x + pad.size.x && this.pos.x + this.dir.x < pad.pos.x + pad.size.x) {
					this.dir.x = -this.dir.x
					let part = 0
					if (this.pos.y + this.dir.y > pad.pos.y + pad.size.y/3 && this.pos.y + this.dir.y < pad.pos.y + 2*pad.size.y/3)
						part = 1
					else if (this.pos.y + this.dir.y >= pad.pos.y + 2 * pad.size.y/3)
						part = 2
					if (part == 0)
						this.dir.y = -1
					else if (part == 1)
						this.dir.y = 0
					else
						this.dir.y = 1
				}
			}
		}
	}
}

export default Vue.extend({
	data: () => ({
		canvas: null as HTMLCanvasElement | null,
		ctx: null as CanvasRenderingContext2D | null,
		interval: 5,
		vk_up: false,
		vk_down: false,
		score_p1: 0,
		score_p2: 0,
		res: null as Vector2D | null,
		ball: new Ball(new Vector2D(450, 300)),
		p1: null as Player | null,
		p2: null as Player | null,
	}),
	mounted() {
		// Init Canvas and apply ratio
		this.canvas = document.getElementById("game") as HTMLCanvasElement;
		this.res = new Vector2D(this.canvas.width, this.canvas.height);
		this.p2 = new Player(this.res, this.res.x - this.res.x / 10)
		if (this.p2)
			this.p1 = new Player(this.res, this.res.x / 10 - this.p2.size.x)

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
			if (this.ctx && this.p1 && this.ball && this.res && this.p2) {
				// update
				if (this.ball.pos.x + this.ball.dir.x <= 0) {
					this.score_p2 += 1
					this.ball.pos.x = this.res.x / 2;
					this.ball.pos.y = this.res.y / 2;
					this.ball.dir.y = 1
					this.ball.speed = 5
				} else if (this.ball.pos.x + this.ball.dir.x >= this.res.x) {
					this.score_p1 += 1
					this.ball.pos.x = this.res.x / 2;
					this.ball.pos.y = this.res.y / 2;
					this.ball.dir.y = -1
					this.ball.speed = 5
				}
				this.p1.update(this.vk_up, this.vk_down, this.res);
				if (this.ball.pos.y + this.ball.dir.y < this.p2.pos.y + this.p2.size.y / 2)
					this.p2.update(true, false, this.res);
				else if (this.ball.pos.y + this.ball.dir.y > this.p2.pos.y + this.p2.size.y / 2)
					this.p2.update(false, true, this.res);
				this.ball.update(this.res, this.ctx);
				this.ball.collide(this.p1, this.res);
				this.ball.collide(this.p2, this.res);
				// render
				this.clear();
				this.ball.draw(this.ctx)
				this.p1.draw(this.ctx, this.res)
				this.p2.draw(this.ctx, this.res)
			}
		},

		// Refresh what is drawn to the screen
		clear() {
			if (this.ctx && this.res) {
				this.ctx.beginPath()
				this.ctx.fillStyle = "#ffffff";
				this.ctx.fillRect(0, 0, this.res.x, this.res.y);
				this.ctx.fillStyle = "#000000"
				this.ctx.fillRect(10, 10, this.res.x - 20, this.res.y - 20)
				this.ctx.fillStyle = "#ffffff";
				this.ctx.font = "100px roboto"
				this.ctx.fillText(String(this.score_p1), this.res.x / 2 - this.res.x / 4 - 25, 200)
				this.ctx.fillText(String(this.score_p2), this.res.x / 2 + this.res.x / 4 - 25, 200)
				for (let i = 0; i < this.res.y / 2 * 24; i++) {
					if (i%2) {
						this.ctx.fillRect(this.res.x / 2 - 7, i * 20 + 10, 10, 20)
					}
				}
			}
		},
		handleKeyPress(event: KeyboardEvent) {
			if (event.key == "Up" || event.key == "ArrowUp")
				this.vk_up = true;
			else if (event.key == "Down" || event.key == "ArrowDown")
				this.vk_down = true;
		},
		handleKeyRelease(event: KeyboardEvent) {
			if (event.key == "Up" || event.key == "ArrowUp")
				this.vk_up = false;
			else if (event.key == "Down" || event.key == "ArrowDown")
				this.vk_down = false;
		}
	},
});
</script>

<style scoped>
canvas {
    padding: 0;
    margin: auto;
    display: block;
    width: 800px;
}
</style>