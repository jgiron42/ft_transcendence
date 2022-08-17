import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import config from "@src/config/game.config";
import { AllowedGameMode } from "@src/config/game.config";
import { Socket } from "@src/types/socket";
import { Interval } from "@nestjs/schedule";
import { User } from "@src/entities/user.entity";
import { UserService } from "@services/user.service";
import {
	ClientMatch,
	GameUser,
	GameUserPool,
	GameUserSet,
	Match,
	MatchmakingPool,
	MatchPool,
	UserMatchmakingStatus,
} from "@src/types/game";
import { Game } from "@src/entities/game.entity";
import { StoredGameService } from "./stored-game.service";

const timeBeforeCleaningGame = 5;

@Injectable()
export class GameService {
	private logger: Logger = new Logger("GameService");

	// Pool storing users that have at least one connected socket
	connectedPool: GameUserPool = new Map<string, GameUser>();

	// Pool storing fully disconnected users that had recently connected sockets
	disconnectedPool: GameUserPool = new Map<string, GameUser>();

	// Pool tracking users looking for a match
	matchmakingPool: MatchmakingPool = new Map<AllowedGameMode, GameUserSet>();

	// Pool storing all matches, regardless of their modes
	matchPool: MatchPool = new Map<string, Match>();

	constructor(private readonly userService: UserService, private readonly storedGameService: StoredGameService) {
		// Initialize all game mode pools
		config.gameModes.forEach((mode: AllowedGameMode) => {
			this.matchmakingPool.set(mode, new Set<GameUser>() as GameUserSet);
		});
	}

	disconnectClient(client: Socket) {
		if (this.connectedPool.has(client.session.user.id)) {
			// Get user from registered connected users pool.
			const foundUser: GameUser = this.connectedPool.get(client.session.user.id);

			// Remove disconnected socket.
			foundUser.sockets.delete(client);

			// Set the user in disconnected state when it's not connected anywhere anymore
			if (foundUser.sockets.size === 0) {
				// Initialize disconnected timer
				foundUser.lastSeenDate = Date.now();

				// Remove from connected users pool
				this.connectedPool.delete(foundUser.user.id);

				// Move to disconnected users pool.
				this.disconnectedPool.set(foundUser.user.id, foundUser);
			}
		}
	}

	connectClient(client: Socket, userID: string) {
		// Search user in disconnected pool
		if (this.disconnectedPool.has(userID)) {
			// Retrieve user from disconnected pool
			const foundDisconnectedUser = this.disconnectedPool.get(userID);

			// Register this socket to the client
			foundDisconnectedUser.sockets.add(client);

			// Remove the user from disconnected pool
			this.disconnectedPool.delete(userID);

			// Move the user back to the connected pool
			this.connectedPool.set(userID, foundDisconnectedUser);

			// Resume interrupted matchmaking
			if (foundDisconnectedUser.status === "matchmaking")
				this.matchmakingPool.get(foundDisconnectedUser.gameMode).add(foundDisconnectedUser);

			// All done.
			return;
		}

		// Search user in connected pool
		if (!this.connectedPool.has(userID)) {
			// User isn't stored anywhere, so create a new game user to register as connected
			const newGameUser: GameUser = {
				user: client.session.user,
				status: "connected",
				type: "user",
				match: null,
				searchStartDate: 0,
				lastSeenDate: 0,
				gameMode: config.gameModes[0],
				sockets: new Set<Socket>([client]),
			};

			// Add game user to pool
			this.connectedPool.set(userID, newGameUser);

			// All done
			return;
		}

		// User is already registered, so fetch it from connected users pool.
		const foundUser = this.connectedPool.get(userID);

		// Register this socket to the user
		foundUser.sockets.add(client);
	}

	addUserToMatchmakingPool(userID: string, mode: AllowedGameMode) {
		// Get user from connected users pool.
		const foundUser: GameUser = this.connectedPool.get(userID);

		// Ensure user is available.
		if (foundUser.status !== "connected") return;

		// Update user gamemode
		foundUser.gameMode = mode;

		// Mark the user as "looking for a game"
		foundUser.status = "matchmaking";

		// Initialize timer
		foundUser.searchStartDate = Date.now();

		// Register user in matchmaking pool
		this.matchmakingPool.get(foundUser.gameMode).add(foundUser);
	}

	removeUserFromMatchmakingPool(userID: string) {
		// Get user from connected users pool
		const foundUser: GameUser = this.connectedPool.get(userID);

		// Ensure user is looking for a game
		if (foundUser.status !== "matchmaking") return;

		// Restore status
		foundUser.status = "connected";

		// Remove user fro matchmaking pool
		this.matchmakingPool.get(foundUser.gameMode).delete(foundUser);
	}

