<template>
	<div id="messages">
		<div v-for="(message, index) of $parent.messages" :key="message.id" class="message-content">
			<div v-if="index === 0 || $parent.messages[index - 1].send_by != message.send_by" class="message-header">
				<span v-if="message.mine != true && message.send_by.length > 0" class="message-author">
					{{ message.send_by }}:
				</span>
			</div>
			<div class="message-text break-all" :class="message.mine ? 'mine' : ''">
				<div class="items-center w-95">
					{{ message.content }}
				</div>
			</div>
		</div>
	</div>
</template>

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
	color: white;
	font: 1em "Open Sans", sans-serif;
	width: fit-content;
	max-width: 85%;
	height: fit-content;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 10px;
	background-color: #1b1b1b;
}

.mine {
	background-color: #bac1cc;
	margin-left: auto;
	margin-right: 0;
	color: #1b1b1b;
}
</style>
