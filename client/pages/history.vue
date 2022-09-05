<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-y-scroll select-none">
		<div :class="`${$device.isMobile ? 'w-full h-full' : 'h-5/6  w-1/2'} max-w-full min-w-max`">
			<History v-if="id" :page-prop="$route.query.page || 1" :user-i-d="id" />
			<div v-else class="w-full h-full items-center flex content-center">
				<Loader class="animate-spin mx-auto" />
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	layout: "no-mobile-header",
	data: () => ({
		id: "",
	}),
	async mounted() {
		try {
			this.id = (this.$route.query.user as string) || (await this.$user.getUser()).id;
		} catch (err: any) {
			this.$nuxt.alert.emit({ title: "HISTORY", message: `Couldn't fetch user: ${err.toString()}` });
		}
	},
});
</script>
