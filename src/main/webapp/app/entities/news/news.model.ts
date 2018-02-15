import { BaseEntity } from './../../shared';

export class News implements BaseEntity {
    constructor(
        public id?: number,
        public newsHeader?: string,
        public newsImage?: string,
        public newsDescription?: string,
        public newsDate?: any,
        public resources?: BaseEntity[],
        public comments?: BaseEntity[],
    ) {
    }
}
