const checkMode = (mode: string): string => {
	for (const c of mode) {
		if (!"crud".includes(c)) throw new Error("invalid permission in mode string");
	}
	return mode;
};

/**
 * decorator used to set authorization for access to an entity properties in the api
 */
export const SetMode = (conf: ([string, string] | string)[] | string) => {
	const m = new Map();
	if (typeof conf == "string") m.set("default", checkMode(conf));
	else {
		for (const confItem of conf) {
			if (typeof confItem == "string") m.set("default", checkMode(confItem));
			else m.set(confItem[0], checkMode(confItem[1]));
		}
	}
	return Reflect.metadata("crudFilter", m);
};
