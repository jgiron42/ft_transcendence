import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

@Entity()
export class Relation {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user_one) => user_one.id)
	user_one: User;

	@ManyToOne(() => User, (user_two) => user_two.id)
	user_two: User;

	@Column()
	relation_type: number;
}
