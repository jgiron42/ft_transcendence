<template>
	<div>
		<!-- iterate through connections -->
		<div v-for="(connection, index) of connections" :key="index">
			<!-- if type of list is a selection -->
			<!-- bind the click event to the select method -->
			<!-- and check if the connectino is selected to dynamically add class 'selected' -->
			<button
				v-if="
					type === 'admin-selection' ||
					type === 'banned-selection' ||
					type === 'muted-selection' ||
					type === 'kick-selection'
				"
				:class="[isSelected(connection) ? 'selected' : '', margin ? 'pad-left' : '']"
				class="user-button cut-text btn text-left"
				@click="select(connection)"
			>
				<b>{{ connection.user.username }}</b>
			</button>

			<!-- else, simply display the username and bind @click to showUserConnection method -->
			<button
				v-else
				class="user-button cut-text btn text-left"
				:class="margin ? 'pad-left' : ''"
				@click="showUserConnection(connection)"
			>
				<b>{{ connection.user.username }}</b>
			</button>
		</div>
		<!-- iterate through relations  -->
		<div v-for="(relation, index) of relations" :key="index">
			<!-- if the type of list is friend request -->
			<div v-if="type === 'invitations'" class="flex gap-3 items-center chan-name">
				<!-- display the username of the request's owner -->
				<button
					class="user-button cut-text btn text-left"
					:class="margin ? 'pad-left' : ''"
					@click="showUserRelation(relation)"
				>
					<b>{{ relation.owner.username }}</b>
				</button>

				<!-- display accept or decline logo -->
				<div class="flex gap-1">
					<button class="w-4 h-3" @click.prevent="acceptFriendRequest(relation.id)">
						<VButtonLogo />
					</button>
					<button class="w-4 h-3" @click.prevent="declineFriendRequest(relation)">
						<CrossLogo />
					</button>
				</div>
			</div>

			<!-- Display game invitations -->
			<div v-else-if="type === 'game-invitations'" class="flex gap-3 items-center chan-name">
				<!-- display the username of the request's owner -->
				<button
					class="user-button cut-text btn text-left"
					:class="margin ? 'pad-left' : ''"
					@click="showUserRelation(relation)"
				>
					<b>{{ relation.owner.username }}@{{ relation.mode }}</b>
				</button>

				<!-- display accept or decline logo -->
				<div class="flex gap-1">
					<button class="w-4 h-3" @click.prevent="acceptGameInvite(relation.id)">
						<VButtonLogo />
					</button>
					<button class="w-4 h-3" @click.prevent="declineGameInvite(relation.id)">
						<CrossLogo />
					</button>
				</div>
			</div>

			<!-- else, simply display the username and bind @click to showUserRelation method -->
			<div v-else>
				<div class="flex gap-1">
					<button
						class="user-button cut-text btn text-left"
						:class="margin ? 'pad-left' : ''"
						@click="showUserRelation(relation)"
					>
						<b>{{ other(relation).username }}</b>
					</button>

					<!-- if it's a list of blocked users, then add cross logo to unblock user -->
					<button v-if="type === 'blocked'" class="w-4 h-3" @click.prevent="unblock(relation)">
						<CrossLogo />
					</button>

					<!-- else, if it's a list of friends, add a button to invite user in the current channel -->
					<button
						v-else-if="
							type === 'friends' &&
							!isAlreadyOnCurrentChannel(other(relation)) &&
							currentChannel.type !== ChannelType.DM
						"
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
import _ from "lodash";
import { store } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { Relation } from "@/models/Relation";
import { User } from "@/models/User";
import { Channel, ChannelType } from "@/models/Channel";

