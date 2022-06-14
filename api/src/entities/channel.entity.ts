import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

// entity use to describe the channel

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	// name of the channel
	@Column()
	name: string;

	// type of channel
	@Column()
	type: number;

	// password to access to the channnel
	@Column()
	password: string;

	// owner  (and creator) of the channel
	@ManyToOne(() => User, (owner) => owner.id)
	owner: User;

	// date of the message
	@Column()
	created_at: Date;
}
