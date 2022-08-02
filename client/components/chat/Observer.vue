<template>
	<div class="observer" />
</template>

<script lang="ts">
import Vue from "vue";

/*
 * The Observer is a div element placed at the beginning or at the end of a list of items which is scrollable.
 * If the observer is visible on the viewport, it will emit an event called 'intersect'.
 * It's particularly useful to detect when a list of items is scrolled to the end in order to fetch more items from the api.
 * It's often used in order to make a infinite scroll.
 */
export default Vue.extend({
	props: {
		// the name is used to identify the observer
		name: {
			type: String,
			default: () => "",
		},
	},
	data: () => ({
		observer: new IntersectionObserver(() => {}),
	}),
	mounted() {
		// Instance the observer, the callback given to the constructor will be called when the element will intersect or not the viewport.
		this.observer = new IntersectionObserver(([entry]) => {
			// If the element is visible on the viewport, emit an event called 'intersect'.
			if (entry && entry.isIntersecting) this.$emit("intersect");
		});
		// Add the observer to the element, so it will be attached to the main div of the template.
		this.observer.observe(this.$el);

		// Force the observer to refresh when receiving an event called 'refresh-observer'.
		this.$nuxt.$on("refresh-observer", (s: String = "") => {
			// If the name of the observer is the same as the one given in the event, refresh the observer.
			if (s === this.name) {
				this.observer.unobserve(this.$el);
				this.observer.observe(this.$el);
			}
		});
	},
	destroyed() {
		// Ensure to remove observer and events when the Observer is not visible in the page anymore.
		this.observer.disconnect();
		this.$nuxt.$off("refresh-observer");
	},
});
</script>
