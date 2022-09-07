<template>
	<div
		v-if="gameModes.length !== 0"
		class="w-full h-full flex flex-col items-center border-4 border-design_white bg-design_black overflow-scroll rounded-md no-scrollbar"
	>
		<!-- Title -->
		<div
			id="title"
			class="text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center">MATCHMAKING</div>
		</div>

		<!-- Content -->
		<div id="content" class="text-design_white w-full h-full overflow-y-scroll no-scrollbar">
			<br />
			<div class="flex flex-col w-full items-center justify-around">
				<!-- User profile picture -->
				<div id="profile-picture" class="flex h-1/3 w-1/3 items-center justify-center">
					<img v-if="userPictureSrc" :src="userPictureSrc" class="rounded-full w-24 h-24" />
					<img v-else src="~/assets/profile.png" class="rounded-full w-24 h-24" />
				</div>
			</div>
			<h3>{{ user.id }}</h3>

			<br />

			<!-- Player statistics -->
			<div class="flex flex-col">
				<p>Total played games : {{ user.nb_game }}</p>
				<p>Total victories : {{ user.nb_win }}</p>
				<p>Total losses : {{ user.nb_loss }}</p>
				<p>ELO rating: {{ user.elo }}</p>
			</div>

			<!-- Spectatable games list -->
			<div class="w-full flex flex-col items-center content-center justify-center mt-4 max-h-52 h-auto">
				SPECTATE GAMES:
				<div
					class="flex flex-col overflow-y-scroll overflow-x-hidden w-1/2 bg-black border-white border-2 h-auto"
				>
					<div v-if="matchList.length">
						<div
							v-for="match in matchList"
							:key="match.id"
							class="border-gray-400 border-2 hover:text-gray-400 cursor-pointer p-2 font-mono"
							@click="spectateMatch(match.id)"
						>
							{{ match.p1 }} / {{ match.p2 }}
						</div>
					</div>
					<div v-else>No games available</div>
				</div>
			</div>
		</div>

		<!-- Launch game buttons button -->
		<div
			id="inputs"
			:class="`text-design_white flex 
				flex-col
			 w-full bg-design_blue border-t-4 border-white text-center p-2 justify-around`"
		>
			<div class="flex flex-col items-center">
				<p class="text-md">MODE:</p>
				<SelectMenu
					id-prop="matchmaking-mode-select"
					:options="gameModes"
					:uppercase="true"
					class="text-center hover:text-gray-300"
				/>
			</div>
			<div class="flex flex-col items-center">
				<p class="text-md">OPPONENT:</p>
				<SelectMenu
					id-prop="matchmaking-type-select"
					:options="Object.values(opponentTypes)"
					:uppercase="true"
					class="text-center hover:text-gray-300"
				/>
			</div>
		</div>

		<!-- Button to launch/search a game -->
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<button class="w-full text-center hover:text-gray-300" @click="handleClick">
				{{ buttonContent }}
			</button>
		</div>
	</div>

	<!-- Spinny loader to wait for user's data to be received -->
	<Loader v-else class="mx-auto animate-spin h-full" />
</template>
<script lang="ts">
import Vue from "vue";
import { User } from "~/models/User";
import type { SerializedMatch, UserMatchmakingStatus } from "@/types/matchmaking-status";
import type SocketHubInterface from "~/types/socker-hub";

export default Vue.extend({
	name: "Matchmaking",
	data: () => ({
		waiting: false,
		buttonContent: "FIND A MATCH",
		searchElaspedTime: 0,
		usersAvailable: 0,
		matchmakingSocket: {} as SocketHubInterface,
		selectedPool: "",
		authenticated: false,
		user: new User(),
		connectedPool: [""],
		matchmakingPools: {} as Record<string, string[]>,
		selectedType: "online",
		opponentTypes: {
			online: "ONLINE PLAYER",
			local: "LOCAL PLAYER",
			bot: "LOCAL BOT",
			onlineBot: "ONLINE BOT",
			demo: "NO PLAYER (DEMO)",
		},
		gameModes: [] as string[],
		matchList: [] as SerializedMatch[],
		userPictureSrc: "",
		timeOffset: 0,
	}),
	mounted() {
		// Init websocket connection
		this.initConnection();

		// Launch first update to init values
		this.updateMatchmakingStatus();
		// Run an update every second
		// ESLint may find the wrong NodeJS def instead of the DOM lib def
		// https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
		window.setInterval(this.updateMatchmakingStatus, 1000);

		// Add listeners for inputs changes.
		this.$nuxt.$on("matchmaking-mode-select-change", (data: string) => (this.selectedPool = data));
		this.$nuxt.$on("matchmaking-type-select-change", (data: string) => {
			this.selectedType = Object.keys(this.opponentTypes).find(
				(key: string) => this.opponentTypes[key as "online" | "local" | "bot" | "demo"] === data,
			) as string;

			// Display "FIND A MATCH" only when game mode requires actual matchmaking.
			this.buttonContent =
				this.selectedType !== "online" ? "START A GAME" : `FIND A MATCH (${this.usersAvailable} users)`;
		});
	},
	beforeDestroy() {
		this.matchmakingSocket.clearMatchingEvents("matchmaking");
	},
	methods: {
		syncTime() {
			// the NTP algorithm
			// t0 is the client's timestamp of the request packet transmission,
			// t1 is the server's timestamp of the request packet reception,
			// t2 is the server's timestamp of the response packet transmission and
			// t3 is the client's timestamp of the response packet reception.
			// timeoffset is the offset between server and local clock.

			const t0 = Date.now();
			this.$axios
				.get("/ntp")
				.then((response) => {
					const serverTime = response.data as number;
					const [t1, t2, t3] = [serverTime, serverTime, Date.now()];

					this.timeOffset = (t1 - t0 + (t2 - t3)) / 2;
				})
				.catch((err) =>
					this.$nuxt.alert.emit({ title: "MATCHMAKING", message: `Could not sync time: ${err.toString()}` }),
				);
		},
		initConnection() {
			// Instantiate websocket
			this.matchmakingSocket = this.$nuxt.$gameSocket;

			// Subscribe to user updates.
			this.matchmakingSocket.on("matchmaking:updateStatus", this.updateStatus);
			this.syncTime();
		},
		updateStatus(status: UserMatchmakingStatus) {
			// Get updated user
			this.user = status.user;

			// Get user picture from API
			this.userPictureSrc = this.$nuxt.$getPictureSrc(this.user.id);

			// Display content available to authenticated users
			this.authenticated = true;

			// Display updated ongoing match list.
			this.matchList = status.matchList;

			// Update content depending on user matchmaking status
			switch (status.status) {
				case "connected":
					// User is not currently searching for a game
					this.waiting = false;
					break;
				case "matchmaking":
					// User is searching for a game
					this.waiting = true;

					// Update local search duration
					this.searchElaspedTime = Math.floor((Date.now() - status.searchDate + this.timeOffset) / 1000);
					break;
				case "game":
					// Clean matchmaking listeners
					this.$gameSocket.clearMatchingEvents("matchmaking");

					// Redirect to game page
					window.$nuxt.$router.push("/versus");
					return;
			}
			// Update local selection
			this.selectedPool = this.selectedPool || status.availableGameModes[0];

			// Update matchmaking matchmakingPools
			this.matchmakingPools = status.matchMakingPools;

			// Update connected user list
			this.connectedPool = status.connectedPool;

			// Get number of connected users
			this.usersAvailable = status.connectedPool.length;

			// Get list of available game modes
			this.gameModes = status.availableGameModes;

			// Force content re-render (filthy)
			this.$nextTick(() => {
				this.authenticated = false;
				this.$nextTick(() => {
					this.authenticated = true;
				});
			});
		},
		updateMatchmakingStatus() {
			if (this.selectedType !== "online") return;
			if (this.waiting) {
				// Increase time counter
				this.searchElaspedTime += 1;

				// Update displayed content
				this.buttonContent = `SEARCHING... (${this.searchElaspedTime})`;
			} else this.buttonContent = `FIND A MATCH (${this.usersAvailable} users)`;
		},
		handleClick() {
			// https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
			// Scrap selected value
			const selector = document.getElementById("matchmaking-mode-select") as HTMLSelectElement;
			const selectedGameMode = selector.options[selector.selectedIndex].text;

			// Reset game parameters.
			this.$game.reset();

			// Request server to create a match with you against a bot
			if (this.selectedType === "onlineBot") {
				this.matchBot();
				return;
			}

			// Format and the store the game mode before redirecting to game component.
			if (this.selectedType !== "online") {
				this.$nuxt.$game.mode = `${this.selectedType}:${selectedGameMode}`;
				this.$nuxt.$router.push("/game");
				return;
			}

			// Reset values
			this.searchElaspedTime = 0;

			// Cancel or start game search.
			this.matchmakingSocket.emit(this.waiting ? "matchmaking:cancelSearchGame" : "matchmaking:searchGame", {
				mode: selectedGameMode,
			});

			// Run the correct update.
			this.updateMatchmakingStatus();
		},
		matchBot() {
			// Ask server to match self with a bot
			this.matchmakingSocket.emit("matchmaking:matchBot", { mode: this.selectedPool });
		},
		spectateMatch(match: string) {
			// Reset the game parameters.
			this.$game.reset();

			// Request server to add the current connection to the match's spectators.
			this.matchmakingSocket.emit("matchmaking:spectate", { id: match });

			// Wait for the response event.
			this.matchmakingSocket.on("matchmaking:spectateResponse", (match: SerializedMatch | undefined) => {
				// Ensure match still exists.
				if (match !== undefined) {
					// Mark the game as spectating, so the game will listen to the right event and not process inputs.
					this.$game.spectating = true;

					// Store the match ID, this will be used to listen to the appropriate events. (game:spectateUpdate=match.id)
					this.$game.id = match.id;

					// Format the passed game mode.
					this.$game.mode = "online:" + match.mode;

					// Store players ID.
					this.$game.p1 = match.p1;
					this.$game.p2 = match.p2;

					// Redirect to the game page.
					this.matchmakingSocket.clearMatchingEvents("matchmaking");
					this.$nuxt.$router.push("/game");
				} else this.alert.emit({ title: "SPECTATE", message: `Match ${match} does not exist` });
			});
		},
	},
});
</script>
