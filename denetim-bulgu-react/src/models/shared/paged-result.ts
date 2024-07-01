export interface PagedResult<T> {
	pageIndex: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	items: Array<T>;
}
