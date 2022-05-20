import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ChannelOwnerGuard } from "@src/guards/channel-owner.guard";
import { IsOnChannelGuard } from "@guards/is-on-channel.guard";
import { ChannelExistGuard } from "@guards/channel-exist.guard";
import { ChannelVisibleGuard } from "@src/guards/channel-visible.guard";

@Controller("channels")
export class ChannelsController {
	/**
	 * return all channels visible by the user
	 */
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * return a channel if the user can see it
	 * @param _id
	 */
	@Get(":id")
	@UseGuards(ChannelExistGuard, ChannelVisibleGuard)
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * create a channel
	 * @param _channel
	 */
	@Post()
	create(@Body() _channel: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * update a channel if the user is the owner
	 * @param _id
	 * @param _update
	 */
	@UseGuards(ChannelExistGuard, ChannelOwnerGuard)
	@Put(":id")
	update(@Param("id") _id: string, @Body() _update: any): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * delete a channel if the user is the owner
	 * @param _id
	 */
	@Delete(":id")
	@UseGuards(ChannelExistGuard, ChannelOwnerGuard)
	remove(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * return all chan_connection from a channel if the user is on this channel
	 * @param _id
	 */
	@Get(":id/chan_connections")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getConnections(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	/**
	 * return all messages from a channel if the user is on this channel
	 * @param _id
	 */
	@Get(":id/messages")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getMessage(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
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
	 * @param _id
	 */
	@Get(":id/invitations")
	@UseGuards(ChannelExistGuard, IsOnChannelGuard)
	getInvitation(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
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
