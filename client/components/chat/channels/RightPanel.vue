<template>
	<client-only>
		<div id="user-pannel" class="h-full w-full">
			<div class="flex flex-col h-full">
				<!-- flex-row containing 3 buttons: "Channel", "Admin" and "Social" -->
				<div class="flex p-2">
					<!-- button "Channel", set the selection to 0 when clicked -->
					<button
						class="btn-group btn-left"
						:class="selection === 0 ? 'btn-selected' : ''"
						@click.prevent="selection = 0"
					>
						Channel
					</button>

					<!-- button "Admin", set the selection to 1 when clicked -->
					<button
						v-if="isAdmin"
						class="btn-group"
						:class="selection === 1 ? 'btn-selected' : ''"
						@click.prevent="selection = 1"
					>
						Admin
					</button>

					<!-- button "Social", set the selection to 2 when clicked -->
					<button
						class="btn-group btn-right"
						:class="selection === 2 ? 'btn-selected' : ''"
						@click.prevent="selection = 2"
					>
						Social
					</button>
				</div>

				<!-- div containing the content of active panel -->
				<div class="h-full overflow-auto p-2">
					<!-- here, we don't use v-if to not destroy component when changing panel and passing selection in props-->
					<!-- the v-if on selection will be done in components itself, it ensure that all variables in these component will persist -->
					<!-- like the state of arrow drop down etc, avoiding it to be reset each time we are changing panel -->
					<UsersInChannel :selection="selection" />
					<AdminPanel :selection="selection" />
					<SocialPanel :selection="selection" />
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";

export default Vue.extend({
	name: "RightPanel",
	data() {
		return {
			// selection is used to display the right panel content
			// - 0: display the list of users in channels
			// - 1: display the admin panel of the current channel
			// - 2: display the social panel
			selection: 0,

			// return the current user
			get me() {
				return store.user.me;
			},

			// return true if the current user is an admin of the current channel
			get isAdmin(): boolean {
				return store.channel.currentConnection.role >= ChannelRole.ADMIN;
			},
		};
	},
	mounted() {
		// scroll page to the right
		const elem = document.getElementById("chat-container");
		if (elem) elem.scrollLeft = elem.scrollWidth;

		// when the user join a channel
		this.$nuxt.$on("JoinedChannel", () => {
			// if the previous selection was admin panel, then display the users in channel instead of admin panel
			// ensuring that the admin panel is not display anymore when a user join a channel
			if (this.selection === 1) this.selection = 0;
		});

		// when a connection is updated
		this.$nuxt.$on("updateConnection", (connection: ChanConnection) => {
			// if the connection's user is me and the connection's role isn't admin and the selection is on the admin panel
			// then hide the admin panel
			if (
				store.user.me.id === connection.user.id &&
				connection.role < ChannelRole.ADMIN &&
				this.selection === 1
			) {
				this.selection = 0;
			}
		});
	},
});
</script>

<style>
#user-pannel {
	overflow: auto;
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

<style scoped>
.btn-group {
	font-size: small;
}
</style>
