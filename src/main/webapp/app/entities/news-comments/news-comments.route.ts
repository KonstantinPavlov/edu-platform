import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { NewsCommentsComponent } from './news-comments.component';
import { NewsCommentsDetailComponent } from './news-comments-detail.component';
import { NewsCommentsPopupComponent } from './news-comments-dialog.component';
import { NewsCommentsDeletePopupComponent } from './news-comments-delete-dialog.component';

export const newsCommentsRoute: Routes = [
    {
        path: 'news-comments',
        component: NewsCommentsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.newsComments.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'news-comments/:id',
        component: NewsCommentsDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.newsComments.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const newsCommentsPopupRoute: Routes = [
    {
        path: 'news-comments-new',
        component: NewsCommentsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.newsComments.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'news-comments/:id/edit',
        component: NewsCommentsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.newsComments.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'news-comments/:id/delete',
        component: NewsCommentsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.newsComments.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
