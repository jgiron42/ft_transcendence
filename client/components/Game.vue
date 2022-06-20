<template>
<canvas id="tuto" width="500" height="500">

</canvas>
</template>

<script lang="ts">
import Vue, { Component } from 'vue'

interface Window {
	x: number,
	y: number,
	width: number,
	height: number
};

interface Ball {
	x: number,
	y: number
	radius: number
};

interface Paddle {
	x: number,
	y: number,
	width: number,
	height: number
};

export default Vue.extend({
	data: () => ({
		canvas: null as HTMLCanvasElement | null,
		ctx: null as CanvasRenderingContext2D | null,
		window: {
			x: 50,
			y: 50,
			width: 400,
			height: 250
		} as Window,
		paddleLeft: {
			width: 10,
			height: 200,
			x: 0,
			y: 0
		} as Paddle,
		paddleRight: {
			width: 10,
			height: 200,
			x: 0,
			y: 0
		},
		ball: {
			x: 10,
			y: 10,
			radius: 2
		} as Ball
	}),
	created() {
		this.paddleLeft = {
			x: this.window.x + 10,
			y: this.window.y + 3 * this.window.height / 8,
			width: 10,
			height: this.window.height / 4
		};

		this.paddleRight = {
			x: this.window.x + this.window.width - 20,
			y: this.window.y + 3 * this.window.height / 8,
			width: 10,
			height: this.window.height / 4
		};

		this.ball = {
			x: this.window.x + this.window.width / 2,
			y: this.window.y + this.window.height / 2,
			radius: 10
		}
	},
	mounted() {
		this.canvas = document.getElementById("tuto") as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(
			this.window.x,
			this.window.y,
			this.window.width,
			this.window.height
		);
		this.ctx.fillStyle = 'rgb(255,255,255)'
		this.ctx.fillRect(
			this.paddleLeft.x,
			this.paddleLeft.y,
			this.paddleLeft.width,
			this.paddleLeft.height
		);

		this.ctx.fillRect(
			this.paddleRight.x,
			this.paddleRight.y,
			this.paddleRight.width,
			this.paddleRight.height
		);

		this.ctx.beginPath();
		this.ctx.arc(
			this.ball.x,
			this.ball.y,
			this.ball.radius,
			0,
			2 * Math.PI
		);
		this.ctx.fill();
		this.ctx.stroke();
		
	}
});

</script>