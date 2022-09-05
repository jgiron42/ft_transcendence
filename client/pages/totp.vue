<template>
	<div id="content" class="flex flex-col w-full max-h-full justify-center items-center text-center overflow-y-scroll">
		<!-- Title -->
		<span class="bg-design_mgray p-3 m-10 text-white text-3xl break-all"> AUTHENTICATION </span>
		<!-- Box with input for sending your TOTP token -->
		<box-slot>
			<!-- Input title -->
			ENTER YOUR TOTP<br />
			CODE:
			<!-- Input text field for TOTP token -->
			<div class="mt-8 mb-7">
				<input
					type="number"
					class="font-mono rounded-md text-design_black text-center text-msg-bg w-full box-border"
					@input="updateInput($event.target.value)"
					@keyup.enter="connect"
				/>
			</div>
			<!-- Button for sending the TOTP token to the API -->
			<button id="connect" class="hover:text-gray-400" @click="connect">CONNECT</button>
		</box-slot>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "Index",
	layout: "no-navigation",
	data: () => ({
		input: "",
	}),
	mounted() {
		this.$user
			.fetch()
			.then((_) => this.$router.push("/"))
			.catch((_) => {});
	},
	methods: {
		updateInput(input: string) {
			this.input = input;
		},
		connect() {
			this.$axios
				.$post("/auth/totp", "code=" + this.input)
				.then((response) => {
					if (response.isTOTPIdentified) {
						this.$gameSocket.init(this.$nuxt.context);
						this.$chatSocket.init(this.$nuxt.context);
						this.$router.push("/");
					}
				})
				.catch((_) => this.alert.emit({ title: "2FA", message: "TOTP token has been rejected." }));
		},
	},
});
</script>
