<template>
	<div class="observer" />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		name: {
			type: String,
			default: () => "",
		},
	},
	data: () => ({
		observer: new IntersectionObserver(() => {}),
	}),
	mounted() {
		this.observer = new IntersectionObserver(([entry]) => {
			if (entry && entry.isIntersecting) {
				this.$emit("intersect");
			}
		});
		this.observer.observe(this.$el);
		this.$nuxt.$on("refresh-observer", (s: String = "") => {
			if (s === this.name) {
				this.observer.unobserve(this.$el);
				this.observer.observe(this.$el);
			}
		});
	},
	destroyed() {
		this.observer.disconnect();
		this.$nuxt.$off("refresh-observer");
	},
});
</script>
