<template>
	<button class="arrow-button" @click="onClick">
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
	</button>
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
	},
	data() {
		return {
			selected: false,
		};
	},
	methods: {
		onClick() {
			this.selected = !this.selected;
		},
	},
});
</script>

<style scoped>
.arrow-button {
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 3px;
	border-radius: 5px;
	margin-bottom: 5px;
	color: #96989d;
}

.arrow-button:hover {
	color: white;
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
