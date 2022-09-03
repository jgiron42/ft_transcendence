<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-y-scroll">
		<div :class="`${$device.isMobile ? 'w-full h-full' : 'h-5/6  w-1/2'} max-w-full min-w-max`">
			<Leaderboard />
		</div>
		<!-- loads all the chat popup -->
		<Popup name="user_profile">
			<UserProfile />
		</Popup>
	</div>
</template>
