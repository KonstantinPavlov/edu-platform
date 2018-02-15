import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaymentInfoComponent } from './payment-info.component';
import { PaymentInfoDetailComponent } from './payment-info-detail.component';
import { PaymentInfoPopupComponent } from './payment-info-dialog.component';
import { PaymentInfoDeletePopupComponent } from './payment-info-delete-dialog.component';

export const paymentInfoRoute: Routes = [
    {
        path: 'payment-info',
        component: PaymentInfoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.paymentInfo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'payment-info/:id',
        component: PaymentInfoDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.paymentInfo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentInfoPopupRoute: Routes = [
    {
        path: 'payment-info-new',
        component: PaymentInfoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.paymentInfo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-info/:id/edit',
        component: PaymentInfoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.paymentInfo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-info/:id/delete',
        component: PaymentInfoDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.paymentInfo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
