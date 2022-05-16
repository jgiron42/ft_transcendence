import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	chat_type: number;

	@Column()
	mdp: string;

	@ManyToOne(() => User, (owner) => owner.id)
	owner: User;
}
