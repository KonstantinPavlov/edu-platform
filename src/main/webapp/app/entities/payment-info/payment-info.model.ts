import { BaseEntity } from './../../shared';

export class PaymentInfo implements BaseEntity {
    constructor(
        public id?: number,
        public paymentDate?: any,
        public paymentAmount?: number,
        public courseId?: number,
        public studentId?: number,
    ) {
    }
}
