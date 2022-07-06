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
import { SessionGuard } from "@guards/session.guard";
import { DevelopmentGuard } from "@src/guards/development.guard";
import { Page } from "@utils/Page";
import { PerPage } from "@utils/PerPage";
import { TypeormErrorFilter } from "@filters/typeorm-error.filter";
import { PaginationInterceptor } from "@interceptors/pagination.interceptor";
import { PaginatedResponse } from "@src/types/paginated-response";
import { ChanConnection, ChannelRole } from "@entities/chan_connection.entity";
import { User } from "@entities/user.entity";
import { GetUser } from "@utils/get-user";

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
		@GetUser() user: User,
	): Promise<PaginatedResponse<Channel>> {
		return this.channelService.getQuery().see_channel(user.id).paginate(page, per_page).getManyAndCount();
	}

	/**
	 * return a channel if the user can see it
	 */
	@Get(":id")
	getOne(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<Channel> {
		return this.channelService.getQuery().see_channel(user.id).getOne(id);
	}

	/**
	 * create a channel
	 */
	@Post()
	@UsePipes(getValidationPipe(Channel))
	async create(@MyRequestPipe(...getPostPipeline(Channel)) channel: Channel, @GetUser() user: User) {
		channel.owner = user;
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
		@GetUser() user: User,
	) {
		if (channel.type === ChannelType.DM) throw new BadRequestException("use user/:id/dm to create a dm channel");
		if (channel.password) channel.password = await ChannelService.hashPassword(channel.password);
		await this.channelService.getQuery().own_channel(user.id).update(channel, id);
	}

	/**
	 * delete a channel if the user is the owner
	 */
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
		return this.channelService.getQuery().own_channel(user.id).remove(id);
	}

	/**
	 * return all chan_connection from a channel if the user is on this channel
	 */
	@Get(":id/chan_connections")
	async getConnections(
		@Param("id", ParseIntPipe) id: number,
		@Page() page: number,
		@PerPage() per_page: number,
		@GetUser() user: User,
	): Promise<PaginatedResponse<ChanConnection>> {
		return await this.chanConnectionService
			.getQuery()
			.see_connection(user.id)
			.channel(id)
			.paginate(page, per_page)
			.getManyAndCount();
	}

	@Post(":id/join")
	@UseGuards(DevelopmentGuard)
	async joinChannel(
		@Param("id", ParseIntPipe) id: number,
		@GetUser() user: User,
		@Query("password") password: string,
	): Promise<object> {
		const channel = await this.channelService.getQuery().see_channel(user.id).getOneOrFail(id);
		const existing = await this.chanConnectionService.getQuery().channel(id).user(user.id).getOne();
		if (existing) return existing;
		if (channel.type === ChannelType.PASSWORD) await ChannelService.checkPassword(password, channel.password);
		return this.chanConnectionService.create({ user, channel });
	}

	/**
	 * return all messages from a channel if the user is on this channel
	 */
	@Get(":id/messages")
	async getMessage(
		@Param("id", ParseIntPipe) id: number,
		@Page() page: number,
		@PerPage() per_page: number,
		@GetUser() user: User,
	): Promise<PaginatedResponse<Message>> {
		return await this.messageService
			.getQuery()
			.see_message(user.id)
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
		@GetUser() user: User,
	): Promise<object> {
		message.channel = await this.channelService.getQuery().on_channel(user.id).getOneOrFail(id);
		message.user = user;
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
		@GetUser() user: User,
	): Promise<object> {
		await this.channelService.getQuery().on_channel(user.id).getOneOrFail(id);
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
		@GetUser() user: User,
	): Promise<object> {
		chanInvitation.invited_by = user;
		chanInvitation.channel = await this.channelService.getQuery().on_channel(user.id).getOneOrFail(id);
		return this.chanInvitationService.create(chanInvitation);
	}

	/**
	 * create an invitation for a channel if the user is on this channel
	 */
	@Post(":chan_id/invite/:user_id")
	@UsePipes(getValidationPipe(ChanInvitation))
	async invite(
		@Param("chan_id", ParseIntPipe) chanId: number,
		@Param("user_id") userId: string,
		@GetUser() user: User,
	): Promise<object> {
		return this.chanInvitationService.create({
			user: { id: userId },
			channel: await this.channelService.getQuery().on_channel(user.id).getOneOrFail(chanId),
			invited_by: user,
		});
	}

	/**
	 * create an invitation for a channel if the user is on this channel
	 */
	@Post(":chan_id/ban/:user_id")
	@UsePipes(getValidationPipe(ChanInvitation))
	async ban(
		@Param("chan_id", ParseIntPipe) chanId: number,
		@Param("user_id") userId: string,
		@GetUser() user: User,
	): Promise<void> {
		await this.chanConnectionService
			.getQuery()
			.connection_chan_admin(user.id)
			.channel(chanId)
			.user(userId)
			.update({ role: ChannelRole.BANNED });
	}
}
