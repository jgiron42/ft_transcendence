<template>
	<div v-if="selection == 2" id="social-panel" class="h-full flex flex-col gap-2">
		<div id="title">
			<hr />
			<div class="panel-title">Social Panel</div>
			<hr />
		</div>
		<br />
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
		<div id="friends">
			<ArrowDropdown name="friends" :click="onShowFriends" :state="showFriends" />
			<ListUsers v-if="showFriends && friends.length !== 0" :relations="friends" type="friends" :margin="true" />
			<div v-else-if="showFriends" class="empty-text">No friends yet.</div>
		</div>
		<hr />
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
		selection: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			get friends() {
				const ret = [] as Relation[];
				for (const relation of store.relation.relations) {
					if (relation.type === RelationType.FRIEND) {
						ret.push(relation);
					}
				}
				return ret;
			},
			get invitations() {
				const ret = [] as Relation[];
				for (const relation of store.relation.relations) {
					if (
						relation.target.id === store.chat.me.id &&
						relation.type === RelationType.FRIEND_REQUEST &&
						!store.chat.blockedUsers.find((r) => r.target.id === relation.owner.id)
					) {
						ret.push(relation);
					}
				}
				return ret;
			},
			get blocked() {
				return store.chat.blockedUsers;
			},
			showInvitations: true,
			showBlocked: true,
			showFriends: true,
		};
	},
	methods: {
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
		},
		onShowBlocked() {
			this.showBlocked = !this.showBlocked;
		},
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
