<template>
	<client-only>
		<div class="text-white flex flex-col pl-8 pr-8 gap-4">
			<!-- displays username -->
			<div class="pseudo">{{ user.username }}</div>

			<!-- displays stat about user -->
			<div class="flex flex-row">
				<img :src="user.image_url" class="player_image" />
				<div class="flex flex-col user_info">
					<div>nb games : {{ user.nb_game }}</div>
					<div>nb wins : {{ user.nb_win }}</div>
					<div>nb loses : {{ loses }}</div>
					<div>ratio : {{ ratio }}</div>
				</div>
			</div>

			<!-- displays action buttons if the profile is not mine -->
			<div v-if="user.id !== me.id" class="flex flex-col">
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
				<div class="flex flex-row">
					<!-- displays invite button to invite user to a game only if isOnline -->
					<button v-if="isOnline" class="button_profile" @click.prevent="gameInvite">
						Invite {{ user.username }} to play a game!
					</button>
					<!-- Watch the game of the user if he's playing -->
					<button v-else-if="isInGame" class="button_profile" @click.prevent="watchGame">
						watch the current game!
					</button>
					<!-- see the game history of user -->
					<button class="button_profile" @click.prevent="seeGameHistory">
						{{ user.username }}'s game history!
					</button>
				</div>
			</div>
			<!-- if the user is me, then simply add a link to my game history -->
			<div v-else>
				<button class="button_profile" @click.prevent="seeGameHistory">
					{{ user.username }}'s game history!
				</button>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { Relation, RelationType } from "@/models/Relation";
import { store } from "@/store";
import { User } from "@/models/User";

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

			// get the ratio of the user
			get ratio(): number {
				return this.user.nb_win / this.user.nb_game;
			},

			// get if user is online or not
			get isOnline(): boolean {
				// TODO: get the status of the player and check if === ONLINE
				return true;
			},

			// get if user is in game or not
			get isInGame(): boolean {
				// TODO: get the status of the player and check if === IN_GAME
				return false;
			},
		};
	},
	mounted() {
		// if the user of the store is undefined, then close the popup
		if (!this.user) this.$modal.hide("user_profile");
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
			// TODO: send a game invite to the user
		},

		watchGame() {
			// TODO: watch the game of the user
		},

		seeGameHistory() {
			// TODO: redirect to the game history of the user
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
}
</style>
