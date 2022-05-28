<template>
	<div id="chat-box" class="w-full h-full flex flex-col">
		<h1 id="chat-title" class="text-center">Chat</h1>
		<input id="username" v-model="name" class="form-control" type="text" placeholder="Enter name..." />
		<div id="chat-content" class="flex flex-col-reverse items-center">
			<Messages />
		</div>
		<div id="msgBar" class="flex justify-end">
			<textarea
				id="textarea"
				v-model="text"
				class="resize-none min-w-0 flex-auto"
				placeholder="Enter message..."
				@keydown.enter.prevent="sendMessage"
			/>
			<button id="send" class="btn pb-1" @click.prevent="sendMessage">Send</button>
		</div>
	</div>
</template>

<script>
export default {
	name: "Chat",
	data() {
		return {
			title: "Chat",
			name: "",
			text: "",
			messages: [],
			socket: null,
		};
	},
	mounted() {
		this.socket = io(process.env.apiBaseUrl);
		this.socket.on("msgToClient", (message) => {
			this.receivedMessage(message);
		});
		this.messages = [];
	},
	methods: {
		sendMessage() {
			if (this.text.length > 0) {
				this.socket.emit("msgToServer", {
					name: this.name,
					text: this.text,
				});
				this.text = "";
			}
		},
		receivedMessage(data) {
			this.messages.push(data);
		},
	},
};
</script>

<style>
#chat-box {
	background-color: #f5f5f5;
}

#chat-content {
	height: calc(100% - 100px);
	overflow-y: scroll;
}
</style>
