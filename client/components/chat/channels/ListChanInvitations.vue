<template>
	<client-only>
		<div>
			<!-- iterate through list of invitations -->
			<div v-for="(invitation, index) of invitations" :key="index">
				<div class="text-left chan-name">
					<!-- display: "$user invited you to join the channel $channel" -->
					<b>{{ invitation.invited_by.username }}</b>
					invited you to join the channel
					<b>{{ invitation.channel.name }}</b>

					<!-- display accept and decline button -->
					<div class="flex gap-1 mr-0 ml-auto" style="width: fit-content">
						<button class="btn" @click="acceptRequest(invitation)">accept</button>
						<button class="btn" @click="declineRequest(invitation)">decline</button>
					</div>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { ChanInvitation } from "@/models/ChanInvitation";
import { store } from "@/store";

export default Vue.extend({
	name: "ListChanInvitations",
	props: {
		// list of invitations
		invitations: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		// methods to accept channel invation
		acceptRequest(invitation: ChanInvitation) {
			store.invitation.acceptInvitation(invitation);
		},
		// methods to decline channel invation
		declineRequest(invitation: ChanInvitation) {
			store.invitation.declineInvitation(invitation);
		},
	},
});
</script>

<style scoped>
.chan-name {
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 3px;
	border-radius: 5px;
	margin-bottom: 5px;
	background-color: #393939;
	color: #999;
}

.btn {
	font: 0.75em "Open Sans", sans-serif;
	border-radius: 5px;
	color: #222;
	font-weight: bold;
	background-color: #666;
	margin-left: auto;
	margin-right: 0;
	display: block;
	padding: 0.25em 0.5em;
}
</style>
