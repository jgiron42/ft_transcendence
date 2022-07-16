<template>
	<div id="setting-2fa" class="w-full h-full flex flex-col items-center bg-design_black py-5">
		<h1 class="text-xl lg:text-3xl m-1">2FA IS {{ is2FAEnabled ? "ENABLED" : "DISABLED" }}</h1>
		<h2 class="text-md lg:text-xl m-1">{{ username }}</h2>
		<div class="text-msg-bg flex flex-col w-full h-full items-center justify-around">
			<div
				v-if="!generating2FA"
				style="max-width: 450px"
				class="min-w-0 w-10/12 px-5 lg:px-24"
				@click="generating2FA = true"
			>
				<BoxButton class="w-full" size="" :content="['ENABLE', 'TOTP']" />
			</div>
			<div v-else>
				<qrcode
					class="ml-2"
					:value="`otpauth://totp/ft_transcendance:${username}?secret=${convertSecret()}&issuer=ft_transcendance`"
					:options="{ width: 200 }"
				></qrcode>
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

Vue.component(VueQrcode.name, VueQrcode);

export default Vue.extend({
	props: {
		is2FAEnabledProp: {
			type: Boolean,
			default: () => false,
		},
	},
	data: () => ({
		is2FAEnabled: false,
		generating2FA: false,
		userSingleton: new UserSingleton({} as Context),
		user: new User(),
		username: "none",
		secret: randomKey(10),
	}),
	async mounted() {
		this.userSingleton = new UserSingleton({
			$axios: this.$axios,
			store: this.$store,
			redirect: (url: string) => {
				this.$router.push(url);
			},
			$config: this.$config,
		} as Context);
		this.user = await this.userSingleton.getUser();
		this.username = this.user.id as string;
		this.is2FAEnabled = this.user.totp_enabled;
		if (this.is2FAEnabled) {
			this.generating2FA = true;
			this.secret = this.user.totp_key;
		}
		console.log("user:", this.user);

		this.$nuxt.$on("saveSettings2FA", async () => {
			this.user = { ...this.user, totp_enabled: true, totp_key: this.secret };
			this.userSingleton.setUser(this.user);
			await this.userSingleton.save();
			this.user = await this.userSingleton.fetch();
			this.is2FAEnabled = this.user.totp_enabled;
			console.log("newUser:", this.user);
		});
	},
	methods: {
		convertSecret(): string {
			const encoder = new TextEncoder();
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
