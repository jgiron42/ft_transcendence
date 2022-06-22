<template>
	<div id="chat-box" class="w-full h-full flex flex-col">
		<div id="chat-content" class="flex flex-col-reverse items-center">
			<Messages :messages="messages" :user="user" />
		</div>
		<div id="msgBar" class="flex p-2">
			<div class="txt-msg-bg w-full h-full min-w-0 p-2">
				<textarea
					id="textarea"
					v-model="msgContent"
					maxlength="1000"
					class="message-txt bg-transparent border-none outline-none resize-none w-full flex-auto"
					placeholder="Enter message..."
					@keydown.enter.prevent="sendMessage"
				/>
			</div>
			<button id="send" class="btn pr-3 pl-3" @click.prevent="sendMessage">
				<svg width="20px" height="20px" viewBox="0 0 24 24" class="crt8y2ji">
					<path
						d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
						fill="#d5d5d5"
					/>
				</svg>
			</button>
			<!--button id="join" class="btn pr-3 pl-3" @click.prevent="joinRealm">Join..</button-->
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Message } from "@/models/Message";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";

export default Vue.extend({
	name: "Chatbox",
	props: {
		socket: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			title: "ChatBox",
			name: "",
			user: new User(),
			channel: new Channel(),
			msgContent: "",
			messages: [] as Message[],
		};
	},
	mounted() {
		this.clearMessages();
		if (this.socket.connected) {
			this.helloConnection();
		}
		this.socket.on("connect", () => {
			this.helloConnection();
		});
		this.socket.on("GAI", (user: User) => {
			this.onGAI(user);
		});
		this.socket.on("JC", (payload = { chan: Channel, messages: [] as Message[] }) => {
			this.onJC(payload.chan, payload.messages);
		});
		this.socket.on("MSG", (message: Message) => {
			this.onMSG(message);
		});
	},
	methods: {
		clearMessages() {
			this.messages = [];
		},
		initChat() {
			this.getAccountInformation();
			this.joinChannel("realm");
		},
		helloConnection() {
			this.name = this.$cookies.get("name");
			if (!this.name) this.name = "riblanc";
			this.socket.emit("HC", {
				name: this.name,
				token: this.$cookies.get("connect.sid"),
			});
		},
		getAccountInformation() {
			this.socket.emit("GAI", {
				uid: this.name,
			});
		},
		onGAI(user: User) {
			this.user = user;
		},
		joinChannel(channel: string) {
			this.socket.emit("JC", {
				channel,
			});
		},
		onJC(channel: unknown, messages: Message[]) {
			this.channel = channel as Channel;
			this.messages = messages;
		},
		sendMessage() {
			if (!(this.msgContent.length > 0)) return;
			this.socket.emit("MSG", {
				content: this.msgContent,
			});
			this.msgContent = "";
		},
		onMSG(message: Message) {
			this.messages.push(message);
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
