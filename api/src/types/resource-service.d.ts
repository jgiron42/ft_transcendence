export interface resourceService<Resource> {
	findOne: (id: any) => Promise<Resource>;
}
