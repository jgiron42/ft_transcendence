<template>
	<div id="search-bar-div">
		<input
			v-model="currentInput"
			class="search-bar"
			type="text"
			:class="invalidInput ? 'invalid-input' : ''"
			:list="autocomplete === 'on' ? 'suggest-user' : ''"
			@input="update"
			@keyup.enter="validate"
		/>
		<datalist v-if="autocomplete === 'on'" id="suggest-user">
			<option v-for="(user, index) in suggestion" :key="index" :value="user.id" />
		</datalist>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/models/User";

export default Vue.extend({
	name: "SearchBar",
	props: {
		single: {
			type: Boolean,
			default: true,
		},
		autocomplete: {
			type: String,
			default: "on",
		},
	},
	data: () => ({
		suggestion: [{ id: "aaa" }, { id: "abc" }, { id: "cba" }],
		invalidInput: false,
		currentInput: "",
	}),
	methods: {
		async update() {
			if (!/^[a-zA-Z0-9-]*$/.test(this.currentInput)) this.error();
			else if (this.currentInput !== "")
				try {
					this.suggestion = (await this.$axios.get("/users/complete/" + this.currentInput)).data;
				} catch (e) {
					this.error();
				}
			else this.suggestion = [];
			this.$emit("update", this.suggestion);
		},
		error() {
			this.$emit("error", this.currentInput);
			this.currentInput = "";
			this.invalidInput = true;
			setTimeout(() => {
				this.invalidInput = false;
			}, 300);
		},
		validate() {
			if (this.currentInput === "") this.error();
			else if (this.single)
				this.$axios
					.get("/users/complete/" + this.currentInput)
					.then((response) => {
						const user = response.data.find((user: User) => user.id === this.currentInput);
						if (!user) this.error();
						else this.$emit("validate", user);
					})
					.catch(() => {
						this.error();
					});
			else
				this.$axios
					.get("/users/complete/" + this.currentInput)
					.then((response) => {
						if (response.data.length === 0) this.error();
						else this.$emit("validate", response.data);
					})
					.catch(() => {
						this.error();
					});
		},
	},
});
</script>

<style scoped>
.search-bar {
	padding-left: 0.5em;
	width: 95%;
	margin: auto;
	display: block;
	border: none;
	border-radius: 0.5em;
	transition: background-color;
	transition-duration: 100ms;
}

.invalid-input {
	background-color: #fb5c5c;
	outline: none;
}
</style>
