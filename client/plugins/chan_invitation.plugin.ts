import Vue from "vue";
import { store } from "@/store";
import { ChanInvitation } from "@/models/ChanInvitation";
import { ChanConnection } from "@/models/ChanConnection";

export class ChanInvitationPlugin extends Vue {
	async getChanInvitations(): Promise<Array<ChanInvitation> | undefined> {
		let ret: Array<ChanInvitation> | undefined;
		await this.api.get("/invitations", { page: 1, per_page: 100 }, (r: { data: ChanInvitation[] }) => {
			const invitations = [] as ChanInvitation[];
			r.data.forEach((invitation: ChanInvitation) => {
				if (invitation.invited_by.id !== store.chat.me.id) {
					invitations.push(invitation);
				}
			});
			ret = invitations;
			store.chat.updateChanInvitations(invitations);
		});
		return ret;
	}

	async acceptChanInvitation(invitation: ChanInvitation): Promise<ChanConnection | undefined> {
		let ret;
		await this.api.post(
			`/invitations/${invitation.id}/accept`,
			undefined,
			undefined,
			(r: { data: ChanConnection }) => {
				ret = r.data;
				this.chat.channel.joinChannel(ret.channel);
				store.chat.removeChanInvitation(invitation);
			},
		);
		return ret;
	}

	async declineChanInvitation(invitation: ChanInvitation): Promise<void> {
		await this.api.delete(`/invitations/${invitation.id}`, undefined, () => {
			store.chat.removeChanInvitation(invitation);
		});
	}

	async getInvitation(id: number): Promise<ChanInvitation | undefined> {
		let ret;
		await this.api.get(`/invitations/${id}`, undefined, (r: { data: ChanInvitation }) => {
			store.chat.pushChanInvitation(r.data);
			ret = r.data;
		});
		return ret;
	}
}
