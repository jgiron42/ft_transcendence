<template>
	<div id="container-test" class="flex flex-row justify-between items-center overflow-y-hidden">
		<Chatbox :socket="socket" />
		<chat-selection :socket="socket" />
	</div>
</template>

<script>
import ChatSelection from "~/components/Chat_selection";
export default {
	name: "Chat",
	components: { ChatSelection },
	data() {
		return {
			socket: io.connect(process.env.apiBaseUrl + "/chat", { reconnection: true }),
		};
	},
};
</script>

<style>
body {
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}

#container-test {
	width: 100%;
	height: 100%;
	min-width: 300px;
	margin-left: auto;
	margin-right: auto;
}
</style>
