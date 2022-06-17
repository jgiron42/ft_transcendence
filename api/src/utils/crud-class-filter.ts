declare type crudMode = Map<string, string>;

export const CrudClassFilter = <T>(input: T, type: string, groups?: string[]): T => {
	let mode: crudMode;
	groups ??= [];
	groups.push("default");
	if (Array.isArray(input)) {
		for (let item of input as unknown[]) item = CrudClassFilter(item, type, groups);
		return input;
	}
	if (typeof input != "object") return input;
	const obj: Record<string, unknown> = input as Record<string, unknown>;
	if (type.length <= 0) return {} as T;
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			mode = Reflect.getMetadata("crudFilter", obj, key) as crudMode;
			if (!mode) {
				delete obj[key];
				continue;
			}
			let isAllowed = false;
			for (const group of groups) isAllowed ||= mode.has(group) && mode.get(group).includes(type.charAt(0));
			if (isAllowed)
				obj[key] = CrudClassFilter(obj[key], type, undefined); // removing groups in nested objects by security
			else delete obj[key];
		}
	}
	return obj as T;
};
