<template>
	<client-only>
		<div id="chat-box" class="w-full h-full flex flex-col">
			<!-- displays list of messages-->
			<div id="chat-content" class="flex flex-col-reverse items-center">
				<Messages />
			</div>

			<!-- displays message bar-->
			<div id="msgBar" class="flex p-2">
				<!-- input filed message -->
				<div class="txt-msg-bg w-full h-full min-w-0 p-2">
					<textarea
						id="textarea"
						v-model="msgContent"
						maxlength="1000"
						class="message-txt bg-transparent border-none outline-none resize-none w-full flex-auto break-words"
						placeholder="Enter message..."
						@keydown.enter.prevent="sendMessage"
					/>
				</div>

				<!-- send Button -->
				<button id="send" class="btn pr-3 pl-3" @click.prevent="sendMessage">
					<SendButtonLogo />
				</button>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store/";

export default Vue.extend({
	name: "Chatbox",
	data: () => ({
		// content of the message to send
		msgContent: "",
	}),
	methods: {
		// send message to server
		sendMessage() {
			// if the message is empty, do nothing
			if (!(this.msgContent.length > 0)) return;

			// send message to server calling the sendMessage Action of message store passing a partial message.
			store.message.sendMessage({
				content: this.msgContent,
				created_at: new Date(),
			});

			// clear the message input
			this.msgContent = "";
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

.message-txt {
	color: #d5d5d5;
}

#chat-box {
	background-color: #1b1b1b;
	min-width: 300px;
}

#chat-content {
	height: calc(100% - 0px);
	overflow-y: auto;
}
</style>
