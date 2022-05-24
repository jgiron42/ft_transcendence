import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";

// this entity is use to know the relation between the user

@Entity()
export class Relation {
	@PrimaryGeneratedColumn()
	id: number;

	// user one is the user who owned the relation
	@ManyToOne(() => User, (user_one) => user_one.id)
	user_one: User;

	// user two is the user which the user one have a relation
	@ManyToOne(() => User, (user_two) => user_two.id)
	user_two: User;

	// type of relation
	@Column()
	relation_type: number;
}
