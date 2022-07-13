<template>
	<div v-if="selection == 2">
		<ArrowDropdown name="invitations" :click="onShowInvitations" :state="showInvitations" />
		<ListUsers
			v-if="showInvitations && invitations.length !== 0"
			:relations="invitations"
			:margin="true"
			type="invitations"
		/>
		<div v-else-if="showInvitations" class="empty-text">No invitations.</div>
		<ArrowDropdown name="blocked users" :click="onShowBlocked" :state="showBlocked" />
		<ListUsers v-if="showBlocked && blocked.length !== 0" :relations="blocked" type="blocked" :margin="true" />
		<div v-else-if="showBlocked" class="empty-text">No blocked users.</div>
		<ListUsers v-if="friends.length !== 0" :relations="friends" type="friends" />
		<div v-else class="!pl-0 empty-friends">No friends yet.</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Relation, RelationType } from "@/models/Relation";
import { chatStore } from "@/store";

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
				for (const relation of chatStore.relations) {
					if (relation.type === RelationType.FRIEND) {
						ret.push(relation);
					}
				}
				return ret;
			},
			get invitations() {
				const ret = [] as Relation[];
				for (const relation of chatStore.relations) {
					if (
						relation.target.id === chatStore.me.id &&
						relation.type === RelationType.FRIEND_REQUEST &&
						!chatStore.blockedUsers.find((r) => r.target.id === relation.owner.id)
					) {
						ret.push(relation);
					}
				}
				return ret;
			},
			get blocked() {
				return chatStore.blockedUsers;
			},
			showInvitations: true,
			showBlocked: true,
		};
	},
	methods: {
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
		},
		onShowBlocked() {
			this.showBlocked = !this.showBlocked;
		},
	},
});
</script>
