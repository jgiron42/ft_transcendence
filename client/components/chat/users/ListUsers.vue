<template>
	<div>
		<div v-for="(connection, index) of connections" :key="index">
			<button class="user-button cut-text btn text-left" @click="click">
				<b>{{ connection.user.username }} {{ connection.role }}</b>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "ListUsers",
	props: {
		connections: {
			type: Array,
			default: () => [],
		},
		click: {
			type: Function,
			default: () => {},
		},
	},
});
</script>

<style scoped>
.user-button {
	padding-left: 28px;
	color: #bdbdbd;
	font: 0.9em "Open Sans", sans-serif;
	width: 100%;
	border-radius: 5px;
}

.user-button:hover {
	background-color: #393939;
	color: #999;
}
</style>
