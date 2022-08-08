<template>
	<div>
		<form autocomplete="off">
			<input
				id="searchuser"
				class="autocomplete"
				type="text"
				name="searchuser"
				placeholder="Searching for player"
			/>
		</form>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "SearchInput",
	data() {
		return {
			players: [
				"lejulien",
				"ljulien",
				"llaurent",
				"lewrew",
				"frtalleu",
				"smaccary",
				"jgiron",
				"riblanc",
				"riolait",
			],
			input: null,
			id: 0,
			currentFocus: -1,
			value: "",
		};
	},
	mounted() {
		this.input = document.getElementById("searchuser");
		this.input.parentElement.addEventListener("submit", this.simpleEntry);
		this.autocomplete();
	},
	methods: {
		closeLists() {
			const x = document.getElementsByClassName("autocomplete-items");
			for (let i = 0; i < x.length; i++) {
				x[i].parentNode.removeChild(x[i]);
			}
		},
		addActive(x: any) {
			if (!x) return false;
			this.removeActive(x);
			if (this.currentFocus >= x.length) this.currentFocus = 0;
			if (this.currentFocus < 0) this.currentFocus = x.length - 1;
			x[currentFocus].classList.add("autocomplete-active");
		},
		removeActive(x: any) {
			for (let i = 0; i < x.length; i++) {
				x[i].classList.remove("autocomplete-active");
			}
		},
		autocomplete() {
			this.input.addEventListener("input", this.onInputs);
		},
		onInputs() {
			// remove previous predictions
			this.closeLists();
			// get current inputed value
			this.value = this.input.value;
			if (!this.value) return false;
			// reset focus
			this.currentFocus = -1;
			// Create and add the container for suggestions
			const container = document.createElement("DIV");
			container.setAttribute("id", "autocomplete-list");
			container.setAttribute("class", "autocomplete-items");
			this.input.parentNode.appendChild(container);
			for (let i = 0; i < this.players.length; i++) {
				if (this.players[i].substr(0, this.value.length).toUpperCase() === this.value.toUpperCase()) {
					const sug = document.createElement("DIV");
					sug.innerHTML = "<strong>" + this.players[i].substr(0, this.value.length) + "</strong>";
					sug.innerHTML += this.players[i].substr(this.value.length);
					sug.innerHTML += "<input type='hidden' value='" + this.players[i] + "'>";
					sug.addEventListener("click", function () {
						document.getElementById("searchuser").value = this.querySelector("input").value;
						const x = document.getElementsByClassName("autocomplete-items");
						for (let i = 0; i < x.length; i++) {
							x[i].parentNode.removeChild(x[i]);
						}
					});
					container.appendChild(sug);
				}
			}
		},
		simpleEntry(event: any) {
			event.preventDefault();
		},
	},
});
</script>

<style>
input {
	font: 1em "Open Sans", sans-serif;
}

.autocomplete-list {
	position: relative;
}

.autocomplete-items {
	font: 1em "Open Sans", sans-serif;
	position: absolute;
	background: #fff;
	color: black;
	border-bottom-right-radius: 5px;
	border-bottom-left-radius: 5px;
}

.autocomplete-items div:hover {
	background-color: #cecece;
	border-radius: 5px;
}
</style>
