import { createHash, randomUUID } from "crypto";
import { Catch, Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import config from "@src/config/game.config";
import { AllowedGameMode } from "@src/config/game.config";
import { Socket } from "@src/types/socket";
import { Interval } from "@nestjs/schedule";
import { User } from "@src/entities/user.entity";
import { UserService } from "@services/user.service";
import {
	ClientMatch,
	GameID,
	GameInvitation,
	GameUser,
	GameUserPool,
	GameUserSet,
	InvitationID,
	Match,
	MatchmakingPool,
	MatchPool,
	SerializedMatch,
	UserID,
	UserMatchmakingStatus,
} from "@src/types/game";
import { Game as GameEntity } from "@src/entities/game.entity";
import { Game } from "@gamemodes/default";
import { GameUserInputDTO } from "@src/types/dtos/GameUserInput.dto";
import { modifier as PVEModifier } from "@src/gamemodes/modifiers/bot";
import { modifier as demoModifier } from "@src/gamemodes/modifiers/demo";
import _ from "lodash";
import EloRank from "elo-rank";
import { Mutex } from "async-mutex";
import { TypeORMError } from "typeorm";
import { StoredGameService } from "./stored-game.service";

@Catch(TypeORMError)
@Injectable()
export class GameService {
	private logger: Logger = new Logger("GameService");

	// Pool storing users that have at least one connected socket
	private connectedPool: GameUserPool = new Map<UserID, GameUser>();

	// Pool storing fully disconnected users that had recently connected sockets
	private disconnectedPool: GameUserPool = new Map<UserID, GameUser>();

	// Pool tracking users looking for a match
	private matchmakingPool: MatchmakingPool = new Map<AllowedGameMode, GameUserSet>();

	// Pool storing all matches, regardless of their modes
	private matchPool: MatchPool = new Map<GameID, Match>();

	// Crocubot
	private bot = {} as User;

	// RoBOTnix
	private bot2 = {} as User;

	// ELO ratings calculator
	// https://www.npmjs.com/package/elo-rank
	private elo = new EloRank();

	// Mutex to avoid race conditions in updateMatches()
	// https://www.npmjs.com/package/async-mutex
	private matchUpdateMutex = new Mutex();

	constructor(private readonly userService: UserService, private readonly storedGameService: StoredGameService) {
		// Initialize all game mode pools
		config.gameModes.forEach((mode: AllowedGameMode) => {
			this.logger.log(`Initializing game mode: ${mode}`);
			this.matchmakingPool.set(mode, new Set<GameUser>() as GameUserSet);
			this.initBots();
		});
	}

	initBots() {
		// Init callback to create the first bot when it doesn't already exists in DB.
		const createFirstBot = () =>
			this.userService
				.create({
					id: "CrocuBot",
					username: "Crocu",
					nb_game: 0,
					nb_win: 0,
					totp_enabled: false,
					status: 0,
					totp_key: "",
					created_at: new Date(),
					elo: config.botBaseELO,
				})
				.then((bot) => (this.bot = bot))
				.catch(() => this.logger.error("Could not create create nor find CrocuBot"));

		// Init callback to create the second bot when it doesn't already exists in DB.
		const createSecondBot = () =>
			this.userService
				.create({
					id: "RoBOTnix",
					username: "Nix",
					nb_game: 0,
					nb_win: 0,
					totp_enabled: false,
					status: 0,
					totp_key: "",
					created_at: new Date(),
					elo: config.botBaseELO,
				})
				.then((bot) => (this.bot2 = bot))
				.catch(() => this.logger.error("Could not create create nor find RoBOTnix"));

		// Find or create the first bot in DB.
		this.userService
			.getQuery()
			.getOneOrFail("CrocuBot")
			.then((bot) => {
				if (bot) this.bot = bot;
				else void createFirstBot();
			})
			.catch(createFirstBot);

		// Find or create the second bot in DB.
		this.userService
			.getQuery()
			.getOneOrFail("RoBOTnix")
			.then((bot) => {
				if (bot) this.bot2 = bot;
				else void createSecondBot();
			})
			.catch(createSecondBot);
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

	connectClient(client: Socket, userID: UserID) {
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
				gameEvents: { up: false, down: false },
				invitations: new Map<InvitationID, GameInvitation>(),
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

	addUserToMatchmakingPool(userID: UserID, mode: AllowedGameMode) {
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

	removeUserFromMatchmakingPool(userID: UserID) {
		// Get user from connected users pool
		const foundUser: GameUser = this.connectedPool.get(userID);

		// Ensure user is looking for a game
		if (foundUser.status !== "matchmaking") return;

		// Restore status
		foundUser.status = "connected";

		// Remove user fro matchmaking pool
		this.matchmakingPool.get(foundUser.gameMode).delete(foundUser);
	}

	matchUserToBot(userID: UserID, mode: AllowedGameMode) {
		if (!this.bot) {
			this.logger.warn("Can't match user to bot because it hasn't been found nor created");
			return;
		}

		// Get user from connected users pool.
		const foundUser: GameUser = this.connectedPool.get(userID);

		// Ensure user isn't already in a match
		if (foundUser.status === "game") return;

		// Update user game mode
		foundUser.gameMode = mode;

		// Fetch or create the bot user.
		const bot: User = this.bot;

		// Match the bot and the player.
		void this.matchUsers(foundUser, this.makeGameUserFromBot(bot));
	}

	async matchUsers(p1: GameUser, p2: GameUser): Promise<Match | null> {
		// Ensures players are not the same. (should never happen)
		if (p1.user.id === p2.user.id) {
			this.logger.error(`Tried to match ${p1.user.id} with themselves!!`);
			return null;
		}

		// Set the gameID to a random UUID
		const gameID = randomUUID();
		let createdMatch = null;

		try {
			const module = (await import(`../gamemodes/${p1.gameMode}`)) as unknown as { Game: typeof Game };

			let modifier = (mode: typeof Game) => mode;

			if (p1.type === "bot" && p2.type === "bot") modifier = demoModifier;
			else if (p2.type === "bot") modifier = PVEModifier;

			const Mode = modifier((module as { Game: typeof Game }).Game);

			const game = new Mode();

			// Create new match
			const newMatch = {
				p1,
				p2,
				type: "ManVsMan",
				status: "creating",
				id: gameID,
				created_at: Date.now(),
				lastStatusUpdate: Date.now(),
				mode: p1.gameMode,
				game,
				sockets: new Set<Socket>(),
			} as Match;

			// Add the Match to the ingoing game pool
			this.matchPool.set(gameID, newMatch);

			// Get pool corresponding to users selected game mode.
			const pool = this.matchmakingPool.get(p1.gameMode);

			[p1, p2].forEach((user: GameUser) => {
				// Delete participants from the matchmaking pool
				pool.delete(user);

				// Update player status
				user.status = "game";

				// Register the match in the user.
				user.match = newMatch;
			});

			// Debug logs
			this.logger.log(`Matched: ${p1.user.id} vs ${p2.user.id}`);
			createdMatch = newMatch;
		} catch (err: any) {
			this.logger.error(`Could not load game mode ${p1.gameMode}: ${(err as Error).toString()}`);
		}

		return createdMatch;
	}

	@Interval(config.matchingJobInterval)
	matchUsersJob() {
		// Handle every game mode pools
		this.matchmakingPool.forEach((pool: GameUserSet) => {
			// Ensure the pool has at least two users
			if (pool.size >= 2) {
				// Get first two users
				const [p1, p2] = pool;

				// Match first two users
				void this.matchUsers(p1, p2);
			}
		});
	}

	@Interval(config.logInterval)
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
					(match: Match) => `${match.p1.user.id}-${match.p2.user.id}@${match.mode}`,
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

	serializeMatch(match: Match | null): UserMatchmakingStatus["match"] {
		return match
			? {
					id: match.id,
					p1: match.p1.user.id,
					p2: match.p2.user.id,
					mode: match.mode,
			  }
			: null;
	}

	// Return the number of users looking for a game.
	@Interval(config.matchmakingSendUpdatesInterval)
	updateConnectedUsers(): void {
		// Send local user data back to every connected client
		this.connectedPool.forEach((localUser: GameUser) => {
			this.cleanUserDeadInvites(localUser);
			// Filter data sent to user
			const userStatus: UserMatchmakingStatus = {
				user: localUser.user,
				status: localUser.status as "connected" | "matchmaking" | "game",
				// Filter everything but ids in sent match.
				match: this.serializeMatch(localUser.match),
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
				invitations: localUser.invitations,
				matchList: Array.from(this.matchPool)
					.filter(([, match]) => match.status === "ongoing")
					.map(([, match]) => this.serializeMatch(match)), // Send only ongoing games.
			};

			// Send update data to every user's sockets.
			this.broadcast(localUser, "matchmaking:updateStatus", true, userStatus);
		});
	}

	@Interval(config.cleanDisconnetedUsersInterval)
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

	makeGameUserFromBot(bot: User, mode: AllowedGameMode = "default"): GameUser {
		return {
			user: bot,
			type: "bot",
			gameMode: mode,
			status: "connected",
			lastSeenDate: 0,
			searchStartDate: 0,
			gameEvents: { up: false, down: false },
			sockets: new Set<Socket>(),
			invitations: new Map<InvitationID, GameInvitation>(),
			match: null,
		};
	}

	@Interval(config.gameUpdatesInterval) // Should be 0
	async updateMatches() {
		// Ensure updates cannot run concurrently. (avoid race conditions)
		await this.matchUpdateMutex.runExclusive(async () => {
			try {
				// Ensure there's always games to spectate by creating a bot match when no games are ongoing.
				if (this.matchPool.size === 0 && this.bot && this.bot2 && this.bot.id && this.bot2.id)
					void this.matchUsers(
						this.makeGameUserFromBot(this.bot, _.sample(config.gameModes)),
						this.makeGameUserFromBot(this.bot2),
					);

				// Updates all matchs state
				for (const [matchID, match] of this.matchPool) {
					// Wait a bit before cleaning finished games
					// (allows clients to update their local game state and handle game termination properly)
					if (
						["aborted", "finished"].includes(match.status) &&
						(Date.now() - match.lastStatusUpdate) / 1000 < config.timeBeforeCleaningEndedGame
					)
						continue;

					// Cleanup aborted games
					if (match.status === "aborted") {
						// Delete match from pool
						this.matchPool.delete(matchID);

						[match.p1, match.p2].forEach((user: GameUser) => {
							// Update user status
							user.status = user.status === "disconnected" ? "disconnected" : "connected";

							// Remove users' stored references to terminated match
							user.match = null;
						});

						// All done
						continue;
					}

					// Cleanup finished games
					if (match.status === "finished") {
						// Extract score
						const score = match.game.score;

						// Fetch users in database
						const updatedUsers = [
							await this.userService.getQuery().getOne(match.p1.user.id),
							await this.userService.getQuery().getOne(match.p2.user.id),
						];

						// Ensure game isn't a draw
						if (score.p1 !== score.p2) {
							// Get winner and loser
							const [winner, loser] =
								score.p1 > score.p2
									? [updatedUsers[0], updatedUsers[1]]
									: [updatedUsers[1], updatedUsers[0]];

							// Increase winner's win counter
							winner.nb_win++;

							// Increase loser's loss counter
							loser.nb_loss++;

							// Increase winner's ELO rating.
							winner.elo = this.elo.updateRating(
								this.elo.getExpected(winner.elo, loser.elo),
								1,
								winner.elo,
							);

							// Decrease loser's ELO rating.
							loser.elo = this.elo.updateRating(
								this.elo.getExpected(loser.elo, winner.elo),
								0,
								loser.elo,
							);
						}

						// Increase user's game counter
						updatedUsers.forEach((user: User) => {
							user.nb_game++;
							void this.userService.getQuery().update(user, user.id);
						});

						// Erase game
						this.matchPool.delete(match.id);

						[match.p1, match.p2].forEach((user: GameUser) => {
							// Remove reference to terminated match
							user.match = null;

							// Restore users status
							user.status = "connected";

							// Update user data
							user.user = updatedUsers.shift();
						});

						// Save game in db
						void this.storedGameService
							.create({
								id: 0,
								score_first_player: score.p1,
								score_second_player: score.p2,
								user_one: match.p1.user,
								user_two: match.p2.user,
								finished: true,
								type: match.type,
								created_at: new Date(match.created_at),
							} as GameEntity)
							.then((game) => this.logger.log(`Saved finished game: ${game.id}:${matchID}`))
							.catch((err: Error) =>
								this.logger.error(`Failed to save finished game(${matchID}): ${err.toString()}`),
							);

						// All done.
						continue;
					}

					// Set games that exceeded max duration as finished.
					if ((Date.now() - match.created_at) / 1000 > config.maxGameDuration) {
						// Set match to be terminated
						match.status = "finished";

						// Store update date.
						match.lastStatusUpdate = Date.now();

						continue;
					}

					// Wait a bit before starting the match in order to let clients prepare for it.
					if (match.status === "creating" && Date.now() - match.lastStatusUpdate > config.timeBeforeGameStart)
						match.status = "ongoing";

					if (match.status === "ongoing") {
						// Process player 1 inputs
						if (match.p1.type !== "bot" && match.p1.gameEvents.up) match.game.eventQueue.add("upP1");
						if (match.p1.type !== "bot" && match.p1.gameEvents.down) match.game.eventQueue.add("downP1");
						if (match.p1.type !== "bot" && !(match.p1.gameEvents.down || match.p1.gameEvents.up))
							match.game.eventQueue.add("stopP1");

						// Process player 2 inputs
						if (match.p2.type !== "bot" && match.p2.gameEvents.up) match.game.eventQueue.add("upP2");
						if (match.p2.type !== "bot" && match.p2.gameEvents.down) match.game.eventQueue.add("downP2");
						if (match.p2.type !== "bot" && !(match.p2.gameEvents.down || match.p2.gameEvents.up))
							match.game.eventQueue.add("stopP2");

						// Advance game state
						match.game.update();

						// Update status when game is finished.
						if (match.game.ended) match.status = "finished";
					}
				}
			} catch (err) {
				// Log any errors.
				this.logger.error(err);
			}
		});
	}

	@Interval(0)
	sendGameStatusUpdate() {
		this.matchPool.forEach((match: Match) => {
			// Filter the match's data to send clients.
			const data: ClientMatch = {
				p1: match.p1.user,
				p2: match.p2.user,

				status: match.status,
				mode: match.mode,
				type: match.type,
				id: match.id,
				created_at: match.created_at,
				lastStatusUpdate: match.lastStatusUpdate,
				data: match.game.cloneData(),
			};

			// Send game data to players.
			[match.p1, match.p2].forEach((user: GameUser) => {
				this.broadcast(user, "game:updateStatus", true, data);
			});

			// Send game data to spectators.
			match.sockets.forEach((socket) => socket.volatile.emit(`game:spectateUpdate=${match.id}`, data));
		});
	}

	broadcast(user: GameUser, event: string, volatile: boolean, data: any = null) {
		// Bots don't receive any data, so ensure the user is not a bot
		if (user.type === "bot") return;

		// Send passed data and event to each user's sockets.
		user.sockets.forEach((socket) => {
			if (volatile) socket.volatile.emit(event, data);
			else socket.emit(event, data);
		});
	}

	updateUserInput(userID: UserID, events: GameUserInputDTO) {
		// Get user from connected users pool.
		const foundUser: GameUser = this.connectedPool.get(userID);

		// Merge received input with stored inputs.
		Object.assign(foundUser.gameEvents, events);
	}

	spectateMatch(client: Socket, matchID: GameID): SerializedMatch | undefined {
		// Extract the requested match from the ongoing matches pool.
		const foundMatch = this.matchPool.get(matchID);

		// Ensure the match still exists.
		if (!foundMatch) return undefined;

		// Add the client's connection to the spectators.
		foundMatch.sockets.add(client);

		// Send the match's infos back to the client.
		return this.serializeMatch(foundMatch);
	}

	getUserGameID(userID: UserID): GameID | null {
		// Extract user from connected users pool.
		const user = this.connectedPool.get(userID);

		// Return disconnected status when user wasn't found or game doesn't exist
		if (!user || user.status === "game") return null;

		// Return found match ID.
		return user.match.id;
	}

	cleanUserDeadInvites(user: UserID | GameUser) {
		// Get user when ID was passed
		if (typeof user === "string") user = this.connectedPool.get(user);

		// Abort when user isn't connected.
		if (!user) return;

		// Remove invites from disconnected users.
		user.invitations.forEach((invite, id, map) => {
			if (!this.connectedPool.get(invite.from)) map.delete(id);
		});
	}

	getUserStatus(userID: UserID) {
		// Extract user from connected users pool.
		const localUser = this.connectedPool.get(userID);

		// Return disconnected status when user wasn't found.
		if (!localUser) return null;

		// Remove invites from disconnected users.
		this.cleanUserDeadInvites(localUser);

		return {
			user: localUser.user,
			status: localUser.status as "connected" | "matchmaking" | "game",
			// Filter everything but ids in sent match.
			match: this.serializeMatch(localUser.match),
			invitations: Array.from(localUser.invitations),
		};
	}

	acceptGameInvite(userID: UserID, invitationID: InvitationID): ReturnType<typeof GameService.prototype.matchUsers> {
		// Find recipient in connected users by ID.
		const recipient = this.connectedPool.get(userID);

		// Helper function that determines whetever a user is in a matchable state.
		const isPlayerMatchable = (p: GameUser | null) => p && p.status !== "game";

		// Ensure recipient is matchable.
		if (!isPlayerMatchable(recipient)) return null;

		// Clean stale invitations.
		this.cleanUserDeadInvites(recipient);

		// Find requested invitation.
		const invite = recipient.invitations.get(invitationID);

		// Ensure invitation was found.
		if (!invite) return null;

		// Find sender in connected users by ID.
		const sender = this.connectedPool.get(invite.from);

		// Ensure sender is matchable.
		if (!isPlayerMatchable(sender)) return null;

		// Remove fullfilled invitation.
		recipient.invitations.delete(invitationID);

		// Set players' game mode.
		[recipient, sender].forEach((p) => (p.gameMode = invite.mode));

		// Create the match.
		return this.matchUsers(recipient, sender);
	}

	addGameInvite(from: UserID, to: UserID, mode: AllowedGameMode): string {
		// Ensure game mode is allowed and recipient is different from sender.
		if (!config.gameModes.includes(mode) || from === to) return null;

		// Get recipient from connected users.
		const recipient = this.connectedPool.get(to);

		// Ensure recipient is connected.
		if (!recipient) return null;

		// Create game key as a hash of invite's data (ensures no duplicate).
		const key = createHash("sha256").update(`${to}${from}${mode}`).digest("hex");

		// Store the invitation in the recipient's.
		recipient.invitations.set(key, { from, mode });

		// Return the invitation ID (hash).
		return key;
	}

	removeGameInvite(user: UserID | GameUser, id: InvitationID): boolean {
		// Get user when ID was passed
		if (typeof user === "string") user = this.connectedPool.get(user);

		// Abort when user doesn't exist
		if (!user) return false;

		// Delete the invitation.
		return user.invitations.delete(id);
	}
}
