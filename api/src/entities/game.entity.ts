import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import { Validate } from "class-validator";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// this entity is use to stock all the game

@Entity()
export class Game {
	constructor() {
		this.score_second_player = 0;
		this.score_first_player = 0;
		this.first_player = new User();
		this.second_player = new User();
		this.status = false;
		this.type = 0;
		this.date = new Date();
	}

	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// first player id
	@Validate(UserExistsRule) // class-validator
	@ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	first_player: User | string;

	// second player id
	@Validate(UserExistsRule)
	@ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	second_player: User | string;

	second_playerId: string;

	// score of the first player
	@Column()
	@SetMode("r")
	score_first_player: number;

	// score of the second player
	@Column()
	@SetMode("r")
	score_second_player: number;

	// winner of the game
	@ManyToOne(() => User, (winner) => winner.id, { eager: true, onDelete: "CASCADE" })
	@SetMode("r")
	winner: User | string;

	// type of game
	@Column()
	@SetMode("cr")
	type: number;

	// status of the game
	@Column()
	@SetMode("r")
	status: boolean;

	// date begin of game
	@Column()
	@SetMode("r")
	date: Date;
}
