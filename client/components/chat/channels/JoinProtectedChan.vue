<template>
	<div class="v-full h-full">
		<div class="text-white flex flex-col pl-8 pr-8 gap-4">
			<div class="flex flex-col">
				<p class="ml-2">Enter the password:</p>
				<div class="area-chan-name p-2">
					<input
						id="textarea-password"
						v-model="password"
						type="password"
						maxlength="20"
						class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
						placeholder="Password..."
						@keydown.enter.prevent="joinChannel"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import { chatStore } from "@/store/";

export default Vue.extend({
	name: "JoinProtectedChan",
	data() {
		return {
			password: "",
			get joiningChannel() {
				return chatStore.joiningChannel;
			},
		};
	},
	methods: {
		joinChannel() {
			this.chat.joinChannel(this.joiningChannel, this.password, () => {
				this.$modal.hide("join_protected_chan");
			});
			this.password = "";
		},
	},
});
</script>
