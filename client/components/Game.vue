<template>
	<div>
		<canvas id="game"> </canvas>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

class Vector2D {
	x: number;
	y: number;
	constructor(x: number, y:number) {
		this.x = x
		this.y = y
	}
}

interface KeyNode {
	pressed: Boolean;
	handler: Function | null;
}

class Player {
	pos: Vector2D
	speed: number
	size: Vector2D
	constructor(screenWidth: number, screenHeight: number, x: number) {
		this.pos = new Vector2D(x, (screenHeight / 2) - 100 / 2)
		this.size = new Vector2D(20, 100)
		this.speed = 10;
	}
	update(vk_up: Boolean, vk_down: Boolean, res: Vector2D) {
		if (vk_up && this.pos.y - this.speed > 15) {
			this.pos.y -= this.speed;
		}
		else if (vk_down && this.pos.y + this.speed < res.y - 15 - this.size.y) {
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
}

class Ball {
	speed: number;
	pos: Vector2D;
	dir: Vector2D;
	ballradius: number;
	constructor(res: Vector2D) {
		this.speed = 5;
		this.pos = new Vector2D(res.x / 2, res.y / 2)
		this.dir = new Vector2D(this.speed, this.speed)
		this.ballradius = 10;
	}
	update(res: Vector2D) {
		if (this.pos.y + this.dir.y < this.ballradius / 2 || this.pos.y + this.dir.y > res.y - this.ballradius / 2)
			this.dir.y = -this.dir.y;
		if (this.pos.x + this.dir.x > res.x - this.ballradius / 2 || this.pos.x + this.dir.x < this.ballradius / 2)
			this.dir.x = -this.dir.x;
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
		res: new Vector2D(900, 600),
		ball: new Ball(new Vector2D(450, 300)),
		p1: new Player(900, 600, 40),
		p2: new Player(900, 600, 840),
	}),
	mounted() {
		// Init Canvas and apply ratio
		this.canvas = document.getElementById("game") as HTMLCanvasElement;
		this.canvas.width = this.res.x;
		this.canvas.height = this.res.y;
		this.res.x = this.res.x
		this.res.y = this.res.y

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
			if (this.ctx && this.p1 && this.ball && this.res) {
				// update
				this.p1.update(this.vk_up, this.vk_down, this.res);
				this.p2.update(false, false, this.res);
				this.ball.update(this.res);

				// render
				this.clear();
				this.ball.draw(this.ctx)
				this.p1.draw(this.ctx, this.res)
				this.p2.draw(this.ctx, this.res)
			}
		},

		// Refresh what is drawn to the screen
		clear() {
			if (this.ctx) {
				this.ctx.beginPath()
				this.ctx.fillStyle = "#ffffff";
				this.ctx.fillRect(0, 0, this.res.x, this.res.y);
				this.ctx.fillStyle = "#000000"
				this.ctx.fillRect(10, 10, this.res.x - 20, this.res.y - 20)
				this.ctx.fillStyle = "#ffffff";
				this.ctx.font = "100px roboto"
				this.ctx.fillText(String(this.score_p1), this.res.x / 2 - 200 - 25, 200)
				this.ctx.fillText(String(this.score_p2), this.res.x / 2 + 200 - 25, 200)
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