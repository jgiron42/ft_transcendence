<template>
	<div>
		<div v-for="(invitation, index) of invitations" :key="index">
			<div class="text-left chan-name">
				<b>{{ invitation.invited_by.username }}</b>
				invited you to join the channel
				<b>{{ invitation.channel.name }}</b>
				<div class="flex gap-1 mr-0 ml-auto" style="width: fit-content">
					<button class="btn" @click="acceptRequest(invitation)">accept</button>
					<button class="btn" @click="declineRequest(invitation)">decline</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChanInvitation } from "@/models/ChanInvitation";

export default Vue.extend({
	name: "ListChanInvitations",
	props: {
		invitations: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		acceptRequest(invitation: ChanInvitation) {
			this.chat.chanInvitation.acceptChanInvitation(invitation);
		},
		declineRequest(invitation: ChanInvitation) {
			this.chat.chanInvitation.declineChanInvitation(invitation);
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
