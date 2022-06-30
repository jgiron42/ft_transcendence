export declare type PaginatedResponse<T> = {
	data: T[];
	entities: number;
	page: number;
	per_page: number;
};
