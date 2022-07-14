<template>
	<div id="user-pannel" class="h-full w-full">
		<div class="flex flex-col">
			<div class="flex pb-2">
				<button
					class="btn-group btn-left"
					:class="selection === 0 ? 'btn-selected' : ''"
					@click.prevent="selection = 0"
				>
					Channel
				</button>
				<button
					v-if="checkOwner()"
					class="btn-group"
					:class="selection === 1 ? 'btn-selected' : ''"
					@click.prevent="selection = 1"
				>
					Admin
				</button>
				<button
					class="btn-group btn-right"
					:class="selection === 2 ? 'btn-selected' : ''"
					@click.prevent="selection = 2"
				>
					Social
				</button>
			</div>
			<UsersInChannel :selection="selection" />
			<AdminPanel :selection="selection" />
			<SocialPanel :selection="selection" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChannelRole } from "@/models/ChanConnection";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "SelectionUserPannel",
	props: {
		socket: {
			type: Object,
			default: () => {},
		},
		align: {
			type: String,
			default: "right",
		},
	},
	data() {
		return {
			selection: 0,
			showInvitations: true,
			get currentChannel() {
				return chatStore.currentChannel;
			},
			get me() {
				return chatStore.me;
			},
			get myRole() {
				return chatStore.roleOnCurrentChannel;
			},
		};
	},
	mounted() {
		this.$nuxt.$on("JC", () => {
			this.selection = 0;
		});
	},
	methods: {
		checkOwner(): boolean {
			return this.myRole === ChannelRole.OWNER;
		},
	},
});
</script>

<style>
#user-pannel {
	overflow: auto;
	padding: 0.5rem;
	width: 240px;
	min-width: 240px;
	background-color: #252525;
}

.btn-group {
	color: #95b5df;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	background-color: #364157;
	align-content: center;
	padding: 10px;
}

.btn-left {
	border-radius: 10px 0 0 10px;
}

.btn-right {
	border-radius: 0 10px 10px 0;
}

.btn-selected {
	background-color: #97add9;
	color: #2c3548;
}

.empty-friends {
	color: #d5d5d5;
}
</style>
