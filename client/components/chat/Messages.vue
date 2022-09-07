<template>
	<client-only>
		<div id="messages">
			<!-- The observer is an element emitting an event when it's visible in the viewport -->
			<Observer name="messages" @intersect="intersected" />

			<!-- iterate through messages -->
			<div v-for="(message, index) of messages" :key="message.id" class="message-content">
				<!-- if it's the first message or if the user of the message is not the same user as the previous message -->
				<div v-if="index === 0 || messages[index - 1].user.id != message.user.id" class="message-header">
					<!-- and if it's not my message, then display the username above it-->
					<span v-if="message.user.id !== me.id && message.user.id.length > 0" class="message-author">
						{{ message.user.username }}:
					</span>
				</div>
				<!-- if the message is mine, then add dynamically the class 'mine' and display the content -->
				<div class="message-text break-words" :class="message.user.id == me.id ? 'mine' : ''">
					<div class="items-center w-95">
						{{ message.content }}
					</div>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";
import { Channel } from "@/models/Channel";
import { Message } from "@/models/Message";
import { User } from "@/models/User";

export default Vue.extend({
	name: "Messages",
	data: () => ({
		// get the current channel
		get currentChannel(): Channel {
			return store.channel.currentConnection.channel;
		},

		// get the messages of the current channel
		get messages(): Message[] {
			return store.message.messages;
		},

		// get the current user
		get me(): User {
			return store.user.me;
		},
	}),
	mounted() {
		// when joining a new channel, check if the observer element is in the viewport in order to retrieve messages
		this.$nuxt.$on("JoinedChannel", () => this.intersected());
	},
	destroyed() {
		// when messages component isn't shown anymore, ensure to stop listening nuxt event.
		this.$nuxt.$off("JoinedChannel");
	},
	methods: {
		/* Intersected is the function called when the observer element is in the viewport.
		 * It will be called when the user scroll to the older messages in order to load more messages.
		 *
		 * If the length of messages has changed after retrieving messages from api and the observer elements are still in the viewport
		 * then the observer will emit 'intersect' event again in order to load more messages.
		 * and this, until the chatbox will be filled with messages.
		 */
		async intersected() {
			// check the length of message before and after retrieving messages from api
			const oldLength = this.messages.length;
			await store.message.retrieveMessages(this.currentChannel.id);
			const length = this.messages.length;

			// if the length of messages has changed check again if the observer elements are still in the viewport
			if (oldLength < length) {
				this.$nuxt.$emit("refresh-observer", "messages");
			}
		},
	},
});
</script>

<style>
#messages {
	height: fit-content;
	width: 97%;
}

.message-author {
	font: 0.75em "Open Sans", sans-serif;
	color: #828282;
}

.message-text {
	color: #95b5df;
	font: 1em "Open Sans", sans-serif;
	width: fit-content;
	max-width: 85%;
	height: fit-content;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 10px;
	background-color: #364157;
}

.mine {
	background-color: #97a6bd;
	margin-left: auto;
	margin-right: 0;
	color: #032644;
}
</style>
