<template>
	<div>
		<Loader v-if="loading" class="mx-auto animate-spin h-full" />
		<ObjectDebug v-else :object="user" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/models/User";

export default Vue.extend({
	data: () => ({
		missingAuth: "",
		user: new User(),
		loading: true,
	}),
	mounted() {
		// Get user from API
		this.$axios.get("/me").then((ret) => {
			// Update local user
			this.user = ret.data as User;

			// Hide loader and display content
			this.loading = false;
		});
	},
	methods: {},
});
</script>
