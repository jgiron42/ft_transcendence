import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

// entity use to describe the channel

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	// name of the channel
	@Column({ unique: true })
	name: string;

	// type of channel
	@Column()
	chat_type: number;

	// password to access to the channnel
	@Column()
	mdp: string;

	// owner  (and creator) of the channel
	@ManyToOne(() => User, (owner) => owner.id)
	owner: User;

	constructor(name: string, owner: User, chat_type = 0, mdp = "") {
		this.name = name;
		this.owner = owner;
		this.chat_type = chat_type;
		this.mdp = mdp;
	}
}
