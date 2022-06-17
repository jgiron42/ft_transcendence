import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// this entity is use to know the relation between the user

@Entity()
export class Relation {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// user one is the user who owned the relation
	@ManyToOne(() => User, (user_one) => user_one.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	user_one: User | string;

	// user two is the user which the user one have a relation
	@ManyToOne(() => User, (user_two) => user_two.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	user_two: User | string;

	// type of relation
	@Column()
	@SetMode("cr")
	relation_type: number;
}
