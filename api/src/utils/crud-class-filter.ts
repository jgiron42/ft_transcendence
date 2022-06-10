declare type crudMode = Map<string, string>;

export const CrudClassFilter = <T>(input: T, type: string, groups?: [string]): T => {
	let mode: crudMode;
	if (typeof input != "object") return input;
	const obj: Record<string, unknown> = input as Record<string, unknown>;
	if (type.length <= 0) return {} as T;
	groups ??= ["default"];
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			mode = Reflect.getMetadata("crudFilter", obj, key) as crudMode;
			if (!mode) continue;
			for (const g in groups) {
				if (mode.has(groups[g]) && mode.get(groups[g]).includes(type.charAt(0)))
					obj[key] = CrudClassFilter(obj[key], type, groups);
				else delete obj[key];
			}
		}
	}
	return obj as T;
};
