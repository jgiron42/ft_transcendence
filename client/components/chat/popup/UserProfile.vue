<template>
	<client-only>
		<div class="text-white flex flex-col pl-8 pr-8 gap-4">
			<!-- displays username -->
			<div class="pseudo">{{ user.username }} - {{ userStatus.status }}</div>

			<!-- displays stat about user -->
			<div class="flex flex-row">
				<img :src="user.image_url" class="player_image" />
				<div class="flex flex-col user_info">
					<div>GAMES : {{ user.nb_game }}</div>
					<div>WINS : {{ user.nb_win }}</div>
					<div>LOSES : {{ user.nb_loss }}</div>
					<div>ELO : {{ user.elo }}</div>
				</div>
			</div>

			<!-- Game invite mode selection modal -->
			<modal height="auto" name="invite-modal" classes="rounded-md p-6 text-center h-full items-center">
				<!-- Modal title -->
				<h1>SELECT GAME MODE:</h1>

				<!-- Game mode select -->
				<SelectMenu
					id-prop="game-mode-select"
					:options="gameModes"
					:uppercase="true"
					class="text-center hover:text-gray-300"
				/>

				<!-- Invite submit button -->
				<button
					class="cursor-pointer hover:text-gray-300 hover:bg-gray-900 mt-20 w-full bg-design_blue p-2 rounded border-2 border-white font-mono uppercase"
					size="text-base"
					@click="gameInvite()"
				>
					INVITE {{ user.username }}
				</button>
			</modal>

			<!-- displays action buttons if the profile is not mine -->
			<div v-if="user.id !== me.id" class="flex flex-col font-mono">
				<div class="flex flex-row">
					<!-- Friend request button -->
					<!-- if is friend, displays remove friend button -->
					<button v-if="isFriend(relation)" class="button_profile" @click.prevent="removeFriend">
						Remove friend!
					</button>
					<!-- else if request is pending, display the cancel request button -->
					<button v-else-if="isPending(relation)" class="button_profile" @click.prevent="removeFriend">
						Cancel request!
					</button>
					<!-- else if the user is blocked, then display message saying you can't add player -->
					<button v-else-if="isBlocked" class="button_profile">You Can't add {{ user.username }}</button>
					<!-- else if the user send a request to you, display the accept friend request button -->
					<button v-else-if="isWaitingAnswer(relation)" class="button_profile" @click.prevent="acceptFriend">
						Accept friend request!
					</button>
					<!-- And FINALLYYYY: else simply display the add friend button -->
					<button v-else class="button_profile" @click.prevent="addFriend">Add friend!</button>

					<!-- displays block button if user is not blocked-->
					<button v-if="!isBlocked" class="button_profile" @click.prevent="blockUser">
						Block {{ user.username }}!
					</button>
					<!-- else, displays unblock button -->
					<button v-else class="button_profile" @click.prevent="unblockUser">
						Unblock {{ user.username }}!
					</button>

					<!-- displays Direct Message button -->
					<button class="pl-3" @click.prevent="sendDm">
						<DMLogo />
					</button>
				</div>
				<div class="flex flex-row font-mono">
					<!-- displays invite button to invite user to a game only if isOnline -->
					<button v-if="isOnline" class="button_profile" @click.prevent="$modal.show('invite-modal')">
						Invite {{ user.username }} to play a game!
					</button>
					<!-- Watch the game of the user if he's playing -->
					<button v-else-if="isInGame" class="button_profile" @click.prevent="watchGame">
						watch the current game!
					</button>
					<!-- see the game history of user -->
					<NuxtLink :to="`/history?user=${user.id}`" class="button_profile">
						{{ user.username }}'s game history!
					</NuxtLink>
				</div>
			</div>
			<!-- if the user is me, then simply add a link to my game history -->
			<div v-else>
				<NuxtLink :to="`/history?user=${user.id}`" class="button_profile font-mono">
					{{ user.username }}'s game history!
				</NuxtLink>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { Relation, RelationType } from "@/models/Relation";
import { store } from "@/store";
import { User } from "@/models/User";
import { SerializedMatch } from "~/types/matchmaking-status";

