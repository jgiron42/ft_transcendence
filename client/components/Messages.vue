<template>
	<div id="messages">
		<div v-for="message of $parent.messages" :key="message.id" class="message-content">
			<div class="message-header">
				<span v-if="message.name.length > 0" class="message-author">{{ message.name }}:</span>
			</div>
			<div class="message-text break-all">
				<div class="items-center w-95">
					{{ message.text }}
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

.message-text {
	color: white;
	font: 1em "Open Sans", sans-serif;
	width: fit-content;
	height: fit-content;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 10px;
	background-color: indigo;
}
</style>
