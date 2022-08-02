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

		<!-- displays Friend request -->
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
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Relation, RelationType } from "@/models/Relation";
import { store } from "@/store";

export default Vue.extend({
	name: "SocialPanel",
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

		// showBlocked is used to determine if the blocked users list is shown or not.
		showBlocked: true,

		// showFriends is used to determine if the friends list is shown or not.
		showFriends: true,
	}),
	methods: {
		// onShowInvitations is used to show or hide the invitations list.
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
		},

		// onShowBlocked is used to show or hide the blocked users list.
		onShowBlocked() {
			this.showBlocked = !this.showBlocked;
		},

		// onShowFriends is used to show or hide the friends list.
		onShowFriends() {
			this.showFriends = !this.showFriends;
		},
	},
});
</script>

<style scoped>
hr {
	border-color: #555;
}
</style>
