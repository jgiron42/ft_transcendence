<template>
	<div>
		<Loader v-if="loading" class="mx-auto animate-spin h-full" />
		<ObjectDebug v-else :param="user" />
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
		this.$axios.get(this.$config.ft_api.url + "/me").then((ret) => {
			this.user = ret.data as User;
			this.loading = false;
		});
	},
	methods: {},
});
</script>
