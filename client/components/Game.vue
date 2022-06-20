<template>
	<canvas id="tuto" width="500" height="500"> </canvas>
</template>

<script lang="ts">
import Vue from "vue";

interface Window {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Ball {
	x: number;
	y: number;
	width: number;
}

interface Bar {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface KeyNode {
	pressed: Boolean;
	handler: Function | null;
}

export default Vue.extend({
	data: () => ({
		canvas: null as HTMLCanvasElement | null,
		ctx: null as CanvasRenderingContext2D | null,
		window: {
			x: 50,
			y: 50,
			width: 400,
			height: 250,
		} as Window,
		barLeft: {
			width: 10,
			height: 200,
			x: 0,
			y: 0,
		} as Bar,
		barRight: {
			width: 10,
			height: 200,
			x: 0,
			y: 0,
		} as Bar,
		ball: {
			x: 10,
			y: 10,
			width: 2,
		} as Ball,
		interval: 5,
		keyMap: {} as Record<string, KeyNode>,
	}),
	created() {
		this.barLeft = {
			x: this.window.x + 10,
			y: this.window.y + (3 * this.window.height) / 8,
			width: 10,
			height: this.window.height / 4,
		};

		this.barRight = {
			x: this.window.x + this.window.width - 20,
			y: this.window.y + (3 * this.window.height) / 8,
			width: 10,
			height: this.window.height / 4,
		};

		this.ball = {
			x: this.window.x + this.window.width / 2,
			y: this.window.y + this.window.height / 2,
			width: 10,
		};
		this.keyMap = {
			KeyW: {
				handler: () => {
					this.barLeft.y -= 1;
				},
				pressed: false,
			},
			KeyS: {
				handler: () => {
					// console.log("here");
					this.barLeft.y += 1;
				},
				pressed: false,
			},
		};
	},
	mounted() {
		this.canvas = document.getElementById("tuto") as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		this.ctx.fillStyle = "rgb(0, 0, 0)";
		this.ctx.fillRect(this.window.x, this.window.y, this.window.width, this.window.height);
		this.ctx.fillStyle = "rgb(255,255,255)";

		document.addEventListener("keypress", this.handleKeyPress);
		document.addEventListener("keyup", this.handleKeyPress);
		this.redraw();
		setInterval(this.updateGame, this.interval);
	},
	methods: {
		drawBall() {
			if (this.ctx) {
				// this.ctx.beginPath();
				// this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
				// this.ctx.fill();
				// this.ctx.stroke();
				this.ctx.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.width);
			}
		},
		drawLeftBar() {
			if (this.ctx) this.ctx.fillRect(this.barLeft.x, this.barLeft.y, this.barLeft.width, this.barLeft.height);
		},
		drawRightBar() {
			if (this.ctx)
				this.ctx.fillRect(this.barRight.x, this.barRight.y, this.barRight.width, this.barRight.height);
		},
		clear() {
			if (this.ctx) {
				this.ctx.fillStyle = "rgb(0, 0, 0)";
				this.ctx.fillRect(this.window.x, this.window.y, this.window.width, this.window.height);
				this.ctx.fillStyle = "rgb(255,255,255)";
			}
		},
		redraw() {
			this.clear();
			this.drawBall();
			this.drawLeftBar();
			this.drawRightBar();
		},
		handleKeyPress(event: KeyboardEvent) {
			if (event) {
				// console.log(event);
				const keyNode = this.keyMap[event.code];
				// console.log(keyNode.t);
				if (keyNode) keyNode.pressed = event.type === "keypress";
			}
		},
		replaceElemsInBound() {
			if (this.barLeft.y + this.barLeft.height > this.window.y + this.window.height)
				this.barLeft.y = this.window.y + this.window.height - this.barLeft.height;
			if (this.barLeft.y < this.window.y) this.barLeft.y = this.window.y;
		},
		updateGame() {
			for (const keyName in this.keyMap) {
				const key = this.keyMap[keyName] as KeyNode;
				if (key.pressed && key.handler) {
					key.handler();
				}
			}
			this.replaceElemsInBound();
			this.redraw();
		},
	},
});
</script>
