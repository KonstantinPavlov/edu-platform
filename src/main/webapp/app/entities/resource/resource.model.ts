import { BaseEntity } from './../../shared';

export const enum ResourceType {
    'VIDEO',
    'IMAGE',
    'TUTORIAL',
    'PAGE'
}

export class Resource implements BaseEntity {
    constructor(
        public id?: number,
        public resourceName?: string,
        public resourceDescription?: string,
        public resourceURL?: string,
        public resourcePreviewImage?: string,
        public resourceType?: ResourceType,
        public weight?: number,
        public newsId?: number,
        public programId?: number,
        public courseId?: number,
        public lessonId?: number,
    ) {
    }
}
