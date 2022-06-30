<template>
	<div id="user-selection" class="h-full">
		<div v-for="(connection, index) of chanConnections" :key="index">
			<!--button class="user-name cut-text btn text-left" @click="$modal.show('user_profile')"-->
			<button class="user-name cut-text btn text-left">
				<b>{{ connection.user.username }} {{ connection.role }}</b>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "ChatSelection",
	data() {
		return {
			get chanConnections() {
				return chatStore.chanConnections;
			},
			get me() {
				return chatStore.me;
			},
		};
	},
});
</script>

<style>
#user-selection {
	width: 100%;
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
