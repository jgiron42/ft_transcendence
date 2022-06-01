import {
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
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
// import { SessionGuard } from "@guards/session.guard";
import { ChannelService } from "@services/channel.service";
import { ChanConnectionService } from "@services/chan_connection.service";
import { MessageService } from "@services/message.service";
import { ChanInvitationService } from "@services/chan_invitation.service";
import {Channel} from "@entities/channel.entity";
import {RequestPipeDecorator} from "@utils/requestPipeDecorator";
import {EditResourcePipe} from "@pipes/edit-resource-pipe.service";
import {getValidationPipe} from "@utils/getValidationPipe";
import {getPostPipe} from "@utils/getPostPipe";

@Controller("channels")
// @UseGuards(...SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
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
	getOne(@Param("id") id: string): Promise<object> {
		return this.channelService.findOne(id);
	}

	/**
	 * create a channel
	 * @param channel
	 */
	@Post()
	@UsePipes(getValidationPipe(Channel))
	create(@RequestPipeDecorator(...getPostPipe(Channel)) channel:Channel): Promise<object> {
		return this.channelService.create(channel);
	}

	/**
	 * update a channel if the user is the owner
	 * @param _id
	 * @param _update
	 */
	@UseGuards(ChannelExistGuard, ChannelOwnerGuard)
	@Put(":id")
	update(@RequestPipeDecorator(new EditResourcePipe(Channel, ChannelService)) channel: Channel): Promise<object> {
		return this.channelService.create(channel);
	}

	/**
	 * delete a channel if the user is the owner
	 * @param id
	 */
	@Delete(":id")
	@UseGuards(ChannelExistGuard, ChannelOwnerGuard)
	remove(@Param("id") id: string): Promise<void> {
		return this.channelService.remove(id);
	}

	/**
	 * return all chan_connection from a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/chan_connections")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getConnections(@Param("id") id: number): Promise<object> {
		return this.chanConnectionService.findByChannel(id);
	}

	/**
	 * return all messages from a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/messages")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getMessage(@Param("id") id: number): Promise<object> {
		return this.messageService.findByChannel(id);
	}

	/**
	 * resend a message to a channel if the user is on this channel
	 * @param _id
	 */
	@Post(":id/messages")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	sendMessage(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * return all invitations for a channel if the user is on this channel
	 * @param id
	 */
	@Get(":id/invitations")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getInvitation(@Param("id") id: number): Promise<object> {
		return this.chanInvitationService.findByChannel(id);
	}

	/**
	 * create an invitation for a channel if the user is on this channel
	 * @param _id
	 */
	@Post(":id/invitations")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	sendInvitations(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}