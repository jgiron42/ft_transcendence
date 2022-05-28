<template>
	<div id="chat-box" class="w-full h-full flex flex-col">
		<h1 id="chat-title" class="text-center">Chat</h1>
		<br>
		<input type="text" v-model="name" id="username" class="form-control" placeholder="Enter name...">
		<div id="chat-content" class="flex flex-col-reverse items-center">
			<br>
				<Messages />
			<br>
		</div>
		<div id="msgBar" class="flex justify-end">
			<textarea id="textarea" class="resize-none min-w-0 flex-auto" v-model="text" @keydown.enter.prevent="sendMessage" placeholder="Enter message..."></textarea>
			<button id="send" class="btn pb-1" @click.prevent="sendMessage">Send</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'chat',
	data() {
		return {
			title: 'Chat',
			name: '',
			text: '',
			messages: [],
			socket: null
		}
	},
	methods: {
		sendMessage() {
			if (this.text.length > 0) {
				this.socket.emit('msgToServer', {
					name: this.name,
					text: this.text
				});
				this.text = '';
			}
		},
		receivedMessage(data) {
			this.messages.push(data);
		}
	},
	mounted() {
		this.socket = io(process.env.apiBaseUrl);
		this.socket.on('msgToClient', (message) => {
			this.receivedMessage(message)
		});
		this.messages = [];
	},
}
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

<!--style>

#chat {
	background-color: #f5f5f5;
	width: 100%;
}

.chat-box
{
	width: 32vw;
}

.chatTitle {
	font-size: 2rem;
	font-weight: bold;
	color: #f5f5f5;
}
</style-->
