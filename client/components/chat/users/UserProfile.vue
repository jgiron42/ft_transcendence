<template>
	<div class="text-white flex flex-col pl-8 pr-8 gap-4">
		<div class="flex flex-col">pseudo: {{ user.username }}</div>
		<div class="flex flex-col">nb games : {{ user.nb_game }}</div>
		<div class="flex flex-col">nb wins : {{ user.nb_win }}</div>
		<div class="flex flex-col">ratio : {{ user.nb_wins / user.nb_game }}</div>
		<div v-if="user.id !== me.id" class="flex flex-row">
			<button v-if="isFriend(relation)" class="button_profile" @click.prevent="removeFriend">
				Remove friend!
			</button>
			<button v-else-if="isPending(relation)" class="button_profile" @click.prevent="cancel_request">
				Cancel request!
			</button>
			<button v-else-if="isWaitingAnswer(relation)" class="button_profile" @click.prevent="acceptFriend">
				Accept friend request!
			</button>
			<button v-else class="button_profile" @click.prevent="addFriend">Add friend!</button>
			<button class="button_profile" @click.prevent="blockUser">block {{ pseudo }}</button>
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
			pseudo: "pseudo test",
			nb_game: 3,
			nb_win: 0,
			nb_lose: 3,
			ratio: 0,
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
		};
	},
	methods: {
		addFriend() {
			this.chat.addFriend(this.user);
		},
		acceptFriend() {
			if (this.relation) this.chat.acceptFriend(this.relation.id);
		},
		removeFriend() {
			if (this.relation) {
				this.chat.removeFriend(this.relation);
			}
		},
		blockUser() {
			console.log("Block User");
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
