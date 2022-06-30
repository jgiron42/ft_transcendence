import { requestBinaryPredicate } from "@src/types/binaryPredicate";

export const SetGroupMappers = (mapping: Record<string, requestBinaryPredicate>) =>
	Reflect.metadata("groupMapper", mapping);