export default Vue.extend({
	name: "PopupUser",
	data() {
		return {
			// get the user from the store
			get user(): User {
				return store.popup.user;
			},

			// get my user from the store
			get me(): User {
				return store.user.me;
			},

			// get relation betweeen me and the user
			get relation(): Relation | undefined {
				// simply find a relation between me and the user
				return store.relation.relations.find(
					(relation) =>
						(relation.owner.id !== this.user.id && relation.target.id === this.user.id) ||
						(relation.owner.id === this.user.id && relation.target.id !== this.user.id),
				);
			},

			// check if the user is blocked
			get isBlocked() {
				return store.relation.relations.find(
					(r) => r.target.id === this.user.id && r.type === RelationType.BLOCK,
				);
			},

			isOnline: false,
			isInGame: false,
			userStatus: { status: "disconnected" } as Partial<{ status: string }>,
			gameModes: [] as string[],
		};
	},
	mounted() {
		// Load game modes from API.
		this.$axios
			.$get("/game/modes")
			.then((modes) => (this.gameModes = modes))
			.catch((err) =>
				this.alert.emit({ title: "INVITE", message: `Could not load game modes: ${err.toString()}` }),
			);

		// if the user of the store is undefined, then close the popup
		if (!this.user) this.$modal.hide("user_profile");

		// Get the live user status from API.
		this.$axios
			.get(`/status/${this.user.id}`)
			.then((response) => {
				// Update local user status.
				this.userStatus = response.data;

				// Update online flag
				this.isOnline = this.userStatus.status !== "game";

				// Update in game flag.
				this.isInGame = this.userStatus.status === "game";
			})
			.catch((_) => (this.isOnline = false));
	},
	methods: {
		// send friend request
		addFriend() {
			store.relation.addFriend(this.user);
		},

		// accept friend request
		acceptFriend() {
			if (this.relation) store.relation.acceptFriend(this.relation.id);
		},

		// remove friend
		removeFriend() {
			if (this.relation) {
				store.relation.removeFriend(this.relation);
			}
		},

		// block user
		blockUser() {
			store.relation.blockUser(this.user);
		},

		// unblock user
		unblockUser() {
			store.relation.unblockUser(this.user);
		},

		// check if the user is a friend of me
		isFriend(relation: Relation): boolean {
			return relation?.type === RelationType.FRIEND;
		},

		// check if I already send a friend request to the user
		isPending(relation: Relation): boolean {
			return relation?.type === RelationType.FRIEND_REQUEST && relation?.owner.id === this.me.id;
		},

		// check if the user send a friend request to me
		isWaitingAnswer(relation: Relation): boolean {
			return relation?.type === RelationType.FRIEND_REQUEST && relation?.target.id === this.me.id;
		},

		// send a direct message to the user
		sendDm() {
			store.channel.sendDm(this.user);
			this.$modal.hide("user_profile");
		},

		gameInvite() {
			// Extract the select element.
			const select = document.getElementById("game-mode-select") as HTMLSelectElement;

			// Ensure the element was found.
			if (!select) return;

			// Exract selected game mode.
			const mode = select.value;

			// Create the invite payload.
			const invite = { to: this.user.id, mode };

			// Send the invite to API.
			this.$axios
				.$post("/game/invite", invite)
				.then((_) =>
					// Show the invite was received succesfully.
					this.alert.emit({
						title: "INVITE",
						message: `Invite successfully sent to ${invite.to}.`,
						isError: false,
					}),
				)
				// Show and log the error.
				.catch((err) => this.alert.emit({ title: "INVITE", message: err.toString() }));

			// Hide the game mode selection modal.
			this.$modal.hide("invite-modal");
		},

		watchGame() {
			this.$axios.get(`/status/${this.user.id}`).then((response) => {
				// Extract the response data.
				const data = response.data;

				// Ensure requested game still exists.
				if (!data.match) {
					// Game doesn't exist anymore, update watched user' status.
					this.isInGame = false;
					return;
				}

				// Request server to add the current connection to the match's spectators.
				this.$gameSocket.emit("matchmaking:spectate", { id: data.match.id });

				// Wait for the response event.
				this.$gameSocket.on("matchmaking:spectateResponse", (match: SerializedMatch | undefined) => {
					// Ensure match still exists.
					if (match !== undefined) {
						// Mark the game as spectating, so the game will listen to the right event and not process inputs.
						this.$game.spectating = true;

						// Store the match ID, this will be used to listen to the appropriate events. (game:spectateUpdate=match.id)
						this.$game.id = match.id;

						// Format the passed game mode.
						this.$game.mode = "online:" + match.mode;

						// Redirect to the game page.
						this.$nuxt.$router.push("/game");
					} else this.alert.emit({ title: "SPECTATE", message: `Match ${match} does not exist` });
				});
			});
		},
	},
});
</script>

<style scoped>
.button_profile {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
	font-size: small;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 5px;
	margin-left: 2px;
	margin-right: 2px;
	text-align: center;
	background-color: #cecece;
	display: inline;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.player_image {
	display: grid;
	margin-left: auto;
	margin-right: auto;
	aspect-ratio: 1;
	max-width: 30%;
	width: 30%;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url("~assets/profile.png");
	border-radius: 50%;
}

.user_info {
	display: grid;
	align-content: center;
	justify-content: center;
	margin-right: auto;
	margin-left: auto;
}

.pseudo {
	display: grid;
	align-content: center;
	justify-content: center;
	margin-left: auto;
	margin-right: auto;

	@apply font-mono;
}
</style>
