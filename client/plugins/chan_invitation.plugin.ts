import Vue from "vue";
import { chatStore } from "@/store";
import { ChanInvitation } from "@/models/ChanInvitation";

export default class ChanInvitationPlugin extends Vue {
	async getChanInvitations(): Promise<Array<ChanInvitation> | undefined> {
		let ret: Array<ChanInvitation> | undefined;
		await this.api.get("/invitations", { page: 1, per_page: 100 }, (r: { data: ChanInvitation[] }) => {
			const invitations = [] as ChanInvitation[];
			r.data.forEach((invitation: ChanInvitation) => {
				invitations.push(invitation);
			});
			ret = invitations;
			chatStore.updateChanInvitations(invitations);
		});
		return ret;
	}
}
