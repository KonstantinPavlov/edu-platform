import { BaseEntity } from './../../shared';

export class Student implements BaseEntity {
    constructor(
        public id?: number,
        public userId?: number,
        public courses?: BaseEntity[],
        public payments?: BaseEntity[],
    ) {
    }
}
