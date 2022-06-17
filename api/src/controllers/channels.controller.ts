import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { ChannelExistGuard } from "@guards/channel-exist.guard";
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
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Request } from "@src/types/request";
import { Groups } from "@utils/groupsDecorator";
import { SessionGuard } from "@guards/session.guard";
import { Response } from "express";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { QueryFailedFilter } from "@filters/query-failed.filter";
import { EntityNotFoundFilter } from "@filters/entity-not-found.filter";

@Controller("channels")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
@UseFilters(QueryFailedFilter, EntityNotFoundFilter)
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
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	): Promise<object> {
		const [ret, total] = await this.channelService
			.getQuery()
			.see_channel(req.user.id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * return a channel if the user can see it
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<object> {
		return this.channelService.getQuery().see_channel(req.user.id).getOne(id);
	}

	/**
	 * create a channel
	 */
	@Post()
	@UsePipes(getValidationPipe(Channel))
	create(@MyRequestPipe(...getPostPipeline(Channel)) channel: Channel, @Req() req: Request) {
		channel.owner = req.user;
		return this.channelService.create(channel);
	}

	/**
	 * update a channel if the user is the owner
	 */
	@Put(":id")
	update(
		@Param("id", ParseIntPipe) id: number,
		@MyRequestPipe(...getPutPipeline(Channel)) channel: Channel,
		@Req() req: Request,
	): Promise<object> {
		return this.channelService.getQuery().own_channel(req.user.id).update(id, channel);
	}

	/**
	 * delete a channel if the user is the owner
	 */
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		return this.channelService.getQuery().own_channel(req.user.id).remove(id);
	}

	/**
	 * return all chan_connection from a channel if the user is on this channel
	 */
	@Get(":id/chan_connections")
	async getConnections(
		@Param("id", ParseIntPipe) id: number,
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	): Promise<object> {
		const [ret, total] = await this.chanConnectionService
			.getQuery()
			.see_connection(req.user.id)
			.channel(id)
			.paginate(page, per_page)
			.getManyAndCount();
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	@Post(":id/join")
	@UseGuards(DevelopmentGuard)
	async joinChannel(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<object> {
		await this.channelService.getQuery().see_channel(req.user.id).getOneOrFail(id);
		// TODO: password protect
		return this.chanConnectionService.create({ user_id: req.user, chan_id: await this.channelService.findOne(id) });
	}

	/**
	 * return all messages from a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/messages")
	@UseGuards(ChannelExistGuard)
	@Groups("on_channel")
	getMessage(@Param("id", ParseIntPipe) id: number): Promise<object> {
		return this.messageService.findByChannel(id);
	}

	/**
	 * resend a message to a channel if the user is on this channel
	 * @param id
	 * @param message
	 */
	@Post(":id/messages")
	@UseGuards(ChannelExistGuard)
	@Groups("on_channel")
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
	 */
	@Get(":id/invitations")
	@Groups("on_channel")
	async getInvitation(
		@Param("id", ParseIntPipe) id: number,
		@Page() page: number,
		@PerPage() per_page: number,
		@Res({ passthrough: true }) res: Response,
	): Promise<object> {
		const [ret, total] = await this.chanInvitationService.findByChannelAndCount(id, page, per_page);
		res.setHeader("total_entities", total);
		res.setHeader("total_pages", Math.ceil(total / per_page));
		return ret;
	}

	/**
	 * create an invitation for a channel if the user is on this channel
	 * @param id
	 * @param chanInvitation
	 */
	@Post(":id/invitations")
	@UseGuards(ChannelExistGuard)
	@Groups("on_channel")
	@UsePipes(getValidationPipe(ChanInvitation))
	async sendInvitations(
		@MyRequestPipe(...getPostPipeline(ChanInvitation)) chanInvitation: ChanInvitation,
		@Param("id", ParseIntPipe) id: number,
	): Promise<object> {
		chanInvitation.invite_where = await this.channelService.findOne(id);
		return this.chanInvitationService.create(chanInvitation);
	}
}
