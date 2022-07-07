<template>
	<div>
		<DebugCookies />
		<BoxButton v-if="authenticated" font="font-mono" :content="['You are', 'authenticated']" />
		<BoxSlot v-else font="font-mono">
			<form action="/api/auth/42" method="POST">
				<label for="submit1">42 auth</label>
				<input id="submit1" class="bg-black" type="submit" value="submit" />
			</form>
			<form action="/api/auth/totp" method="POST">
				<label for="totp">totp auth</label>
				<input id="totp" class="bg-black" type="text" name="code" />
				<input id="submit2" class="bg-black" type="submit" value="submit" />
			</form>
		</BoxSlot>
		<ObjectDebug :param="user" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	data: () => ({
		authenticated: false,
		user: {
			name: "userName",
		},
	}),
	mounted() {
		this.$nuxt.$on("mustAuthenticate", () => {
			this.authenticated = false;
		});
	},
	methods: {},
});
</script>
