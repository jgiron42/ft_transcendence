<template>
	<div class="flex flex-col h-full justify-center items-center">
		<Auth />
		<div class="flex flex-row">
			<BoxSlot>
				<NuxtLink to="/settings/security">Go to settings</NuxtLink>
			</BoxSlot>
			<BoxSlot>
				<NuxtLink to="/matchmaking">Go to matchmaking</NuxtLink>
			</BoxSlot>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: "Index",
};
</script>
