<template>
	<div id="app" class="w-screen h-screen overflow-hidden flex flex-col">
		<Header />
		<div id="page" class="flex flex-row items-center flex-grow min-h-0 min-w-0 overflow-x-auto">
			<div class="menu_button flex flex-row">
				<NuxtLink to="/homepage" class="button_choice">
					<ProfileLogo />
				</NuxtLink>
				<NuxtLink to="/homepage" class="button_choice">
					<ChatLogo />
				</NuxtLink>
				<NuxtLink to="/homepage" class="button_choice">
					<PongLogo />
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: "Index",
	methods: {},
};
</script>

<style>
.menu_button {
	background-color: design-black;
	overflow: auto;
	width: 100%;
	white-space: nowrap;
	vertical-align: center;
}

.button_choice {
	margin-right: auto;
	margin-left: auto;
	display: flex;
	width: 10%;
	height: 10%;
}

body {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}
</style>
