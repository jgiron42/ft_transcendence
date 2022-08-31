import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Check } from "typeorm";
import { User } from "@entities/user.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

// this entity is use to stock all the game

@Entity()
@Check('"userOneId" <> "userTwoId"')
export class Game {
	constructor() {
		this.score_second_player = 0;
		this.score_first_player = 0;
		this.user_one = new User();
		this.user_two = new User();
		this.finished = false;
		this.type = "none";
		this.created_at = new Date();
	}

	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// first player id
	@ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	user_one: User | string;

	// second player id
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
	type: string;

	// status of the game
	@Column({ default: false })
	@SetMode("r")
	finished: boolean;

	// date begin of game
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