	async matchUserToBot(userID: string, mode: AllowedGameMode) {
		// Get user from connected users pool.
		const foundUser: GameUser = this.connectedPool.get(userID);

		// Ensure user isn't already in a match
		if (foundUser.status === "game") return;

		// Update user game mode
		foundUser.gameMode = mode;

		// Fetch or create the bot user.
		const bot: User =
			(await this.userService.findOne("CrocuBot")) ||
			(await this.userService.create({
				id: "CrocuBot",
				username: "Kronku",
				nb_game: 0,
				nb_win: 0,
				totp_enabled: false,
				status: 0,
				totp_key: "",
				created_at: new Date(),
			}));

		// Match the bot and the player.
		this.matchUsers(foundUser, { user: bot, type: "bot", gameMode: foundUser.gameMode } as GameUser);
	}
	matchUsers(user1: GameUser, user2: GameUser) {
		// Set the gameID to a random UUID
		const gameID = randomUUID();

		// Create new match
		const newMatch = {
			user1,
			user2,
			status: "creating",
			id: gameID,
			created_at: Date.now(),
			mode: user1.gameMode,
			data: {
				score: {
					user1: 0,
					user2: 0,
				},
			},
		} as Match;

		// Add the Match to the ingoing game pool
		this.matchPool.set(gameID, newMatch);

		// Get pool corresponding to users selected game mode.
		const pool = this.matchmakingPool.get(user1.gameMode);

		[user1, user2].forEach((user: GameUser) => {
			// Delete participants from the matchmaking pool
			pool.delete(user);

			// Update player status
			user.status = "game";

			// Register the match in the user.
			user.match = newMatch;
		});

		// Debug logs
		this.logger.log(`Matched: ${user1.user.id} vs ${user2.user.id}`);
	}

	@Interval(1000)
	matchUsersJob() {
		// Handle every game mode pools
		this.matchmakingPool.forEach((pool: GameUserSet) => {
			// Ensure the pool has at least two users
			if (pool.size >= 2) {
				// Get first two users
				const [user1, user2] = pool;

				// Match first two users
				this.matchUsers(user1, user2);
			}
		});
	}

	@Interval(1000)
	debugPrintPools() {
		this.logger.log("----------------------------");
		this.logger.log(
			`[MATCHMAKING] Connected: ${JSON.stringify(
				Array.from(this.connectedPool.values()).map((user) => `${user.user.id}@${user.status}`),
			)}`,
		);
		this.matchmakingPool.forEach((pool: GameUserSet, poolName: AllowedGameMode) => {
			this.logger.log(
				`[MATCHMAKING] Matchmaking[${poolName}]: ${JSON.stringify(
					Array.from(pool).map((conUser: GameUser) => conUser.user.id),
				)}`,
			);
		});
		this.logger.log(
			`[MATCHMAKING] Matches: ${JSON.stringify(
				Array.from(this.matchPool.values()).map(
					(match: Match) => `${match.user1.user.id}-${match.user2.user.id}@${match.mode}`,
				),
			)}`,
		);
		this.logger.log(
			`[MATCHMAKING] Disconnected: ${JSON.stringify(
				Array.from(this.disconnectedPool.values()).map((user) => `${user.user.id}@${user.status}`),
			)}`,
		);
		this.logger.log("----------------------------");
	}

