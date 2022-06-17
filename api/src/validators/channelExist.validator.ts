import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface, ValidatorConstraint } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "@src/entities/channel.entity";

/**
 * validator for user object, return true if the user exist else throw a bad request exception
 */
@ValidatorConstraint({ name: "ChannelExist", async: true })
@Injectable()
export class ChannelExistRule implements ValidatorConstraintInterface {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
	) {}

	async validate(value: number) {
		try {
			await this.channelRepository.findOneByOrFail({ id: value });
		} catch (e) {
			return false;
		}
		return true;
	}
	defaultMessage() {
		return `Channel doesn't exist`;
	}
}
