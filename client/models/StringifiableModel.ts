export class StringifiableModel {
	toJSON() {
		return JSON.stringify({ ...this });
	}
}
