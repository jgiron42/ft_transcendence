<template>
	<div class="arrow-button" @click="onClick">
		<div class="flex w-full">
			<img src="~/assets/arrow-dropdown.svg" class="arrow-panel w-3" :class="selected ? 'arrow-selected' : ''" />
			<b class="pl-1">{{ name }}</b>
		</div>
	</div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
	name: "ArrowDropdown",
	props: {
		name: {
			type: String,
			default: () => "",
			required: true,
		},
		click: {
			type: Function,
			default: () => {},
		},
		state: {
			type: Boolean,
			default: () => true,
		},
	},
	data() {
		return {
			selected: this.state,
		};
	},
	methods: {
		onClick() {
			this.selected = !this.selected;
			this.click();
		},
	},
});
</script>

<style scoped>
.arrow-button {
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 3px 3px 0;
	color: #96989d;
}

.arrow-button:hover {
	color: white;
	cursor: pointer;
}

.arrow-panel:hover {
	color: white;
}

.arrow-panel {
	transform: rotate(-90deg);
}

.arrow-selected {
	transform: none;
}
</style>
