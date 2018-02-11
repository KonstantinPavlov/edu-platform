import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { NewsComponent } from './news.component';
import { NewsDetailComponent } from './news-detail.component';
import { NewsPopupComponent } from './news-dialog.component';
import { NewsDeletePopupComponent } from './news-delete-dialog.component';

export const newsRoute: Routes = [
    {
        path: 'news',
        component: NewsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.news.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'news/:id',
        component: NewsDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.news.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const newsPopupRoute: Routes = [
    {
        path: 'news-new',
        component: NewsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.news.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'news/:id/edit',
        component: NewsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.news.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'news/:id/delete',
        component: NewsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.news.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
