import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { ChannelOwnerGuard } from "@src/guards/channel-owner.guard";
import { IsOnChannelGuard } from "@guards/is-on-channel.guard";
import { ChannelExistGuard } from "@guards/channel-exist.guard";
import { ChannelVisibleGuard } from "@src/guards/channel-visible.guard";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { MessageService } from "@services/message.service";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { Channel } from "@entities/channel.entity";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getValidationPipe } from "@utils/getValidationPipe";
import { getPostPipeline } from "@utils/getPostPipeline";
import { Message } from "@src/entities/message.entity";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { getPutPipeline } from "@utils/getPutPipeline";
import { Container } from "typedi";
import { MapGroupInterceptor } from "@interceptors/map-group.interceptor";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Request } from "@src/types/request";
// import { SessionGuard } from "@guards/session.guard";

@Controller("channels")
// @UseGuards(...SessionGuard)
@UseInterceptors(
	CrudFilterInterceptor,
	new MapGroupInterceptor("on_channel", async (req: Request<Channel>) => {
		const service = Container.get(ChanConnectionService);
		const id = Number(req.params.id);
		if (!Number.isSafeInteger(id)) return false;
		return await service.isOnChannel(req.user.id, id);
	}),
	new MapGroupInterceptor("see_channel", (req: Request<Channel>) => {
		void req;
		return true; // TODO: channel type
	}),
	new MapGroupInterceptor("channel_owner", async (req: Request<Channel>) => {
		const service = Container.get(ChannelService);
		const id = Number(req.params.id);
		if (!Number.isSafeInteger(id)) return false;
		return req.user.id && (await service.findOne(id))?.owner === req.user.id;
	}),
)
export class ChannelsController {
	constructor(
		private channelService: ChannelService,
		private chanConnectionService: ChanConnectionService,
		private messageService: MessageService,
		private chanInvitationService: ChanInvitationService,
	) {}
	/**
	 * return all channels visible by the user
	 */
	@Get()
	getAll(): Promise<object> {
		return this.channelService.findAll();
	}

	/**
	 * return a channel if the user can see it
	 * @param id
	 */
	@Get(":id")
	@UseGuards(ChannelVisibleGuard)
	getOne(@Param("id", ParseIntPipe) id: number): Promise<object> {
		return this.channelService.findOne(id);
	}

	/**
	 * create a channel
	 * @param channel
	 */
	@Post()
	@UsePipes(getValidationPipe(Channel))
	create(@MyRequestPipe(...getPostPipeline(Channel)) channel: Channel): Promise<object> {
		return this.channelService.create(channel);
	}

	/**
	 * update a channel if the user is the owner
	 * @param channel
	 * @param id the channel id
	 */
	@UseGuards(ChannelExistGuard, ChannelOwnerGuard)
	@Put(":id")
	update(
		@Param("id", ParseIntPipe) id: number,
		@MyRequestPipe(...getPutPipeline(Channel, ChannelService)) channel: Channel,
	): Promise<object> {
		void id;
		return this.channelService.create(channel);
	}

	/**
	 * delete a channel if the user is the owner
	 * @param id
	 */
	@Delete(":id")
	@UseGuards(ChannelExistGuard, ChannelOwnerGuard)
	remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
		return this.channelService.remove(id);
	}

	/**
	 * return all chan_connection from a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/chan_connections")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getConnections(@Param("id", ParseIntPipe) id: number): Promise<object> {
		return this.chanConnectionService.findByChannel(id);
	}

	/**
	 * return all messages from a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/messages")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getMessage(@Param("id", ParseIntPipe) id: number): Promise<object> {
		return this.messageService.findByChannel(id);
	}

	/**
	 * resend a message to a channel if the user is on this channel
	 * @param id
	 * @param message
	 */
	@Post(":id/messages")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	@UsePipes(getValidationPipe(Message))
	async sendMessage(
		@MyRequestPipe(...getPostPipeline(Message)) message: Message,
		@Param("id", ParseIntPipe) id: number,
	): Promise<object> {
		message.dest_channel = await this.channelService.findOne(id);
		return this.messageService.create(message);
	}

	/**
	 * return all invitations for a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/invitations")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getInvitation(@Param("id", ParseIntPipe) id: number): Promise<object> {
		return this.chanInvitationService.findByChannel(id);
	}

	/**
	 * create an invitation for a channel if the user is on this channel
	 * @param id
	 * @param chanInvitation
	 */
	@Post(":id/invitations")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	@UsePipes(getValidationPipe(ChanInvitation))
	async sendInvitations(
		@MyRequestPipe(...getPostPipeline(ChanInvitation)) chanInvitation: ChanInvitation,
		@Param("id", ParseIntPipe) id: number,
	): Promise<object> {
		chanInvitation.invite_where = await this.channelService.findOne(id);
		return this.chanInvitationService.create(chanInvitation);
	}
}
