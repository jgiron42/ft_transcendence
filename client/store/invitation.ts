import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { ChanInvitation } from "@/models/ChanInvitation";
import { store } from "@/store";

export interface IInvitationStore {
	chanInvitations: ChanInvitation[]; // list of channel invitations
}

@Module({ stateFactory: true, namespaced: true, name: "invitation" })
export default class InvitationStore extends VuexModule implements IInvitationStore {
	public chanInvitations: ChanInvitation[] = [];

	// Mutation used to set the channel invitations
	@Mutation
	setInvitations(invitations: ChanInvitation[]) {
		this.chanInvitations = invitations;
	}

	// Mutation used to push a channel invitation or update it if needed
	@Mutation
	pushInvitation(invitation: ChanInvitation) {
		const index = this.chanInvitations.findIndex((r) => r.id === invitation.id);

		// check if connections already exists, if so update it instead of pushing it
		if (index !== -1) this.chanInvitations.splice(index, 1, invitation);
		else this.chanInvitations.push(invitation);
	}

	// Mutation used when retrieving invitations from the api
	@Mutation
	pushFront(invitations: ChanInvitation[]) {
		this.chanInvitations = invitations.concat(this.chanInvitations);
	}

	// Mutation used to remove a channel invitation
	@Mutation
	removeInvitation(invitation: ChanInvitation) {
		this.chanInvitations = this.chanInvitations.filter((m) => m.id !== invitation.id);
	}

	// Action used to retrieve all the channel invitations
	@Action
	async retrieveInvitations(page = 1) {
		// if retrieving the first page, clear the list
		if (page === 1) this.setInvitations([]);

		await window.$nuxt.$axios
			.get("/invitations", { params: { page, per_page: 100 } })
			.then((response) => {
				// push only the invitations the user didn't send
				const invitations: ChanInvitation[] = response.data;

				// check if invitations is not empty
				if (invitations.length === undefined) return;

				this.pushFront(invitations.filter((invitation) => invitation.invited_by.id !== store.user.me.id));

				// if there are more invitations, retrieve them
				if (invitations.length === 100) this.retrieveInvitations(page + 1);
			})
			// if catch some error, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "An error occured while retrieving invitations",
				});
			});
	}

	// Action to retrieve a channel invitation by id
	@Action
	async retrieveInvitation(id: number) {
		await window.$nuxt.$axios
			.get(`/invitations/${id}`)
			.then((response) => {
				// ensure the response is valid
				this.pushInvitation(response.data);
			})
			// if catch some error, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "An error occured while retrieving invitation",
				});
			});
	}

	// Action to accept a channel invitation
	@Action
	async acceptInvitation(invitation: ChanInvitation) {
		await window.$nuxt.$axios
			.post(`/invitations/${invitation.id}/accept`)
			.then((response) => {
				// join channel and remove invitation
				store.channel.joinChannel(response.data.channel);
				this.removeInvitation(invitation);
			})
			// if catch some error, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "An error occured while accepting invitation",
				});
			});
	}

	// Action to decline a channel invitation
	@Action
	async declineInvitation(invitation: ChanInvitation) {
		await window.$nuxt.$axios
			.delete(`/invitations/${invitation.id}`)
			.then(() => {
				// remove invitation
				this.removeInvitation(invitation);
			})
			// if catch some error, add an alert
			.catch(() => {
				window.$nuxt.$emit("addAlert", {
					title: "Error:",
					message: "An error occured while declining invitation",
				});
			});
	}
}
