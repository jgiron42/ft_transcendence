<template>
	<div id="user-pannel" class="h-full w-full">
		<div class="flex flex-col">
			<div class="flex pb-2">
				<button
					class="btn-group left-btn"
					:class="selection === 0 ? 'selected-option' : ''"
					@click.prevent="selection = 0"
				>
					User
				</button>
				<button
					v-if="checkOwner()"
					class="btn-group"
					:class="selection === 1 ? 'selected-option' : ''"
					@click.prevent="selection = 1"
				>
					Admin
				</button>
				<button
					class="btn-group right-btn"
					:class="selection === 2 ? 'selected-option' : ''"
					@click.prevent="selection = 2"
				>
					Friends
				</button>
			</div>
			<UsersInChannel v-if="selection === 0" :socket="socket" />
			<AdminPanel v-if="selection === 1" />
			<div v-if="selection === 2">prout</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "@/models/User";
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
			get currentChannel() {
				return chatStore.currentChannel;
			},
			get me() {
				return chatStore.me;
			},
		};
	},
	methods: {
		checkOwner(): boolean {
			if (this.currentChannel.owner === undefined) return false;
			return this.me.id === (this.currentChannel.owner as User).id;
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

.left-btn {
	border-radius: 10px 0 0 10px;
}

.right-btn {
	border-radius: 0 10px 10px 0;
}

.selected-option {
	background-color: #97add9;
	color: #2c3548;
}
</style>
