<template>
	<div>
		<div v-for="(connection, index) of connections" :key="index">
			<button
				v-if="type === 'admin-selection' || type === 'banned-selection'"
				:class="[isSelected(connection) ? 'selected' : '', margin ? 'pad-left' : '']"
				class="user-button cut-text btn text-left"
				@click="select(connection)"
			>
				<b>{{ connection.user.username }}</b>
			</button>
			<button
				v-else
				class="user-button cut-text btn text-left"
				:class="margin ? 'pad-left' : ''"
				@click="showUserConnection(connection)"
			>
				<b>{{ connection.user.username }}</b>
			</button>
		</div>
		<div v-for="(relation, index) of relations" :key="index">
			<div v-if="type === 'invitations'" class="flex gap-3 items-center chan-name">
				<button
					class="user-button cut-text btn text-left"
					:class="margin ? 'pad-left' : ''"
					@click="showUserRelation(relation)"
				>
					<b>{{ relation.owner.username }}</b>
				</button>
				<div class="flex gap-1">
					<button class="w-4 h-3" @click.prevent="acceptFriendRequest(relation.id)">
						<svg version="1.1" viewBox="0 0 1000 1000" height="10px">
							<g
								transform="translate(-100.000000,1200.000000) scale(0.100000,-0.100000)"
								fill="#a2a2a2"
								stroke="none"
							>
								<path
									d="M7308 7313 l-2808 -2808 -1308 1308 c-719 719 -1312 1307 -1317 1307 -13 0 -1495 -1482 -1495 -1495 0 -6 927 -937 2060 -2070 l2060 -2060 3560 3560 c1958 1958 3560 3565 3560 3570 0 13 -1482 1495 -1495 1495 -6 0 -1273 -1263 -2817 -2807z"
								/>
							</g>
						</svg>
					</button>
					<button class="w-4 h-3" @click.prevent="declineFriendRequest(relation)">
						<svg version="1.1" viewBox="0 0 1000 1000" height="10px">
							<g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
								<path
									d="M773.1,4971.1c-173.8-55.3-276.5-118.5-397-237c-294.3-294.3-361.5-754.6-162-1108.1c31.6-55.3,689.4-728.9,1762-1803.5L3686.7,109.9L1964.2-1614.6c-1120-1122-1734.3-1750.1-1760-1801.5c-81-162-108.6-302.2-98.8-495.8c7.9-158,19.8-203.5,81-333.8c122.5-254.8,347.7-444.4,616.3-515.5c209.4-57.3,497.8-19.8,681.5,84.9c55.3,29.6,750.6,711.1,1801.5,1762l1714.6,1710.6l1714.6-1710.6c1050.9-1050.9,1746.2-1732.4,1801.5-1762c347.6-199.5,815.8-130.4,1108.1,162c292.4,292.3,361.5,760.5,162,1108.1c-29.6,55.3-711.1,750.6-1762,1803.5L6313.8,109.9l1710.6,1714.6c1050.9,1050.9,1732.3,1746.2,1762,1801.5c104.7,183.7,142.2,472.1,84.9,681.5c-71.1,268.6-260.7,493.8-515.5,616.3c-254.8,120.5-564.9,114.6-829.6-17.8c-51.3-25.7-679.5-640-1801.5-1760L5000.3,1423.5L3287.7,3134.1c-1074.6,1072.6-1748.1,1730.4-1803.5,1762C1280.8,5010.6,988.4,5040.3,773.1,4971.1z"
									fill="#a2a2a2"
								/>
							</g>
						</svg>
					</button>
				</div>
			</div>
			<div v-else>
				<div class="flex gap-1">
					<button
						class="user-button cut-text btn text-left"
						:class="margin ? 'pad-left' : ''"
						@click="showUserRelation(relation)"
					>
						<b>{{ other(relation).username }}</b>
					</button>
					<button v-if="type === 'blocked'" class="w-4 h-3" @click.prevent="unblock(relation)">
						<svg version="1.1" viewBox="0 0 1000 1000" height="10px">
							<g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
								<path
									d="M773.1,4971.1c-173.8-55.3-276.5-118.5-397-237c-294.3-294.3-361.5-754.6-162-1108.1c31.6-55.3,689.4-728.9,1762-1803.5L3686.7,109.9L1964.2-1614.6c-1120-1122-1734.3-1750.1-1760-1801.5c-81-162-108.6-302.2-98.8-495.8c7.9-158,19.8-203.5,81-333.8c122.5-254.8,347.7-444.4,616.3-515.5c209.4-57.3,497.8-19.8,681.5,84.9c55.3,29.6,750.6,711.1,1801.5,1762l1714.6,1710.6l1714.6-1710.6c1050.9-1050.9,1746.2-1732.4,1801.5-1762c347.6-199.5,815.8-130.4,1108.1,162c292.4,292.3,361.5,760.5,162,1108.1c-29.6,55.3-711.1,750.6-1762,1803.5L6313.8,109.9l1710.6,1714.6c1050.9,1050.9,1732.3,1746.2,1762,1801.5c104.7,183.7,142.2,472.1,84.9,681.5c-71.1,268.6-260.7,493.8-515.5,616.3c-254.8,120.5-564.9,114.6-829.6-17.8c-51.3-25.7-679.5-640-1801.5-1760L5000.3,1423.5L3287.7,3134.1c-1074.6,1072.6-1748.1,1730.4-1803.5,1762C1280.8,5010.6,988.4,5040.3,773.1,4971.1z"
									fill="#a2a2a2"
								/>
							</g>
						</svg>
					</button>
					<button
						v-else-if="type === 'friends' && !isAlreadyOnCurrentChannel(other(relation))"
						class="w-12 h-6 invite-icon"
						@click.prevent="inviteInCurrentChannel(other(relation))"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore, userProfile } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { Relation } from "@/models/Relation";
