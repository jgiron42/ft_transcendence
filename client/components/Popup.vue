<template>
	<modal :name="name">
		<div class="w-full h-full mt-3">
			<slot />
		</div>
	</modal>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "Popup",
	props: {
		name: {
			type: String,
			required: true,
		},
	},
});
</script>
