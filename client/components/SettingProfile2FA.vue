<template>
	<div id="setting-2fa" class="w-full h-full flex flex-col items-center bg-design_black py-5">
		<!-- User's 2FA's status and ID  -->
		<h1 class="text-xl lg:text-3xl m-1">2FA IS {{ is2FAEnabled ? "ENABLED" : "DISABLED" }}</h1>
		<h2 class="text-md lg:text-xl m-1">{{ username }}</h2>

		<!-- Content -->
		<div class="text-msg-bg flex flex-col w-full h-full items-center justify-around">
			<!-- Button to enable TOTP and generate a QR code -->
			<div
				v-if="!generating2FA"
				style="max-width: 450px"
				class="min-w-0 w-10/12 px-5 lg:px-24"
				@click="generating2FA = true"
			>
				<BoxButton class="w-full" size="" :content="['ENABLE', 'TOTP']" />
			</div>
			<!-- QR code and plaintext secret -->
			<div v-else>
				<!-- QR code usable with google authenticator -->
				<qrcode
					class="ml-2"
					:value="`otpauth://totp/ft_transcendance:${username}?secret=${convertSecret()}&issuer=ft_transcendance`"
					:options="{ width: 200 }"
				></qrcode>
				<!-- TOTP secret key in plaintext -->
				<p class="p-1 mt-8 bg-white text-black box-border">
					{{ convertSecret() }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { Context } from "@nuxt/types";
import { base32Encode } from "@/utils/base32";
import { User, UserSingleton } from "~/models/User";
import randomKey from "@/utils/randomKey";

Vue.component(VueQrcode.name, VueQrcode); // Component used to generate a QR code

export default Vue.extend({
	data: () => ({
		is2FAEnabled: false, // user's 2FA status (enabled/disabled)
		generating2FA: false, // Flag determining if we're displaying the credentials page
		userSingleton: new UserSingleton({} as Context), // UserStore wrapper
		user: new User(), // Self's user
		username: "none", // Displayed username
		secret: randomKey(10), // Generated 2FA secret key
	}),
	async mounted() {
		// Get UserStore wrapper to get or fetch it conviniently
		this.userSingleton = new UserSingleton({
			$axios: this.$axios,
			store: this.$store,
			redirect: (url: string) => {
				this.$router.push(url);
			},
			$config: this.$config,
		} as Context);

		//  Get user
		this.user = await this.userSingleton.getUser();

		// Set displayed username
		this.username = this.user.id as string;

		// Set displayed 2FA status
		this.is2FAEnabled = this.user.totp_enabled;
		if (this.is2FAEnabled) {
			// 2FA is already enabled so just display the current credentials
			this.generating2FA = true;
			this.secret = this.user.totp_key;
		}

		//  Set handler for "SAVE" button press
		this.$nuxt.$on("saveSettings2FA", async () => {
			// Clone user to avoid mutating the store object
			this.user = { ...this.user, totp_enabled: true, totp_key: this.secret };

			// Update user in store
			this.userSingleton.setUser(this.user);

			// Update user in database.
			await this.userSingleton.save();

			// Fetch updated user
			this.user = await this.userSingleton.fetch();

			// Update 2FA flag
			this.is2FAEnabled = this.user.totp_enabled;
		});
	},
	methods: {
		convertSecret(): string {
			// Get encoder to convert a string to a buffer
			const encoder = new TextEncoder();

			// Convert TOTP secret key to the base32 string you'll need for authenticator apps
			return base32Encode(encoder.encode(this.secret));
		},
	},
});
</script>

<style>
.txt-msg-bg {
	border: none;
	border-bottom: 1px solid #333;
	background-color: #1c2638;
	border-radius: 15px;
	outline: none;
	width: 100%;
	height: 100%;
	resize: none;
	font: 1em "Open Sans", sans-serif;
}
</style>