import { User } from "@/models/User";

export default Vue.extend({
	name: "ListUsers",
	props: {
		connections: {
			type: Array,
			default: () => [],
		},
		relations: {
			type: Array,
			default: () => [],
		},
		margin: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: "",
		},
		preSelected: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			get me() {
				return chatStore.me;
			},
			rel: this.relations,
			selected: [] as ChanConnection[],
		};
	},
	mounted() {
		this.selected = this.preSelected as ChanConnection[];
	},
	methods: {
		acceptFriendRequest(id: number) {
			this.chat.relation.acceptFriend(id);
		},
		declineFriendRequest(relation: Relation) {
			this.chat.relation.removeFriend(relation);
		},
		showUserRelation(relation: Relation) {
			let user;
			if (relation.owner.id === this.me.id || relation.owner.id === relation.target.id) user = relation.target;
			else if (relation.target.id === this.me.id) user = relation.owner;
			if (user) userProfile.updateUser(user);
			this.$modal.show("user_profile");
		},
		showUserConnection(connection: ChanConnection) {
			userProfile.updateUser(connection.user);
			this.$modal.show("user_profile");
		},
		unblock(rel: Relation) {
			this.chat.relation.unblockUser(rel.target);
		},
		select(connection: ChanConnection) {
			if (this.selected.includes(connection)) {
				if (this.type === "admin-selection" && connection.role !== ChannelRole.OWNER)
					this.selected = this.selected.filter((c) => c.id !== connection.id);
				else if (this.type === "banned-selection")
					this.selected = this.selected.filter((c) => c.id !== connection.id);
			} else {
				this.selected.push(connection);
			}
			this.$emit("select", this.selected);
		},
		isSelected(connection: ChanConnection) {
			return this.selected.includes(connection);
		},
		inviteInCurrentChannel(user: User) {
			this.chat.channel.invite(chatStore.currentChannel, user);
		},
		other(relation: Relation) {
			return relation.owner.id === this.me.id ? relation.target : relation.owner;
		},
		isAlreadyOnCurrentChannel(user: User) {
			if (chatStore.chanConnections.find((c) => c.user.id === user.id)) {
				return true;
			}
			return false;
		},
	},
});
</script>

<style scoped>
.user-button {
	padding-left: 0.75em;
	color: #bdbdbd;
	font: 0.9em "Open Sans", sans-serif;
	width: 100%;
	border-radius: 5px;
}

.pad-left {
	padding-left: 28px;
}

.user-button:hover {
	background-color: #393939;
	color: #999;
}

.invite-icon {
	background-color: #8c8c8c;
	mask: url("~assets/invite.svg") no-repeat center;
}
</style>
