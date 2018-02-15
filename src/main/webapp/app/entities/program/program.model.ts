import { BaseEntity } from './../../shared';

export class Program implements BaseEntity {
    constructor(
        public id?: number,
        public programName?: string,
        public programDescription?: string,
        public resources?: BaseEntity[],
        public cources?: BaseEntity[],
    ) {
    }
}
