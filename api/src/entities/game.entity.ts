import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "@entities/user.entity";
import { Validate } from "class-validator";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// this entity is use to stock all the game

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// first player id
	@Validate(UserExistsRule) // class-validator
	@ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	user_one: User | string;

	// second player id
	@Validate(UserExistsRule)
	@ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	user_two: User | string;

	// score of the first player
	@Column({ default: 0 })
	@SetMode("r")
	score_first_player: number;

	// score of the second player
	@Column({ default: 0 })
	@SetMode("r")
	score_second_player: number;

	// type of game
	@Column({ default: 0 })
	@SetMode("cr")
	type: number;

	// status of the game
	@Column({ default: false })
	@SetMode("r")
	finished: boolean;

	// date begin of game
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
