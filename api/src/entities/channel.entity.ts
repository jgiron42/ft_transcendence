import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Validate } from "class-validator";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// entity use to describe the channel

@Entity()
export class Channel {
	constructor() {
		this.chat_type = 0;
		this.owner = new User();
	}
	@PrimaryGeneratedColumn()
	@SetMode([["see_channel", "r"]])
	id: number;

	// name of the channel
	@Column()
	@SetMode([
		["channel_owner", "cru"],
		["see_channel", "r"],
	])
	name: string;

	// type of channel
	@Column()
	@SetMode([
		["channel_owner", "cru"],
		["see_channel", "r"],
	])
	chat_type: number;

	// password to access to the channnel
	@Column()
	@SetMode([["channel_owner", "cu"]])
	mdp: string;

	// owner  (and creator) of the channel
	@ManyToOne(() => User, (owner) => owner.id, { eager: true })
	@Validate(UserExistsRule) // class-validator
	@setService(UserService)
	@SetMode([
		["channel_owner", "cru"],
		["see_channel", "r"],
	])
	owner: User | string;
}
