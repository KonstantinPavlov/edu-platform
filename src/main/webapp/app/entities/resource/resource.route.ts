import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ResourceComponent } from './resource.component';
import { ResourceDetailComponent } from './resource-detail.component';
import { ResourcePopupComponent } from './resource-dialog.component';
import { ResourceDeletePopupComponent } from './resource-delete-dialog.component';

@Injectable()
export class ResourceResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const resourceRoute: Routes = [
    {
        path: 'resource',
        component: ResourceComponent,
        resolve: {
            'pagingParams': ResourceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.resource.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'resource/:id',
        component: ResourceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.resource.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const resourcePopupRoute: Routes = [
    {
        path: 'resource-new',
        component: ResourcePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.resource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resource/:id/edit',
        component: ResourcePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.resource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resource/:id/delete',
        component: ResourceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.resource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
