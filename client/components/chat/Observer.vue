<template>
	<div class="observer" />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
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
		this.$nuxt.$on("refresh-observer", () => {
			this.observer.unobserve(this.$el);
			this.observer.observe(this.$el);
		});
	},
	destroyed() {
		this.observer.disconnect();
	},
});
</script>