export default Vue.extend({
	name: "ListUsers",
	props: {
		// connections to display
		connections: {
			type: Array,
			default: () => [],
		},

		// relations to display
		relations: {
			type: Array,
			default: () => [],
		},

		// if margin true, add a tab to the left of the user name
		margin: {
			type: Boolean,
			default: false,
		},

		// the type of list, can be 'admin-selection', 'banned-selection', 'muted-selection', 'invitations', 'friends', 'blocked'
		type: {
			type: String,
			default: "",
		},

		// the pre-selection when the list is a selection (e.g.: for banned or admin edition)
		preSelected: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			// return current user from store
			get me(): User {
				return store.user.me;
			},

			// selected connection when the list is a selection
			selected: [] as ChanConnection[],

			// get the current channel connections
			get currentConnections(): ChanConnection[] {
				return store.connection.chanConnectionTracker && Array.from(store.connection.chanConnections.values());
			},

			// get the current channel
			get currentChannel(): Channel {
				return store.channel.currentConnection.channel;
			},

			// get the ChannelType enum in order to use it in the template
			get ChannelType(): typeof ChannelType {
				return ChannelType;
			},
		};
	},
	mounted() {
		// if the list is a selection, preselect the connections
		if (this.type === "banned-selection" || this.type === "admin-selection") {
			// get the pre-selection in selected
			this.selected = this.preSelected as ChanConnection[];

			// emit the selection event, (ensuring no modification on the selection will be done if user don't select / unselect any connection)
			this.$emit("select", this.selected);
		}

		// Replace method by debounced function to avoid same invite being submitted multiple time at once.
		this.acceptGameInvite = _.debounce((id: string) => {
			this.$axios
				.$put(`/game/invite/${id}`)
				.then(() => this.$router.push("/matchmaking"))
				.catch((err) =>
					this.alert.emit({ title: "INVITE", message: `Couldn't accept invite: ${err.message}` }),
				);
		}, 100);
	},
	methods: {
		// accept friend request
		acceptFriendRequest(id: number) {
			// call action acceptFriend of the relation store
			store.relation.acceptFriend(id);
		},

		// decline friend request
		declineFriendRequest(relation: Relation) {
			store.relation.removeFriend(relation);
		},

		declineGameInvite(id: string) {
			// DELETE the invite by ID, update invites on success or alert on error.
			this.$axios
				.$delete(`/game/invite/${id}`)
				.then(() => this.$nuxt.$emit("social:updateGameInvites"))
				.catch((err) =>
					this.alert.emit({ title: "INVITE", message: `Couldn't decline invite: ${err.message}` }),
				);
		},

		acceptGameInvite(_id: string) {},

		// show a user profile based on a relation
		showUserRelation(relation: Relation) {
			// get the user of the relation that isn't the current user
			const user = this.other(relation);

			// ensure user exist
			if (user) {
				// set the user on the popup store
				store.popup.setUser(user);

				// show the user profile popup
				this.$modal.show("user_profile");
			}
		},

		// show a user profile based on a connection
		showUserConnection(connection: ChanConnection) {
			// set the user on the popup store
			store.popup.setUser(connection.user);

			// show the user profile popup
			this.$modal.show("user_profile");
		},

		// unblock a user
		unblock(rel: Relation) {
			// call the action unblock of the relation store
			store.relation.unblockUser(rel.target);
		},

		// select a connection
		select(connection: ChanConnection) {
			// if the list is a muted-selection, then simply emit the 'select' event
			if (this.type === "muted-selection") {
				this.$emit("select", connection);
			}
			// else
			else {
				// if the connection is on the selected list
				if (this.selected.includes(connection)) {
					// if the list is a admin-selection and the connection role isn't OWNER
					// then remove the connection by filtering the selected list
					if (this.type === "admin-selection" && connection.role !== ChannelRole.OWNER)
						this.selected = this.selected.filter((c) => c.id !== connection.id);
					// else, if the list is a banned-selection or kick-selection
					// then remove the connection by filtering the selected list
					else if (this.type === "banned-selection" || this.type === "kick-selection")
						this.selected = this.selected.filter((c) => c.id !== connection.id);
				}
				// else, simply push the connection to the selected list
				else {
					this.selected.push(connection);
				}

				// finally, emit the select event, passing the selected list
				this.$emit("select", this.selected);
			}
		},

		// method returning true if the connection is selected
		isSelected(connection: ChanConnection): boolean {
			return this.selected.includes(connection);
		},

		// method to invite a user in the current channel
		inviteInCurrentChannel(user: User) {
			// call the action invite of the connection store passing a partial connection
			store.channel.invite({
				channel: store.channel.currentConnection.channel,
				user,
			});
		},

		// method to get the other user of a relation
		other(relation: Relation): User {
			// roughly, if current user is the owner, then return the target, else return the owner
			return relation.owner.id === this.me.id ? relation.target : relation.owner;
		},

		// check if a user is already connected in the current channel
		isAlreadyOnCurrentChannel(user: User): boolean {
			return this.currentConnections.find((c) => c.user.id === user.id) !== undefined;
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

/* Set button green on hover */
.invite-icon:hover,
.invite-icon:focus {
	filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(100deg) brightness(104%) contrast(97%);
}
</style>
