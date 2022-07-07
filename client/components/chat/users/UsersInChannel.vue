<template>
	<div id="user-selection" class="h-full">
		<ListUsers :connections="chanConnections" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "UsersInChannel",
	data() {
		return {
			get chanConnections() {
				return chatStore.chanConnections;
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