	// Return the number of users looking for a game.
	@Interval(500)
	updateConnectedUsers(): void {
		// TODO: Erase clients disconnected for too long
		// Send local user data back to every connected client
		this.connectedPool.forEach((localUser: GameUser) => {
			// Filter data sent to user
			const userStatus: UserMatchmakingStatus = {
				user: localUser.user,
				status: localUser.status as "connected" | "matchmaking" | "game",
				// Filter everything but ids in sent match.
				match: localUser.match
					? {
							id: localUser.match.id,
							self: localUser.user.id,
							oppponent:
								localUser.match.user1.user.id !== localUser.user.id
									? localUser.match.user1.user.id
									: localUser.match.user2.user.id,
					  }
					: null,
				// Filter everything but user ids in sent pool
				matchMakingPools: Object.fromEntries(
					Array.from(this.matchmakingPool.entries())
						.map(([key, userSet]: [string, GameUserSet]) => [
							key,
							Array.from(userSet).map((user: GameUser) => user.user.id),
						])
						.values(),
				) as Record<AllowedGameMode, string[]>,
				connectedPool: Array.from(this.connectedPool.keys()),
				searchDate: localUser.searchStartDate,
				availableGameModes: config.gameModes,
			};

			// Send update data to every user's sockets.
			this.broadcast(localUser, "matchmaking:updateStatus", userStatus);
		});
	}
	@Interval(5000)
	cleanDisconnectedUsers() {
		this.logger.log("[CLEAN]: Cleaning up disconnected users.");
		this.disconnectedPool.forEach((user: GameUser, userID: string) => {
			// Calculate elapsed time (s) since user fully disconnected.
			const disconnetedTime = (Date.now() - user.lastSeenDate) / 1000;

			this.logger.log("[CLEAN]:", userID, "disconnected for", disconnetedTime);

			// Ensure user hasn't exceeded the maximum allowed disconnected time
			if (disconnetedTime > config.maxDisconnectDuration) {
				// Delete user from local storage.
				this.disconnectedPool.delete(userID);

				// Terminate the game the user was in.
				if (user.status === "game") user.match.status = "aborted";

				// Mark user as disconnected.
				// This might be useful when user was in a game, as it is still referenced in the Match instance.
				user.status = "disconnected";
			}
		});
	}

	@Interval(2000)
	async updateMatches() {
		for (const [matchID, match] of this.matchPool) {
			// Wait a bit before cleaning finished games
			// (allows clients to update their local game state and handle game termination properly)
			if (
				["aborted", "finished"].includes(match.status) &&
				(Date.now() - match.lastStatusUpdate) / 1000 < timeBeforeCleaningGame
			)
				return;
			// Cleanup aborted games
			if (match.status === "aborted") {
				// Delete match from pool
				this.matchPool.delete(matchID);

				[match.user1, match.user2].forEach((user: GameUser) => {
					// Update user status
					user.status = user.status === "disconnected" ? "disconnected" : "connected";

					// Remove users' stored references to terminated match
					user.match = null;
				});

				// All done
				return;
			}

			// Cleanup finished games
			if (match.status === "finished") {
				// Extract score
				const score = match.data.score;

				// Fetch users in database
				const updatedUsers = [
					await this.userService.findOne(match.user1.user.id),
					await this.userService.findOne(match.user2.user.id),
				];

				// Ensure game isn't a draw
				if (score.user1 !== score.user2) {
					// Get winner and loser
					const [winner, loser] =
						score.user1 > score.user2
							? [updatedUsers[0], updatedUsers[1]]
							: [updatedUsers[1], updatedUsers[0]];

					// Increase winner's win counter
					winner.nb_win++;

					// Increase loser's loss counter
					loser.nb_loss++;
				}

				// Increase user's game counter
				updatedUsers.forEach((user: User) => {
					user.nb_game++;
					void this.userService.update(user.id, user);
				});

				// Erase game
				this.matchPool.delete(match.id);

				[match.user1, match.user2].forEach((user: GameUser) => {
					// Remove reference to terminated match
					user.match = null;

					// Restore users status
					user.status = "connected";

					// Update user data
					user.user = updatedUsers.shift();
				});

				// Save game in db
				void this.storedGameService.create({
					id: 0,
					score_first_player: score.user1,
					score_second_player: score.user2,
					user_one: match.user1.user,
					user_two: match.user2.user,
					finished: true,
					type: match.type,
					created_at: new Date(match.created_at),
				} as Game);

				// All done.
				return;
			}

			// Set games that exceeded max duration as finished.
			if ((Date.now() - match.created_at) / 1000 > config.maxGameDuration) {
				// Set match to be terminated
				match.status = "finished";

				// Store update date.
				match.lastStatusUpdate = Date.now();
			}
		}
	}

	@Interval(500)
	sendGameStatusUpdate() {
		this.matchPool.forEach((match: Match) => {
			[match.user1, match.user2].forEach((user: GameUser) => {
				const data: ClientMatch = {
					self: user.user,
					opponent: match.user1 === user ? match.user2.user : match.user1.user,
					status: match.status,
					mode: match.mode,
					type: match.type,
					id: match.id,
					created_at: match.created_at,
					lastStatusUpdate: match.lastStatusUpdate,
					data: match.data,
				};
				this.broadcast(user, "game:updateStatus", data);
			});
		});
	}

	broadcast(user: GameUser, event: string, data: any = null) {
		// Bots don't receive any data, so ensure the user is not a bot
		if (user.type === "bot") return;

		// Send passed data and event to each user's sockets.
		user.sockets.forEach((socket: Socket) => {
			socket.emit(event, data);
		});
	}
}
