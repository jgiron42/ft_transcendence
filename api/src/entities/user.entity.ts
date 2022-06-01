import { Entity, Column, PrimaryColumn } from "typeorm";
import { Exclude, Expose } from "class-transformer";

// this entity is use to describe the users

@Entity()
@Exclude()
export class User {
	@PrimaryColumn()
	@Expose({ toPlainOnly: true })
	id: string;

	// pseudo of the user
	@Column({ unique: true })
	@Expose() // class-transformer
	pseudo: string;

	// path to the avatar of the user
	@Column()
	@Expose() // class-transformer
	path_avatar: string;

	// number of game played by the user
	@Column()
	@Expose({ toPlainOnly: true }) // class-transformer
	nb_game: number;

	//  number of game played by the user
	@Column()
	@Expose({ toPlainOnly: true }) // class-transformer
	nb_win: number;

	// say if the user use OAuth or not
	@Column()
	@Expose({groups:['private']}) // class-transformer
	OAuth: boolean;

	// status of the user
	@Column()
	@Expose() // class-transformer
	status: number;

	// totp key of the user
	@Column({ length: 20 })
	@Expose({ toClassOnly: true }) // class-transformer
	totp_key: string;

	// date of registration of the user
	@Column()
	@Expose({ toPlainOnly: true }) // class-transformer
	date_register: Date;
}
