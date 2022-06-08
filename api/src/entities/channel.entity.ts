import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Exclude } from "class-transformer";
import { Validate } from "class-validator";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// entity use to describe the channel

@Entity()
@Exclude() // class-transformer
export class Channel {
	constructor() {
		this.chat_type = 0;
		this.owner = new User();
	}
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// name of the channel
	@Column()
	@SetMode("rw")
	name: string;

	// type of channel
	@Column()
	@SetMode("rw")
	chat_type: number;

	// password to access to the channnel
	@Column()
	@SetMode("rw")
	mdp: string;

	// owner  (and creator) of the channel
	@ManyToOne(() => User, (owner) => owner.id, { eager: true })
	@Validate(UserExistsRule) // class-validator
	@setService(UserService)
	@SetMode("rw")
	owner: User | string;
}
