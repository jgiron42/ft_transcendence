<template>
	<div id="user-pannel" class="h-full">
		<div class="flex flex-col">
			<div class="flex btn_group">
				<button class="btn-selec">User</button>
				<button class="btn-selec">Friends</button>
				<button class="btn-selec">Admin</button>
			</div>
			<div v-if="selection === 0">
				<UsersInChannel :socket="socket" />
			</div>
			<div v-if="selection === 1">prout</div>
			<div v-if="selection === 2">prout</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

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
		};
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

.btn_group {
	color: #95b5df;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 10px;
	text-align: center;
	background-color: #364157;
}

.btn-selec {
	text-align: center;
	vertical-align: middle;
	width: 100%;
	height: 100%;
}
</style>
