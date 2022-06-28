<template>
	<div id="user-selection" class="h-full">
		<div v-for="(user, index) of users" :key="index">
			<!--button class="user-name cut-text btn text-left" @click="$modal.show('user_profile')"-->
			<button class="user-name cut-text btn text-left">
				<b>{{ user.username }}</b>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "@/models/User";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "ChatSelection",
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
			users: [] as User[],
			get me() {
				return chatStore.me;
			},
		};
	},
	mounted() {
		// this is a test
		const u = new User();
		u.username = "test";
		this.users.push(u);
		this.users.push(u);
		// ///////////////////
		const containerTest = document.getElementById("container-test");
		if (containerTest != null) {
			if (this.align === "left") {
				containerTest.scrollLeft = 0;
			} else if (this.align === "right") {
				containerTest.scrollLeft = containerTest.scrollWidth;
			}
		}
		this.socket.on("updateUsers", (users: User[]) => {
			this.onUpdateUsers(users);
		});
	},
	methods: {
		onUpdateUsers(users: User[]) {
			this.users = users;
		},
	},
});
</script>

<style>
#user-selection {
	overflow: auto;
	padding: 0.5rem;
	width: 240px;
	min-width: 240px;
	background-color: #252525;
}

.user-name {
	overflow: hidden;
	color: #bdbdbd;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 3px;
	border-radius: 5px;
	margin-bottom: 5px;
}

.user-name:hover {
	background-color: #393939;
	color: #999;
}

.cut-text {
	text-overflow: ellipsis;
	overflow: hidden;
	width: 100%;
	white-space: nowrap;
}
</style>
