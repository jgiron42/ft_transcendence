<template>
	<div id="messages">
		<div v-for="(message, index) of messages" :key="message.id" class="message-content">
			<div v-if="index === 0 || messages[index - 1].user.id != message.user.id" class="message-header">
				<span v-if="(message.user.id === me.id) != true && message.user.id.length > 0" class="message-author">
					{{ message.user.username }}:
				</span>
			</div>
			<div class="message-text break-all" :class="message.user.id == me.id ? 'mine' : ''">
				<div class="items-center w-95">
					{{ message.content }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";

export default Vue.extend({
	name: "Messages",
	data() {
		return {
			get messages() {
				return store.message.messages;
			},
			get me() {
				return store.chat.me;
			},
		};
	},
	destroyed() {
		this.$nuxt.$off("JC");
		this.$nuxt.$off("MSG");
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
