<template>
	<div class="h-full w-full">
		<input v-model="pseudo" placeholder="pseudo" />
		<button @click.prevent="createUser">newUserExample</button>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";

export default Vue.extend({
	name: "Login",
	middleware: "getUser",
	data() {
		return {
			pseudo: "",
			path: "/",
		};
	},
	mounted() {
		const redirect = this.$route.query.redirect;
		if (redirect) {
			this.path += redirect;
		}
		if (store.user.me.id !== null) {
			this.$router.push(this.path);
		}
	},
	methods: {
		createUser() {
			this.api.get(
				"/newUserExample",
				{ pseudo: this.pseudo },
				() => {
					this.$router.push(this.path);
				},
				(err: any) => {
					console.log(err);
				},
			);
		},
	},
});
</script>
