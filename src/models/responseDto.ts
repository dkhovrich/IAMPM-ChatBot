export interface IResponse<T> {
    pageNumber: number;
    pageSize: number;
    total: number;
    content: T[];
}

export class Response<T> implements IResponse<T> {
    constructor(
        public pageNumber: number,
        public pageSize: number,
        public total: number,
        public content: T[]) { }
}