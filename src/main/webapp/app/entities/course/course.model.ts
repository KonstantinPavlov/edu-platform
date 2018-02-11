import { BaseEntity } from './../../shared';

export const enum Level {
    'NOVICE',
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'PROFESSIONAL'
}

export class Course implements BaseEntity {
    constructor(
        public id?: number,
        public courseTitle?: string,
        public courseDescription?: string,
        public courseLevel?: Level,
        public chargeable?: boolean,
        public paymentAmount?: number,
        public studentId?: number,
        public resources?: BaseEntity[],
        public lessons?: BaseEntity[],
        public paymentsId?: number,
        public programs?: BaseEntity[],
    ) {
        this.chargeable = false;
    }
}
