<template>
	<canvas id="tuto" width="500" height="500"> </canvas>
</template>

<script lang="ts">
import Vue from "vue";

interface Vector2D {
	x: number;
	y: number;
}

interface Point2D {
	x: number;
	y: number;
}

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
	speed: Vector2D;
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

interface IntersectResult {
	result: boolean;
	x: number;
	y: number;
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
			speed: {
				x: -1,
				y: 0,
			},
		} as Ball,
		interval: 5,
		keyMap: {} as Record<string, KeyNode>,
		barSpeed: 2,
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
			speed: { x: -1, y: 0 },
		};
		this.keyMap = {
			KeyW: {
				handler: () => {
					this.barLeft.y -= this.barSpeed;
				},
				pressed: false,
			},
			KeyS: {
				handler: () => {
					// console.log("here");
					this.barLeft.y += this.barSpeed;
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
		intersect(
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			x3: number,
			y3: number,
			x4: number,
			y4: number,
		): IntersectResult {
			// Check if none of the lines are of length 0
			if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
				return { result: false } as IntersectResult;
			}

			const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

			// Lines are parallel
			if (denominator === 0) {
				return { result: false } as IntersectResult;
			}

			const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
			const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

			// is the intersection along the segments
			if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
				return { result: false } as IntersectResult;
			}

			// Return a object with the x and y coordinates of the intersection
			const x = x1 + ua * (x2 - x1);
			const y = y1 + ua * (y2 - y1);

			return { result: true, x, y };
		},
		handleBarIntersect(bar: Bar): void {
			const currentBallPos: Point2D = { x: this.ball.x, y: this.ball.y };
			const newBallPos: Point2D = {
				x: currentBallPos.x + this.ball.speed.x,
				y: currentBallPos.y + this.ball.speed.y,
			};
			const widthOffset = bar.width * (bar === this.barLeft ? 1 : -1);
			const barStart: Point2D = { x: bar.x + widthOffset, y: bar.y };
			const barEnd: Point2D = {
				x: barStart.x + widthOffset,
				y: bar.y + bar.height,
			};
			const intersect: IntersectResult = this.intersect(
				currentBallPos.x,
				currentBallPos.y,
				newBallPos.x,
				newBallPos.y,
				barStart.x,
				barStart.y,
				barEnd.x,
				barEnd.y,
			);
			if (intersect.result === true) {
				this.ball.x = intersect.x;
				this.ball.y = intersect.y;
				this.ball.speed.x *= -1;
				const isUp: boolean = intersect.y > bar.y + bar.height / 2;
				this.ball.speed.y = isUp ? 0.5 : -0.5;
				newBallPos.x = currentBallPos.x + this.ball.speed.x;
				newBallPos.y = currentBallPos.y + this.ball.speed.y;
			}
			this.ball.x = newBallPos.x;
			this.ball.y = newBallPos.y;
		},
		handleTopAndBottom() {
			const currentBallPos: Point2D = { x: this.ball.x, y: this.ball.y };
			const newBallPos: Point2D = {
				x: currentBallPos.x + this.ball.speed.x,
				y: currentBallPos.y + this.ball.speed.y,
			};
			if (
				newBallPos.y - this.ball.width / 2 < this.window.y ||
				newBallPos.y + this.ball.width / 2 > this.window.y + this.window.height
			)
				this.ball.speed.y *= -1;
		},
		updateGame() {
			for (const keyName in this.keyMap) {
				const key = this.keyMap[keyName] as KeyNode;
				if (key.pressed && key.handler) key.handler();
			}
			this.handleBarIntersect(this.barLeft);
			this.handleBarIntersect(this.barRight);
			this.handleTopAndBottom();

			if (this.ball.x > this.window.x + this.window.width || this.ball.x < this.window.x) {
				this.ball.x = this.window.x + this.window.width / 2;
				this.ball.y = this.window.y + this.window.height / 2;
				this.ball.speed.y = 0;
				this.ball.speed.x = 1;
			}
			this.replaceElemsInBound();
			this.redraw();
		},
	},
});
</script>
