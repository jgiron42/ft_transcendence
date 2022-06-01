import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "@entities/user.entity";
import {Allow, Validate} from "class-validator";
// import { UserService } from "@services/user.service";
// import { MyTransform } from "@utils/transformClass";
// import {Transform} from "class-transformer";
import {UserExistsRule} from "@src/validators/userExist.validator";
import {Expose} from "class-transformer";
import {setService} from "@utils/setFinalType.decorator";
import {UserService} from "@services/user.service";

// this entity is use to stock all the game

@Entity()
export class Game {
	constructor() {
		this.score_second_player = 0;
		this.score_first_player = 0;
		this.first_player = new User();
		this.second_player = new User();
		this.status = false;
		this.date = new Date();
	}

	@PrimaryGeneratedColumn()
	id: number;

	// first player id
	// @Transform(UserService.findOne, {toClassOnly: true}) // class-transformer
	@Validate(UserExistsRule)
	@Expose()
	@ManyToOne(() => User, (user) => user.id, { eager: true })
	@setService(UserService)
	first_player: User | string;

	// second player id
	// @Transform(UserService.findOne, {toClassOnly: true}) // class-transformer
	@Validate(UserExistsRule)
	@Expose()
	@ManyToOne(() => User, (user) => user.id, { eager: true })
	@setService(UserService)
	second_player: User | string;

	// score of the first player
	@Column()
	score_first_player: number;

	// score of the second player
	@Column()
	score_second_player: number;

	// winner of the game
	@ManyToOne(() => User, (winner) => winner.id, { nullable: true })
	winner: User;

	// type of game
	@Column()
	@Allow() // class-validator
	@Expose()
	type: number;

	// status of the game
	@Column()
	status: boolean;

	// date begin of game
	@Column()
	date: Date;
}
