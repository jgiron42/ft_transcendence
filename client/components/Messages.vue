<template>
	<div id="messages">
		<div v-for="(message, index) of $parent.messages" :key="message.id" class="message-content">
			<div v-if="index === 0 || $parent.messages[index - 1].send_by != message.send_by" class="message-header">
				<span
					v-if="(message.send_by === $parent.me.pseudo) != true && message.send_by.length > 0"
					class="message-author"
				>
					{{ message.send_by }}:
				</span>
			</div>
			<div class="message-text break-all" :class="message.send_by == $parent.me.pseudo ? 'mine' : ''">
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
