import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Validate } from "class-validator";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// entity use to describe the channel

export enum ChannelType {
	PUBLIC,
	PASSWORD,
	PRIVATE,
	DM,
}

@Entity()
export class Channel {
	constructor() {
		this.type = ChannelType.PUBLIC;
		this.password = "";
		this.created_at = new Date();
	}
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// name of the channel
	@Column({ unique: true })
	@SetMode("cru")
	name: string;

	// type of channel
	@Column({
		type: "enum",
		enum: ChannelType,
	})
	@SetMode("cru")
	type: ChannelType;

	// password to access to the channnel
	@Column()
	@SetMode("cu")
	password: string;

	// owner  (and creator) of the channel
	@ManyToOne(() => User, (owner) => owner.id, { eager: true, onDelete: "CASCADE", nullable: true })
	@Validate(UserExistsRule) // class-validator
	@setService(UserService)
	@SetMode("ru")
	owner: User | string;

	// date of the message
	@Column()
	created_at: Date;
}
