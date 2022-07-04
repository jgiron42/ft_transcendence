import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	Req,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { MessageService } from "@services/message.service";
import { ChanInvitationService } from "@services/chan_invitation.service";
import { Channel, ChannelType } from "@entities/channel.entity";
import { MyRequestPipe } from "@utils/myRequestPipe";
import { getValidationPipe } from "@utils/getValidationPipe";
import { getPostPipeline } from "@utils/getPostPipeline";
import { Message } from "@src/entities/message.entity";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { getPutPipeline } from "@utils/getPutPipeline";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";
import { Request } from "@src/types/request";
import { SessionGuard } from "@guards/session.guard";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { PaginatedResponse } from "@src/types/paginated-response";
import { ChanConnection } from "@entities/chan_connection.entity";

@Controller("channels")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor, PaginationInterceptor)
@UseFilters(TypeormErrorFilter)
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
	@UseInterceptors(PaginationInterceptor)
	async getAll(
		@Page() page: number,
		@PerPage() per_page: number,
		@Req() req: Request,
	): Promise<PaginatedResponse<Channel>> {
		return this.channelService.getQuery().see_channel(req.user.id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * return a channel if the user can see it
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request): Promise<Channel> {
		return this.channelService.getQuery().see_channel(req.user.id).getOne(id);
	}

	/**
	 * create a channel
	 */
	@Post()
	@UsePipes(getValidationPipe(Channel))
	async create(@MyRequestPipe(...getPostPipeline(Channel)) channel: Channel, @Req() req: Request) {
		channel.owner = req.user;
		if (channel.type === ChannelType.DM) throw new BadRequestException("use user/:id/dm to create a dm channel");
		if (channel.type === ChannelType.PASSWORD)
			channel.password = await ChannelService.hashPassword(channel.password);
		return this.channelService.create(channel);
	}

	/**
	 * update a channel if the user is the owner
	 */
	@Put(":id")
	async update(
		@Param("id", ParseIntPipe) id: number,
		@MyRequestPipe(...getPutPipeline(Channel)) channel: Channel,
		@Req() req: Request,
	) {
		if (channel.type === ChannelType.DM) throw new BadRequestException("use user/:id/dm to create a dm channel");
		if (channel.password) channel.password = await ChannelService.hashPassword(channel.password);
		await this.channelService.getQuery().own_channel(req.user.id).update(id, channel);
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
		@Req() req: Request,
	): Promise<PaginatedResponse<ChanConnection>> {
		return await this.chanConnectionService
			.getQuery()
			.see_connection(req.user.id)
			.channel(id)
			.paginate(page, per_page)
			.getManyAndCount();
	}

	@Post(":id/join")
	@UseGuards(DevelopmentGuard)
	async joinChannel(
		@Param("id", ParseIntPipe) id: number,
		@Req() req: Request,
		@Query("password") password: string,
	): Promise<object> {
		const channel = await this.channelService.getQuery().see_channel(req.user.id).getOneOrFail(id);
		const existing = await this.chanConnectionService.getQuery().channel(id).user(req.user.id).getOne();
		if (existing) return existing;
		if (channel.type === ChannelType.PASSWORD) await ChannelService.checkPassword(password, channel.password);
		return this.chanConnectionService.create({ user: req.user, channel });
	}

	/**
	 * return all messages from a channel if the user is on this channel
	 */
	@Get(":id/messages")
	async getMessage(
		@Param("id", ParseIntPipe) id: number,
		@Page() page: number,
		@PerPage() per_page: number,
		@Req() req: Request,
	): Promise<PaginatedResponse<Message>> {
		return await this.messageService
			.getQuery()
			.see_message(req.user.id)
			.channel(id)
			.paginate(page, per_page)
			.getManyAndCount();
	}

	/**
	 * resend a message to a channel if the user is on this channel
	 */
	@Post(":id/messages")
	@UsePipes(getValidationPipe(Message))
	async sendMessage(
		@MyRequestPipe(...getPostPipeline(Message)) message: Message,
		@Param("id", ParseIntPipe) id: number,
		@Req() req: Request,
	): Promise<object> {
		message.channel = await this.channelService.getQuery().on_channel(req.user.id).getOneOrFail(id);
		return this.messageService.create(message);
	}

	/**
	 * return all invitations for a channel if the user is on this channel
	 */
	@Get(":id/invitations")
	async getInvitation(
		@Param("id", ParseIntPipe) id: number,
		@Page() page: number,
		@PerPage() per_page: number,
		@Req() req: Request,
	): Promise<object> {
		await this.channelService.getQuery().on_channel(req.user.id).getOneOrFail(id);
		return await this.chanInvitationService.getQuery().channel(id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * create an invitation for a channel if the user is on this channel
	 */
	@Post(":id/invitations")
	@UsePipes(getValidationPipe(ChanInvitation))
	async sendInvitations(
		@MyRequestPipe(...getPostPipeline(ChanInvitation)) chanInvitation: ChanInvitation,
		@Param("id", ParseIntPipe) id: number,
		@Req() req: Request,
	): Promise<object> {
		chanInvitation.invited_by = req.user;
		chanInvitation.channel = await this.channelService.getQuery().on_channel(req.user.id).getOneOrFail(id);
		return this.chanInvitationService.create(chanInvitation);
	}
}
