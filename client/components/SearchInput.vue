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
				"lejuaien",
				"ljulaen",
				"llauavent",
				"lewravw",
				"frtaavleu",
				"smacavary",
				"jgiravn",
				"riblavnc",
				"riolavit",
				"frtalvleu",
				"smaccvary",
				"jgirovn",
				"riblavnc",
				"riolavit",
				"lejuavien",
				"ljulaven",
				"llauavent",
				"lewravw",
				"frtaavleu",
				"smacavary",
				"jgiravn",
				"riblavnc",
				"riolavit",
			],
			input: HTMLElement | null,
			id: 0,
			value: "",
			min_input: 3,
			max_pred: 10,
		};
	},
	mounted() {
		this.input = document.getElementById("searchuser");
		if (this.input) {
			this.input.parentElement.addEventListener("submit", this.simpleEntry);
		}
		this.autocomplete();
	},
	methods: {
		closeLists() {
			const x = document.getElementsByClassName("autocomplete-items");
			for (let i = 0; i < x.length; i++) {
				x[i].parentNode.removeChild(x[i]);
			}
		},
		autocomplete() {
			if (this.input) this.input.addEventListener("input", this.onInputs);
		},
		onInputs() {
			if (!this.input) return false;
			// remove previous predictions
			this.closeLists();
			// get current inputed value
			this.value = this.input.value;
			if (!this.value) return false;
			let predcount = 0;
			// Create and add the container for suggestions
			const container = document.createElement("DIV");
			container.setAttribute("id", "autocomplete-list");
			container.setAttribute("class", "autocomplete-items");
			this.input.parentNode.appendChild(container);
			// Search for mathching values and add them to the prediction container
			if (this.value.length >= this.min_input) {
				for (let i = 0; i < this.players.length && predcount < this.max_pred; i++) {
					if (this.players[i].substr(0, this.value.length).toUpperCase() === this.value.toUpperCase()) {
						const sug = document.createElement("DIV");
						// making the allready typed character of prediction bold
						sug.innerHTML = "<strong>" + this.players[i].substr(0, this.value.length) + "</strong>";
						sug.innerHTML += this.players[i].substr(this.value.length);
						sug.innerHTML += "<input type='hidden' value='" + this.players[i] + "'>";
						// fill the input once a predition is clicked
						sug.addEventListener("click", function (){
							const inputval = (<HTMLInputElement>document.getElementById("searchuser"));
							if (inputval) inputval.value = this.querySelector("input").value;
							const x = document.getElementsByClassName("autocomplete-items");
							if (x) x.innerHTML = '';
						});
						container.appendChild(sug);
						predcount++;
					}
				}
			}
		},
		simpleEntry(event: any) {
			event.preventDefault();
			// Here is what happend once the desired value is posted
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
