<template>
	<!-- Mock GAME component -->
	<div class="animated flash">
		<BoxButton
			color="bg-red-900"
			:content="['(!) WIP (!)', '---', `GAME #${gameID}`, '---', 'SELF', 'VS', opponentName]"
			:enable-hover="false"
		/>
	</div>
</template>
<script lang="ts">
export default {
	props: {
		gameID: {
			type: Number,
			required: true,
		},
	},
	data: () => ({
		opponentName: "CHARLIE",
	}),
};
</script>
<style>
@keyframes flash {
	0%,
	50%,
	100% {
		opacity: 1;
	}

	25%,
	75% {
		opacity: 0;
	}
}

.animated {
	animation-duration: 1s;
	animation-fill-mode: both;
}

.flash {
	animation-name: flash;
}
</style>
