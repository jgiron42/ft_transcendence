<template>
	<div id="user-pannel" class="h-full w-full">
		<div class="flex flex-col">
			<div class="flex pb-2">
				<button
					class="btn-group btn-left"
					:class="selection === 0 ? 'btn-selected' : ''"
					@click.prevent="selection = 0"
				>
					User
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
					@click.prevent="
						selection = 2;
						showInvitations = false;
					"
				>
					Friends
				</button>
			</div>
			<UsersInChannel v-if="selection === 0" :socket="socket" />
			<AdminPanel v-if="selection === 1" />
			<ArrowDropdown v-if="selection === 2" name="invitations" :click="onShowInvitations" />
			<ListUsers
				v-if="selection === 2 && showInvitations && invitations.length !== 0"
				:relations="invitations"
				:margin="true"
				type="invitations"
			/>
			<div v-else-if="selection === 2 && showInvitations" class="empty-text">No invitations.</div>
			<ListUsers v-if="selection === 2 && friends.length !== 0" :relations="friends" type="friends" />
			<div v-else-if="selection === 2" class="!pl-0 empty-friends">No friends yet.</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChannelRole } from "@/models/ChanConnection";
import { chatStore } from "@/store";
import { Relation, RelationType } from "@/models/Relation";

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
			showInvitations: false,
			get currentChannel() {
				return chatStore.currentChannel;
			},
			get me() {
				return chatStore.me;
			},
			get myRole() {
				return chatStore.roleOnCurrentChannel;
			},
			get invitations() {
				const ret = [] as Relation[];
				for (const relation of chatStore.relations) {
					if (relation.target.id === chatStore.me.id && relation.type === RelationType.FRIEND_REQUEST) {
						ret.push(relation);
					}
				}
				return ret;
			},
			get friends() {
				const ret = [] as Relation[];
				for (const relation of chatStore.relations) {
					if (relation.type === RelationType.FRIEND) {
						ret.push(relation);
					}
				}
				return ret;
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
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
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
