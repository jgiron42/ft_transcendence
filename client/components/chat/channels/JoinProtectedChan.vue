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
import { store } from "@/store/";

export default Vue.extend({
	name: "JoinProtectedChan",
	data() {
		return {
			password: "",
			get joiningChannel() {
				return store.chat.joiningChannel;
			},
		};
	},
	methods: {
		joinChannel() {
			store.channel.joinChannel({ ...this.joiningChannel, password: this.password });
			this.$modal.hide("join_protected_chan");
			this.password = "";
		},
	},
});
</script>

<style scoped>
.area-chan-name {
	border: none;
	border-bottom: 1px solid #333;
	background-color: #1c2638;
	border-radius: 7px;
	outline: none;
	width: 80%;
	padding-top: 12px;
	resize: none;
	font: 1em "Open Sans", sans-serif;
	display: inline;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
</style>
