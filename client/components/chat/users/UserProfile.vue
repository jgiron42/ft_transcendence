<template>
	<div class="text-white flex flex-col pl-8 pr-8 gap-4">
		<div>pseudo: {{ user.username }}</div>
		<div>nb games : {{ user.nb_game }}</div>
		<div>nb wins : {{ user.nb_win }}</div>
		<div>ratio : {{ ratio }}</div>
		<div v-if="user.id !== me.id" class="flex flex-row">
			<button v-if="isFriend(relation)" class="button_profile" @click.prevent="removeFriend">
				Remove friend!
			</button>
			<button v-else-if="isPending(relation)" class="button_profile" @click.prevent="removeFriend">
				Cancel request!
			</button>
			<button v-else-if="isBlocked" class="button_profile">You Can't add {{ user.username }}</button>
			<button v-else-if="isWaitingAnswer(relation)" class="button_profile" @click.prevent="acceptFriend">
				Accept friend request!
			</button>
			<button v-else class="button_profile" @click.prevent="addFriend">Add friend!</button>
			<button v-if="!isBlocked" class="button_profile" @click.prevent="blockUser">
				Block {{ user.username }}!
			</button>
			<button v-else class="button_profile" @click.prevent="unblockUser">Unblock {{ user.username }}!</button>
			<button class="pl-3" @click.prevent="sendDm">
				<svg version="1.1" viewBox="0 0 200.000000 200.000000" height="30px">
					<g
						transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
						fill="#d5d5d5"
						stroke="none"
					>
						<path
							d="M285 1661 c-48 -12 -75 -30 -95 -64 -19 -31 -20 -55 -20 -576 0 -535 0 -545 21 -589 13 -26 38 -54 62 -70 l41 -27 353 -3 353 -3 0 86 0 85 -335 0 -335 0 0 430 c0 237 3 430 8 430 4 0 149 -95 322 -210 200 -133 324 -210 340 -210 16 0 140 77 340 210 173 115 318 210 323 210 4 0 7 -81 7 -180 l0 -180 80 0 80 0 0 283 c0 262 -1 284 -20 314 -10 18 -34 40 -52 50 -31 17 -80 18 -738 20 -388 1 -718 -2 -735 -6z m1300 -170 c-6 -5 -139 -95 -297 -200 l-288 -191 -287 191 c-159 105 -292 195 -297 200 -6 5 243 9 584 9 341 0 590 -4 585 -9z"
						/>
						<path
							d="M1186 814 c-13 -13 -16 -46 -16 -205 l0 -189 80 0 80 0 0 77 0 78 133 -132 132 -132 58 53 57 53 -125 121 c-69 67 -125 124 -125 127 0 3 27 5 60 5 l60 0 0 80 0 80 -189 0 c-159 0 -192 -3 -205 -16z"
						/>
					</g>
				</svg>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Relation, RelationType } from "@/models/Relation";
import { userProfile, chatStore } from "@/store";

export default Vue.extend({
	name: "UserProfile",
	data() {
		return {
			get user() {
				return userProfile.user;
			},
			get me() {
				return chatStore.me;
			},
			get relation() {
				for (const relation of chatStore.relations) {
					if (
						(relation.owner.id !== this.user.id && relation.target.id === this.user.id) ||
						(relation.owner.id === this.user.id && relation.target.id !== this.user.id)
					) {
						return relation;
					}
				}
				return undefined;
			},
			get isBlocked() {
				return chatStore.blockedUsers.find((r) => r.target.id === this.user.id);
			},
			get ratio(): number {
				return this.user.nb_win / this.user.nb_game;
			},
		};
	},
	methods: {
		addFriend() {
			this.chat.relation.addFriend(this.user);
		},
		acceptFriend() {
			if (this.relation) this.chat.relation.acceptFriend(this.relation.id);
		},
		removeFriend() {
			if (this.relation) {
				this.chat.relation.removeFriend(this.relation);
			}
		},
		blockUser() {
			this.chat.relation.blockUser(this.user);
		},
		unblockUser() {
			this.chat.relation.unblockUser(this.user);
		},
		isFriend(relation: Relation) {
			return relation?.type === RelationType.FRIEND;
		},
		isPending(relation: Relation) {
			return relation?.type === RelationType.FRIEND_REQUEST && relation?.owner.id === this.me.id;
		},
		isWaitingAnswer(relation: Relation) {
			return relation?.type === RelationType.FRIEND_REQUEST && relation?.target.id === this.me.id;
		},
		sendDm() {
			if (this.chat.channel.sendDm(this.user)) {
				this.$modal.hide("user_profile");
			}
		},
	},
});
</script>

<style scoped>
.button_profile {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
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
</style>
