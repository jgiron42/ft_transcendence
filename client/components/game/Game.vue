<template>
	<div
		id="wrapper"
		class="h-full w-full items-center align-middle content-center flex justify-center overflow-hidden"
	>
		<canvas
			v-show="isDrawn"
			id="game"
			:style="`width: ${display.width}px; height: ${display.height}px; border:10px solid white;`"
			class="relative"
			:width="display.width"
			:height="display.height"
		/>
		<Loader v-if="!isDrawn" class="mx-auto animate-spin h-full" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import { modifier as BotModifier } from "~/gamemodes/modifiers/bot";
import { modifier as DemoModifier } from "~/gamemodes/modifiers/demo";
import { TwoDimensionalInterface } from "~/gamemodes/types/geometry";
import { Game } from "~/gamemodes/default";
import type { ClientMatch } from "~/types/game-status";

type ImplementedEvents = "upP1" | "downP1" | "upP2" | "downP2" | "stopP1" | "stopP2";

type Point2D = TwoDimensionalInterface;
// type Vector2D = TwoDimensionalInterface;

// Interface defining player attributes safely accessible in this component.
interface PlayerClientInterface {
	pos: Point2D;
	size: TwoDimensionalInterface;
}

// Interface defining ball attributes safely accessible in this component.
interface BallClientInterface {
	pos: Point2D;
	size: TwoDimensionalInterface;
}

// Interface defining every game attributes that are safely accessibles in this component.
interface GameClientInterface {
	players: PlayerClientInterface[];
	ball: BallClientInterface;
	score: { p1: number; p2: number };
	area: { width: number; height: number };
	ended: boolean;
	lastUpdate: number;
	eventQueue: Set<ImplementedEvents>;
	update: () => void;
	cloneData: () => any;
	setData: (_: any) => any;
}

// Ensure base keymap immutability by wrapping it in a pure fonction that clones the keymap.
function getBaseKeyMap() {
	return _.cloneDeep({
		Up: { pressed: false, event: "upP2" },
		ArrowUp: { pressed: false, event: "upP2" },
		Down: { pressed: false, event: "downP2" },
		ArrowDown: { pressed: false, event: "downP2" },
		KeyZ: { pressed: false, event: "upP1" },
		KeyW: { pressed: false, event: "upP1" },
		KeyS: { pressed: false, event: "downP1" },
		ClickLeftTop: { pressed: false, event: "upP1" },
		ClickLeftBottom: { pressed: false, event: "downP1" },
		ClickRightTop: { pressed: false, event: "upP2" },
		ClickRightBottom: { pressed: false, event: "downP2" },
	});
}

// Keymap type.
type KeyMap = ReturnType<typeof getBaseKeyMap>;

// Keys type.
type HandledKeys = keyof KeyMap;

// Type of data used for for rollbacks.
type GameData = ReturnType<typeof Game.prototype.cloneData>;

