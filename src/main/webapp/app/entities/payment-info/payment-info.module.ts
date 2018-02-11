import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EduPlatformSharedModule } from '../../shared';
import {
    PaymentInfoService,
    PaymentInfoPopupService,
    PaymentInfoComponent,
    PaymentInfoDetailComponent,
    PaymentInfoDialogComponent,
    PaymentInfoPopupComponent,
    PaymentInfoDeletePopupComponent,
    PaymentInfoDeleteDialogComponent,
    paymentInfoRoute,
    paymentInfoPopupRoute,
} from './';

const ENTITY_STATES = [
    ...paymentInfoRoute,
    ...paymentInfoPopupRoute,
];

@NgModule({
    imports: [
        EduPlatformSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaymentInfoComponent,
        PaymentInfoDetailComponent,
        PaymentInfoDialogComponent,
        PaymentInfoDeleteDialogComponent,
        PaymentInfoPopupComponent,
        PaymentInfoDeletePopupComponent,
    ],
    entryComponents: [
        PaymentInfoComponent,
        PaymentInfoDialogComponent,
        PaymentInfoPopupComponent,
        PaymentInfoDeleteDialogComponent,
        PaymentInfoDeletePopupComponent,
    ],
    providers: [
        PaymentInfoService,
        PaymentInfoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EduPlatformPaymentInfoModule {}
