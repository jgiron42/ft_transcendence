<template>
	<!-- displays only if the selection === 2 -->
	<div v-if="selection === 2" id="social-panel" class="h-full flex flex-col gap-2">
		<!-- displays the title of the Social Panel -->
		<div id="title">
			<hr />
			<div class="panel-title">Social Panel</div>
			<hr />
		</div>
		<br />

		<!-- displays Friend requests -->
		<div id="invite-panel">
			<ArrowDropdown name="invitations" :click="onShowInvitations" :state="showInvitations" />
			<ListUsers
				v-if="showInvitations && invitations.length !== 0"
				:relations="invitations"
				:margin="true"
				type="invitations"
			/>
			<div v-else-if="showInvitations" class="empty-text">No invitations.</div>
		</div>
		<hr />

		<!-- displays game requests -->
		<div id="game-invite-panel">
			<ArrowDropdown name="game invitations" :click="onShowGameInvitations" :state="showInvitations" />
			<ListUsers
				v-if="showGameInvitations && gameInvitations.length"
				:relations="gameInvitations"
				:margin="true"
				type="game-invitations"
			/>
			<div v-else-if="showGameInvitations" class="empty-text">No invitations.</div>
		</div>
		<hr />

		<!-- displays friends list -->
		<div id="friends">
			<ArrowDropdown name="friends" :click="onShowFriends" :state="showFriends" />
			<ListUsers v-if="showFriends && friends.length !== 0" :relations="friends" type="friends" :margin="true" />
			<div v-else-if="showFriends" class="empty-text">No friends yet.</div>
		</div>
		<hr />

		<!-- displays blocked users -->
		<div id="block-panel">
			<ArrowDropdown name="blocked users" :click="onShowBlocked" :state="showBlocked" />
			<ListUsers v-if="showBlocked && blocked.length !== 0" :relations="blocked" type="blocked" :margin="true" />
			<div v-else-if="showBlocked" class="empty-text">No blocked users.</div>
		</div>
		<hr />

		<!-- search users -->
		<div id="search-panel">
			<ArrowDropdown name="Search user" :click="onShowSearch" :state="showSearch" />
			<SearchBar
				v-if="showSearch"
				:single="false"
				autocomplete="off"
				@update="(result) => (searchResult = result)"
			/>
			<div v-for="(user, index) in searchResult" :key="index" class="m-1">
				<UserEntry :user="user" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameInviteRelation, Relation, RelationType } from "@/models/Relation";
import { store } from "@/store";
import SearchBar from "~/components/SearchBar.vue";
import UserEntry from "~/components/chat/users/UserEntry.vue";

export default Vue.extend({
	name: "SocialPanel",
	components: { UserEntry, SearchBar },
	props: {
		/*
		 * selection is used to determine if the social panel is shown or not.
		 * 0 = Users panel, 1 = Admin panel, 2 = Social panel.
		 */
		selection: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		// get friend requests from the store
		get invitations(): Relation[] {
			return (
				store.relation.relations
					// ensure to filter friend requests to show only the ones I am targeted at
					.filter((r) => r.type === RelationType.FRIEND_REQUEST && r.owner.id !== store.user.me.id)
					// filter the relation to hide the blocked users
					.filter(
						(r) =>
							!store.relation.relations.find(
								(r2) => r2.type === RelationType.BLOCK && r2.target.id === r.owner.id,
							),
					)
			);
		},
		// get friend requests from the store
		gameInvitations: [] as GameInviteRelation[],

		// get friends from the store
		get friends(): Relation[] {
			return store.relation.relations.filter((r) => r.type === RelationType.FRIEND);
		},

		// get blocked users from the store
		get blocked(): Relation[] {
			return store.relation.relations.filter((r) => r.type === RelationType.BLOCK);
		},

		// showInvitations is used to determine if the invitations list is shown or not.
		showInvitations: true,

		// showGameInvitations is used to determine if game the invitations list is shown or not.
		showGameInvitations: true,

		// showBlocked is used to determine if the blocked users list is shown or not.
		showBlocked: true,

		// showFriends is used to determine if the friends list is shown or not.
		showFriends: true,

		showSearch: true,

		updateGameInviteInterval: {} as NodeJS.Timeout,

		searchResult: "",
	}),
	mounted() {
		this.updateGameInvites();
		this.$on("social:updateGameInvites", this.updateGameInvites);
		this.updateGameInviteInterval = setInterval(this.updateGameInvites, 5000);
		this.$gameSocket.on("game:updateStatus", () => this.$nuxt.$router.push("/matchmaking"));
	},
	beforeDestroy() {
		this.$off("social:updateGameInvites");
		this.$gameSocket.clearMatchingEvents("game");
		if (this.updateGameInviteInterval) clearInterval(this.updateGameInviteInterval);
	},
	methods: {
		// onShowInvitations is used to show or hide the invitations list.
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
		},

		// onShowGameInvitations is used to show or hide the game invitations list.
		onShowGameInvitations() {
			this.showGameInvitations = !this.showGameInvitations;
		},

		// onShowBlocked is used to show or hide the blocked users list.
		onShowBlocked() {
			this.showBlocked = !this.showBlocked;
		},

		// onShowFriends is used to show or hide the friends list.
		onShowFriends() {
			this.showFriends = !this.showFriends;
		},

		// onShowFriends is used to show or hide the friends list.
		onShowSearch() {
			this.showSearch = !this.showSearch;
		},

		updateGameInvites() {
			// Game invite type
			type GameInvite = { id: string; mode: string; from: string };

			// Shorthand type for (invitationID, invitationData) returned from API call.
			type InvitationList = [string, GameInvite][];

			// Get current logged in user.
			this.$user
				.getUser()
				.then((user) =>
					// Get current user status.
					this.$axios
						.$get(`/status/${user.id}`)
						.then((status: { invitations: InvitationList; status: string }) => {
							// Convert invitations to Relation-like array.
							this.gameInvitations = status.invitations.flatMap(
								([id, invite]): GameInviteRelation => ({
									id,
									owner: { id: invite.from, username: invite.from },
									target: user,
									mode: invite.mode,
									type: RelationType.GAME,
									created_at: new Date(),
								}),
							);

							// Open game window when user has been matched in a game.
							// (e.g.: Their game invite has been accepted)
							if (status.status === "game") this.$nuxt.$router.push("/matchmaking");
						}),
				)
				.catch((err) =>
					// Log and display the error.
					this.alert.emit({ title: "INVITES", message: `Could not fetch game invites: ${err.toString()}` }),
				);
		},
	},
});
</script>

<style scoped>
hr {
	border-color: #555;
}
</style>
