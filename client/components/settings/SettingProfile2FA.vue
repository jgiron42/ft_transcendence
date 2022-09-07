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
			<div v-else class="flex flex-col items-center justify-center">
				<!-- QR code usable with google authenticator -->
				<qrcode
					class="ml-2"
					:value="`otpauth://totp/ft_transcendance:${username}?secret=${convertSecret()}&issuer=ft_transcendance`"
					:options="{ width: 200 }"
				></qrcode>
				<br />
				<!-- TOTP secret key in plaintext -->
				<div class="p-1 mt-5 bg-white text-black box-border flex flex-row">
					<button class="w-5 mx-1 cursor-pointer" @click="disable2FA()">
						<CrossLogo />
					</button>
					<p class="overflow-scroll no-scrollbar">{{ convertSecret() }}</p>
					<button class="w-5 mx-1 cursor-pointer" @click="regenerate2FA()">
						<RedoButton />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import _ from "lodash";
import { base32Encode } from "@/utils/base32";
import { User } from "@/models/User";
import randomKey from "@/utils/randomKey";

Vue.component(VueQrcode.name, VueQrcode); // Component used to generate a QR code

export default Vue.extend({
	data: () => ({
		is2FAEnabled: false, // user's 2FA status (enabled/disabled)
		generating2FA: false, // Flag determining if we're displaying the credentials page
		user: new User(), // Self's user
		username: "none", // Displayed username
		secret: randomKey(10), // Generated 2FA secret key
	}),
	beforeDestroy() {
		this.$nuxt.$off("saveSettings2FA");
	},
	mounted() {
		//  Get user
		this.$user
			.getUser()
			.then((user) => {
				this.user = user;

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
				this.$nuxt.$on("saveSettings2FA", this.saveSettings);
			})
			.catch((err) =>
				this.$nuxt.alert.emit({ title: "SECURITY", message: `Couldn't fetch user: ${err.toString()}` }),
			);
	},
	methods: {
		saveSettings() {
			// Clone user to avoid mutating the store object
			_.merge(this.user, { ...this.user, totp_enabled: this.generating2FA, totp_key: this.secret });

			// Update user in store
			this.$user.setUser(this.user);

			// Update user in database.
			this.$user
				.save()
				.then(() => {
					this.alert.emit({
						title: "SECURITY",
						message: "PROFILE SUCCESSFULLY UPDATED",
						isError: false,
					});
					this.is2FAEnabled = this.generating2FA;
				})
				.catch((err) => this.alert.emit({ title: "SECURITY", message: err.toString() }));

			// Fetch updated user
			this.$user
				.fetch()
				.then((user) => {
					// Update local user.
					this.user = user;

					// Update 2FA flag
					this.is2FAEnabled = this.user.totp_enabled;
				})
				.catch((err) =>
					this.$nuxt.alert.emit({
						title: "SECURITY",
						message: `Couldn't fetch user: ${err.toString()}`,
					}),
				);
			location.reload();
		},
		disable2FA() {
			this.generating2FA = false;
			this.is2FAEnabled = false;
		},
		regenerate2FA() {
			this.generating2FA = false;
			this.secret = randomKey(10);
			this.$nuxt.$nextTick(() => (this.generating2FA = true));
		},
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
