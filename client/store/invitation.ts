import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { ChanInvitation } from "@/models/ChanInvitation";
import { ChanConnection } from "@/models/ChanConnection";
import { store } from "@/store";

export interface IInvitationStore {
	chanInvitations: Array<ChanInvitation>;
}

@Module({ stateFactory: true, namespaced: true, name: "invitation" })
export default class InvitationStore extends VuexModule implements IInvitationStore {
	public chanInvitations: ChanInvitation[] = [];

	@Mutation
	setInvitations(invitations: ChanInvitation[]) {
		this.chanInvitations = invitations;
	}

	@Mutation
	async pushInvitation(invitation: ChanInvitation) {
		const index = this.chanInvitations.findIndex((r) => r.id === invitation.id);
		if (index !== -1) {
			await this.chanInvitations.splice(index, 1, invitation);
		} else {
			await this.chanInvitations.push(invitation);
		}
	}

	@Mutation
	removeInvitation(invitation: ChanInvitation) {
		this.chanInvitations = this.chanInvitations.filter((m) => m.id !== invitation.id);
	}

	@Action
	async retrieveInvitations() {
		await Vue.prototype.api.get("/invitations", { page: 1, per_page: 100 }, (r: { data: ChanInvitation[] }) => {
			const invitations = [] as ChanInvitation[];
			r.data.forEach(async (invitation: ChanInvitation) => {
				if (invitation.invited_by.id !== store.chat.me.id) {
					await invitations.push(invitation);
				}
			});
			this.setInvitations(invitations);
		});
	}

	@Action
	async retrieveInvitation(id: number) {
		await Vue.prototype.api.get(`/invitations/${id}`, {}, async (r: { data: ChanInvitation }) => {
			await this.pushInvitation(r.data);
		});
	}

	@Action
	async acceptInvitation(invitation: ChanInvitation) {
		await Vue.prototype.api.post(
			`/invitations/${invitation.id}/accept`,
			{},
			{},
			async (r: { data: ChanConnection }) => {
				store.channel.joinChannel(r.data.channel);
				await this.removeInvitation(invitation);
			},
		);
	}

	@Action
	async declineInvitation(invitation: ChanInvitation) {
		await Vue.prototype.api.delete(`/invitations/${invitation.id}`, {}, async () => {
			await this.removeInvitation(invitation);
		});
	}
}
