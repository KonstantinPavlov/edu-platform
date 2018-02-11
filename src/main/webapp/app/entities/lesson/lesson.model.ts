import { BaseEntity } from './../../shared';

export const enum Language {
    'ENGLISH',
    'RUSSIAN'
}

export class Lesson implements BaseEntity {
    constructor(
        public id?: number,
        public lessonTitle?: string,
        public lessonDescription?: string,
        public language?: Language,
        public resources?: BaseEntity[],
        public courses?: BaseEntity[],
    ) {
    }
}
