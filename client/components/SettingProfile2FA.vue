<template>
	<div id="setting-profile" class="w-full h-full flex flex-col items-center bg-design_black">
		<div id="spacer" class="h-1/3"></div>
		<a>SET 2FA</a>
		<div class="text-msg-bg flex flex-col w-full h-full items-center justify-around">
			<input
				id="profile-picture"
				class="font-mono h-10 w-2/3 rounded-md text-design_black text-center text-msg-bg"
			/>
		</div>
	</div>
</template>

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
</style>