export default Vue.extend({
	name: "Game",
	data: () => ({
		canvas: {} as HTMLCanvasElement,
		wrapper: {} as HTMLElement,
		ctx: {} as CanvasRenderingContext2D,
		display: { width: 0, height: 0 },
		game: {} as GameClientInterface,
		displayGrowRatio: 0.98,
		hasStateBeenUpdated: 0,
		lastUpdate: Date.now(),
		gameMode: "",
		backendData: {} as GameData,
		isDrawn: false,
		updateInterval: {} as NodeJS.Timeout,
		drawInterval: {} as NodeJS.Timeout,
		timeOffset: 0,
		online: false,
		lastBackendUpdate: 0,
		ping: 0,
		lowestPing: 0,
		averagePing: 0,
		syncTimeInterval: 5000,
		syncInterval: {} as NodeJS.Timeout,
		syncAmounts: 0,
		spectating: false,
		currentPlayer: "P1" as "P1" | "P2",
		keyMap: getBaseKeyMap(),
		font: "roboto",
	}),
	async mounted() {
		try {
			// Ensure component is properly created
			const wrapper = document.getElementById("wrapper");

			// Abort when there's a problem
			if (!wrapper) throw new Error("Could not find wrapper");

			// Store element.
			this.wrapper = wrapper;

			// Load the selected game mpde.
			const ModifiedMode = await this.loadGameMode();

			// Ensure the game mode was found and properly loaded.
			if (!ModifiedMode) throw new Error(`Could not load game mode ${this.gameMode}`);

			// Initialize the game instance.
			this.game = new ModifiedMode();

			// Adding event hooks
			document.addEventListener("keydown", this.handleKeyPress, false);
			document.addEventListener("keyup", this.handleKeyRelease, false);

			// Init Canvas and apply ratio
			this.canvas = document.getElementById("game") as HTMLCanvasElement;

			// Add listeners for touchscreen events.
			this.initTouchScreenInput();

			// Init canvas ctx
			this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

			// Setup game loop.
			this.updateInterval = setInterval(this.update, 0);
			this.drawInterval = setInterval(this.redraw, 15);

			this.setFullScreen();
		} catch (err: any) {
			// Log and display any error.
			console.warn("game:", err);
			this.$nuxt.$router.push("/matchmaking");
		}
	},
	beforeDestroy() {
		// Stop the game loop
		if (this.updateInterval) clearInterval(this.updateInterval);
		if (this.drawInterval) clearInterval(this.drawInterval);

		// Stop the periodic time synchronization.
		if (this.syncInterval) clearInterval(this.syncInterval);

		// Stop listening to any game updates.
		this.$gameSocket.clearMatchingEvents("game");

		// Reset the game plugin state.
		this.$game.reset();

		// Get out of fullscreen mode.
		this.unsetFullScreen();

		// Stop handling touch events.
		document.body.removeEventListener("touchstart", this.handleTouchStart, false);
		document.body.removeEventListener("touchend", this.handleTouchEnd, false);
	},
	methods: {
		async unsetFullScreen() {
			// Automatically set landscape fullscreen on mobile devices.
			if (this.$device.isMobileOrTablet) {
				try {
					// Set fullscreen.
					await document.exitFullscreen();

					// Set screen orientation to landscape.
					await screen.orientation.unlock();
				} catch (_) {}
			}
		},
		async setFullScreen() {
			// Automatically set landscape fullscreen on mobile devices.
			if (this.$device.isMobileOrTablet) {
				try {
					// Set fullscreen.
					await document.documentElement.requestFullscreen();

					// Set screen orientation to landscape.
					await screen.orientation.lock("landscape");
				} catch (_) {}
			}
		},
		handleTouchStart(ev: TouchEvent) {
			// Calculate the screen's middle positions
			const [xMiddle, yMiddle] = [document.body.scrollWidth / 2, document.body.clientHeight / 2];
			this.setFullScreen();
			// Create a temporary map to register any events caused by touches.
			const localMap: Partial<Record<HandledKeys, boolean>> = {
				ClickLeftTop: false,
				ClickLeftBottom: false,
				ClickRightTop: false,
				ClickRightBottom: false,
			};

			// Extract all touches.
			const touchList = ev.touches;

			// Register every events causes by current touches.
			for (let index = 0; index < touchList.length; index++) {
				// Get current touch
				const touch = touchList[index];

				// Ger current touch's position
				const [x, y] = [touch.clientX, touch.clientY];

				// Register clicks in the top left corner.
				localMap.ClickLeftTop = localMap.ClickLeftTop || (x < xMiddle && y < yMiddle);

				// Register clicks in the bottom left corner.
				localMap.ClickLeftBottom = localMap.ClickLeftBottom || (x < xMiddle && y > yMiddle);

				// Register clicks in the top right corner.
				localMap.ClickRightTop = localMap.ClickRightTop || (x > xMiddle && y < yMiddle);

				// Register clicks in the right bottom corner.
				localMap.ClickRightBottom = localMap.ClickRightBottom || (x > xMiddle && y > yMiddle);
			}

			// Merge registered events with the game keymap.
			Object.entries(localMap).forEach(([key, val]) => {
				this.keyMap[key as HandledKeys].pressed = val as boolean;
			});

			// Send the new user input values to the backend.
			this.updateUserInputInBackend();
		},
		handleTouchEnd(ev: TouchEvent) {
			const [xMiddle, yMiddle] = [document.body.scrollWidth / 2, document.body.clientHeight / 2];

			// Create a temporary map to register any events caused by touches.
			const localMap: Partial<Record<HandledKeys, boolean>> = {
				ClickLeftTop: false,
				ClickLeftBottom: false,
				ClickRightTop: false,
				ClickRightBottom: false,
			};

			// Initialize list of all touches.
			const touchList = [] as Touch[];

			// Initialize list of all changed touches.
			const changedList = [] as Touch[];

			// Add every changed touches to the list
			// (We have to do this because TouchList doesn't have iterators, only indexes)
			for (let index = 0; index < ev.changedTouches.length; index++) changedList.push(ev.changedTouches[index]);

			// Add every touches to the list
			for (let index = 0; index < ev.touches.length; index++) touchList.push(ev.changedTouches[index]);

			// Remove every ended touches from touch list, then register the remaining inputs.
			touchList
				.filter((touch) => changedList.find((found) => found.identifier === touch.identifier))
				.forEach((touch) => {
					// Get current touch position.
					const [x, y] = [touch.clientX, touch.clientY];

					// Register clicks in the top left corner.
					localMap.ClickLeftTop = localMap.ClickLeftTop || !(x < xMiddle && y < yMiddle);

					// Register clicks in the bottom left corner.
					localMap.ClickLeftBottom = localMap.ClickLeftBottom || !(x < xMiddle && y > yMiddle);

					// Register clicks in the top right corner.
					localMap.ClickRightTop = localMap.ClickRightTop || !(x > xMiddle && y < yMiddle);

					// Register clicks in the right bottom corner.
					localMap.ClickRightBottom = localMap.ClickRightBottom || !(x > xMiddle && y > yMiddle);
				});

			// Merge the registered inputs with the game keymap.
			Object.entries(localMap).forEach(([key, val]) => {
				this.keyMap[key as HandledKeys].pressed = val as boolean;
			});

			// Send the updated user input to the backend.
			this.updateUserInputInBackend();
		},
		initTouchScreenInput() {
			// Register new touches.
			document.body.addEventListener("touchstart", this.handleTouchStart, false);

			// Unregister ended touches.
			document.body.addEventListener("touchend", this.handleTouchEnd, false);
		},
		// Backend and browser's clocks are out of sync when run on different machines (which is always in production)
		// So we need to sync them up back using the NTP algorithm.
		// https://stackoverflow.com/a/22969338/10124517
		syncTime() {
			// the NTP algorithm
			// t0 is the client's timestamp of the request packet transmission,
			// t1 is the server's timestamp of the request packet reception,
			// t2 is the server's timestamp of the response packet transmission and
			// t3 is the client's timestamp of the response packet reception.
			// timeoffest is the offset between server and local clock.
			const t0 = Date.now();

			// Query the server's date
			this.$axios
				.get("/ntp")
				.then((response) => {
					const serverTime = response.data as number;

					// Init timestamps
					const [t1, t2, t3] = [serverTime, serverTime, Date.now()];

					// Increment syncAmout (used for average)
					this.syncAmounts++;

					// Get client/server latency
					this.ping = t3 - t0;

					// Update the average ping
					this.averagePing = (this.averagePing * (this.syncAmounts - 1) + this.ping) / this.syncAmounts;

					// If the ping is lower than previously recorded,
					// Update the clock offset, as it is more accurate
					// (current NTP usage assumes 1st packet transmission is instantaneous, which wrongfully increases timeout)
					if (!this.lowestPing || this.ping < this.lowestPing) {
						this.timeOffset = (t1 - t0 + (t2 - t3)) / 2;
						this.lowestPing = this.ping;
					}
				})
				.catch((_) => {});
		},
		handleGameUpdate(game: ClientMatch) {
			// Ensure game is still ongoing
			if (game.data.ended || game.status === "finished" || game.status === "aborted") {
				// Game is finished, redirect back to menu.
				this.$router.push("/matchmaking");
				return;
			}

			// Get the date of the update from backend, and substract offset to resync it.
			const convertedDate = new Date(game.data.lastUpdate).getTime() - this.timeOffset;

			// Update game data update time whith synchronized one.
			game.data.lastUpdate = convertedDate;

			// Ensure this packet wasn't sent before the last received one.
			if (!this.lastBackendUpdate || this.lastBackendUpdate < convertedDate) {
				// Update the stored backend data, which will update the game on next game loop iteration.
				_.merge(this.backendData, _.cloneDeep(game.data));

				// Update the update time.
				this.lastUpdate = convertedDate;

				// Let the game loop know it should update the local game state.
				this.hasStateBeenUpdated = this.lastUpdate;
			}
		},
		initConnection() {
			// Synchronize browser and server clocks
			this.syncTime();

			// Format the event depending if spectating or not.
			const event = this.$game.spectating ? `game:spectateUpdate=${this.$game.id}` : "game:updateStatus";

			// Listen for game state updates.
			this.$gameSocket.on(event, this.handleGameUpdate);
		},
		async loadGameMode(): Promise<typeof Game | null> {
			this.gameMode = this.$nuxt.$game.mode || this.gameMode;
			this.spectating = this.$nuxt.$game.spectating;

			// Ensure a game mode was passed to the component.
			if (!this.gameMode) throw new Error("Could not load game mode: " + this.gameMode);

			// Extract type:mode from passed gamemode string.
			const [type, mode] = this.gameMode.split(":");

			// Dynamically import the game mode class.
			const GameMode = (await import("~/gamemodes/" + mode)).Game;

			// Init the modifier (used here to set bots up)
			let modifier = (GameMode: any) => GameMode;

			// If there is only one local player, set all events to player 1
			// Else, reset the keymap.
			let newKeymap = {
				Up: { pressed: false, event: "upP2" },
				ArrowUp: { pressed: false, event: "upP2" },
				Down: { pressed: false, event: "downP2" },
				ArrowDown: { pressed: false, event: "downP2" },
				KeyZ: { pressed: false, event: "upP1" },
				KeyW: { pressed: false, event: "upP1" },
				KeyS: { pressed: false, event: "downP1" },
				ClickLeftTop: { pressed: false, event: "upP1" },
				ClickLeftBottom: { pressed: false, event: "downP1" },
				ClickRightTop: { pressed: false, event: "upP2" },
				ClickRightBottom: { pressed: false, event: "downP2" },
			};

			if (type === "bot")
				newKeymap = {
					Up: { pressed: false, event: "upP1" },
					ArrowUp: { pressed: false, event: "upP1" },
					Down: { pressed: false, event: "downP1" },
					ArrowDown: { pressed: false, event: "downP1" },
					KeyZ: { pressed: false, event: "upP1" },
					KeyW: { pressed: false, event: "upP1" },
					KeyS: { pressed: false, event: "downP1" },
					ClickLeftTop: { pressed: false, event: "upP1" },
					ClickLeftBottom: { pressed: false, event: "downP1" },
					ClickRightTop: { pressed: false, event: "upP1" },
					ClickRightBottom: { pressed: false, event: "downP1" },
				};
			else if (type === "online") {
				this.currentPlayer = this.$game.isP1 ? "P1" : "P2";
				const p = this.currentPlayer;
				newKeymap = {
					Up: { pressed: false, event: `up${p}` },
					ArrowUp: { pressed: false, event: `up${p}` },
					Down: { pressed: false, event: `down${p}` },
					ArrowDown: { pressed: false, event: `down${p}` },
					KeyZ: { pressed: false, event: `up${p}` },
					KeyW: { pressed: false, event: `up${p}` },
					KeyS: { pressed: false, event: `down${p}` },
					ClickLeftTop: { pressed: false, event: `up${p}` },
					ClickLeftBottom: { pressed: false, event: `down${p}` },
					ClickRightTop: { pressed: false, event: `up${p}` },
					ClickRightBottom: { pressed: false, event: `down${p}` },
				};
			}

			switch (type) {
				case "online":
					// Mark game as online
					this.online = true;

					// Listen to game updates and synchronize clocks.
					this.initConnection();

					// Set a periodic time synchronization.
					this.syncInterval = setInterval(this.syncTime, this.syncTimeInterval);
					break;

				case "bot":
					// Transform right player into a bot.
					modifier = BotModifier;
					break;

				case "demo":
					// Transform both players into bots.
					modifier = DemoModifier;
					break;
			}

			_.merge(this.keyMap, newKeymap);

			// Return transformed game class.
			return modifier(GameMode);
		},
		getDisplayedX(x: number) {
			// Project X coordinates from virtual game area to display
			return (x * this.display.width) / this.game.area.width;
		},
		getDisplayedY(y: number) {
			// Project Y coordinates from virtual game area to display
			return (y * this.display.height) / this.game.area.height;
		},
		resizeCanvas() {
			// Shorthand variable for display var.
			const display = this.display;

			// Resize display to fill the screen proportionally to the configured grow ration.
			display.width = this.wrapper.scrollWidth * this.displayGrowRatio;
			display.height = this.wrapper.scrollHeight * this.displayGrowRatio;

			// Compute the maximum height and width while respecting virtual game area proportions.
			if (display.height * (this.game.area.width / this.game.area.height) > display.width)
				display.height = display.width * (this.game.area.height / this.game.area.width);
			else display.width = display.height * (this.game.area.width / this.game.area.height);

			// Update the canvas' width.
			display.width = Math.ceil(display.width);

			// Update the canvas' height.
			display.height = Math.ceil(display.height);
		},
		drawPlayer(player: PlayerClientInterface) {
			// Draw the glitch border.
			this.ctx.beginPath();
			this.ctx.rect(
				this.getDisplayedX(player.pos.x) + 2,
				this.getDisplayedY(player.pos.y) + 2,
				this.getDisplayedX(player.size.x),
				this.getDisplayedY(player.size.y),
			);
			this.ctx.fillStyle = "#FF11FF";
			this.ctx.fill();
			this.ctx.closePath();

			// Draw the paddle's main rectangle.
			this.ctx.beginPath();
			this.ctx.rect(
				this.getDisplayedX(player.pos.x),
				this.getDisplayedY(player.pos.y),
				this.getDisplayedX(player.size.x),
				this.getDisplayedY(player.size.y),
			);
			this.ctx.fillStyle = "#FFFFFF";
			this.ctx.fill();
			this.ctx.closePath();
		},
		drawBall(ball: BallClientInterface) {
			// Draw the ball's glitch border.
			this.ctx.beginPath();
			this.ctx.rect(
				this.getDisplayedX(ball.pos.x) + 2,
				this.getDisplayedY(ball.pos.y) + 2,
				this.getDisplayedX(ball.size.x),
				this.getDisplayedY(ball.size.y),
			);
			this.ctx.fillStyle = "#0000FF";
			this.ctx.fill();
			this.ctx.closePath();

			// Draw the main ball's rectangle.
			this.ctx.beginPath();
			this.ctx.rect(
				this.getDisplayedX(ball.pos.x),
				this.getDisplayedY(ball.pos.y),
				this.getDisplayedX(ball.size.x),
				this.getDisplayedY(ball.size.y),
			);
			this.ctx.fillStyle = "#FFFFFF";
			this.ctx.fill();
			this.ctx.closePath();
		},
		// Rendering loop
		update() {
			// Rollback the game state when a new state has been received from backend.
			if (this.hasStateBeenUpdated) this.game.setData(_.cloneDeep(this.backendData));

			// Go back to menu in case of timeout.
			// If the game is still ongoing, we will be redirected back to a healthy state anyway.
			if (
				this.game.ended ||
				(this.online && this.lastBackendUpdate && Date.now() - this.lastBackendUpdate > 5000)
			) {
				console.warn("Game ended or there haven't been any updates in 5s, redirecting back to menu");
				this.$nuxt.$router.push("/matchmaking");
			}

			// Reset the update flag.
			this.hasStateBeenUpdated = 0;

			// Add the game events from the users' inputs
			const eventList = Object.values(this.keyMap)
				.filter((key) => key.pressed === true)
				.flatMap((key) => key.event);

			// Stop player 1 when it's a local player and has no current inputs
			if (!this.spectating && !eventList.some((event) => event.includes("P1"))) eventList.push("stopP1");

			// Stop player 2 when it's a local player and has no current inputs
			if (!this.online && !eventList.some((event) => event.includes("P2"))) eventList.push("stopP2");

			// Add user inputs events to game's queue.
			eventList.forEach((event) => this.game.eventQueue.add(event as ImplementedEvents));

			// Advance the game state.
			if (this.ping < 70 && this.averagePing < 70) this.game.update();
		},
		redraw() {
			// Resize the canvas before drawing
			this.resizeCanvas();

			// Clear everything and redraw the background
			this.clear();

			// Display the ball.
			this.drawBall(this.game.ball);

			// Display the players.
			this.game.players.forEach((p) => this.drawPlayer(p));

			// Mark that the game has been rendered at least one time (turns off the loader)
			this.isDrawn = true;
		},
		// display background, playground and scores
		clear() {
			// Ensure the elements exists
			if (this.ctx && this.canvas) {
				// Clear the canvas
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

				// Redraw the background
				this.ctx.beginPath();
				this.ctx.fillStyle = "#000000";
				this.ctx.fillRect(0, 0, this.display.width, this.display.height);

				// Set the text's color to white
				this.ctx.fillStyle = "#ffffff";

				// Set the font size depending on displat size.
				const fontSize = 50 * (1 + Math.floor(this.display.width / 800));

				// Format the font string.
				this.ctx.font = `${fontSize}px ${this.font}`;

				// Display player 1's score
				this.ctx.fillText(
					this.game.score.p1.toString(),
					this.display.width / 4,
					this.display.height / 20 + fontSize,
					this.display.width / 4,
				);

				// Display player 2's score
				this.ctx.fillText(
					this.game.score.p2.toString(),
					(this.display.width * 3) / 4,
					this.display.height / 20 + fontSize,
					this.display.width / 4,
				);

				// Set small font to display network infos.
				this.ctx.font = `10px ${this.font}`;

				// Display current latency.
				this.ctx.fillText(`${this.ping} ms`, 5, 10);

				// Display average latency
				this.ctx.fillText(`${Math.floor(this.averagePing)} ms (avg)`, 5, 25);

				// Display the middle separation line.
				this.ctx.fillRect(this.display.width / 2, 0, this.display.height / 60, this.display.height);

				this.ctx.stroke();
			}
		},
		updateUserInputInBackend() {
			// Ensure this is an online match.
			if (this.online) {
				// Init serialized user events.
				const data = { up: false, down: false };

				// Set the user events from the game keymap
				Object.values(this.keyMap).forEach((key) => {
					if (key.pressed && key.event === `up${this.currentPlayer}`) data.up = true;
					if (key.pressed && key.event === `down${this.currentPlayer}`) data.down = true;
				});

				// Send the user inputs to the backend.
				this.$gameSocket.volatile.emit("game:updateUserInput", data);
			}
		},
		// Event Handling
		// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#:~:text=To%20ensure%20that%20keystrokes%20go%20to%20the%20sample%2C%20click%20or%20focus%20the%20output%20box%20below%20before%20pressing%20keys.
		handleKeyPress(event: KeyboardEvent) {
			// Ensure the user is using allowed keys and isn't a spectator.
			if (!this.spectating && Object.prototype.hasOwnProperty.call(this.keyMap, event.code)) {
				const keyMap = this.keyMap;

				// Register the key as pressed.
				keyMap[event.code as HandledKeys].pressed = true;

				// Send the new user inputs to the backend.
				this.updateUserInputInBackend();
			}
		},
		handleKeyRelease(event: KeyboardEvent) {
			// Ensure the user is using allowed keys and isn't a spectator.
			if (!this.spectating && Object.prototype.hasOwnProperty.call(this.keyMap, event.code)) {
				const keyMap = this.keyMap;

				// Register the key as not pressed.
				keyMap[event.code as HandledKeys].pressed = false;

				// Send the new user inputs to the backend.
				this.updateUserInputInBackend();
			}
		},
	},
});
</script>
