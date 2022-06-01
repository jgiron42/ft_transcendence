import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import {Exclude, Expose} from "class-transformer";
import {Validate} from "class-validator";
import {UserExistsRule} from "@src/validators/userExist.validator";
import {setFinalType, setService} from "@utils/setFinalType.decorator";
import {UserService} from "@services/user.service";

// entity use to describe the channel

@Entity()
@Exclude() // class-transformer
export class Channel {
	constructor() {
		this.chat_type = 0;
		this.owner = new User();
	}
	@PrimaryGeneratedColumn()
	@Expose({ toPlainOnly: true })
	id: number;

	// name of the channel
	@Column()
	@Expose() // class-transformer
	name: string;

	// type of channel
	@Column()
	@Expose() // class-transformer
	chat_type: number;

	// password to access to the channnel
	@Column()
	@Expose({toClassOnly: true}) // class-transformer
	mdp: string;

	// owner  (and creator) of the channel
	@ManyToOne(() => User, (owner) => owner.id, {eager: true})
	@Expose() // class-transformer
	@Validate(UserExistsRule) // class-validator
	@setFinalType(User)
	@setService(UserService)
	owner: User | string;
}
