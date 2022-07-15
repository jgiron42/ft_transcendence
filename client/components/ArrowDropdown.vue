<template>
	<li class="arrow-button" @click="onClick">
		<div class="flex w-full">
			<svg
				class="arrow-panel"
				:class="selected ? 'arrow-selected' : ''"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"
				/>
			</svg>
			<b>{{ name }}</b>
		</div>
	</li>
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
