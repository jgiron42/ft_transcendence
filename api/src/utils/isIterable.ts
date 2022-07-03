export const isIterable = (obj: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return obj && typeof obj[Symbol.iterator] === "function";
};
