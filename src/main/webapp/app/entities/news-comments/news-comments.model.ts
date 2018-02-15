import { BaseEntity } from './../../shared';

export class NewsComments implements BaseEntity {
    constructor(
        public id?: number,
        public userId?: number,
        public comment?: string,
        public commentDate?: any,
        public newsId?: number,
    ) {
    }
}
