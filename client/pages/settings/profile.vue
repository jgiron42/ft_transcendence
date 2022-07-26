<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-y-scroll">
		<div
			style="min-width: 250px"
			:class="` ${$device.isMobile ? 'w-full h-full mt-1' : 'w-4/12 h-5/6 '} max-w-full`"
		>
			<Settings selection-prop="Profile" />
		</div>
	</div>
</template>
