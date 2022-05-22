/**
 * user stored in a session
 */
export declare type sessionUser = {
	id: string; // The id of a session user (42 login)
	accessToken: string; // The 42 OAuth access token of a session user
	refreshToken: string; // The 42 OAuth refresh token of a session user
	firstName: string; // The firstName of a session user (from 42)
	lastName: string; // The lastName of a session user (from 42)
};
