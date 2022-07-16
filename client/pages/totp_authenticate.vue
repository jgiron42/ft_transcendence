<template>
	<div id="content" class="flex flex-col w-full max-h-full justify-center items-center text-center overflow-y-scroll">
		<span class="bg-design_mgray p-3 m-10 text-white text-3xl break-all"> AUTHENTICATION </span>
		<box-slot>
			ENTER YOUR TOTP<br />
			CODE:
			<div class="mt-8 mb-7">
				<input
					type="number"
					class="font-mono rounded-md text-design_black text-center text-msg-bg w-full box-border"
					@input="updateInput($event.target.value)"
				/>
			</div>
			<button id="connect" class="hover:text-gray-400" @click="connect">CONNECT</button>
		</box-slot>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "Index",
	data: () => ({
		input: "",
	}),
	methods: {
		updateInput(input: string) {
			this.input = input;
		},
		async connect() {
			const response = await this.$axios.$post(this.$config.ft_api.url + "/auth/totp", "code=" + this.input, {
				withCredentials: true,
			});
			if (response.isTOTPIdentified) this.$router.push("/");
			console.log("rep:", response);
		},
	},
});
</script>
