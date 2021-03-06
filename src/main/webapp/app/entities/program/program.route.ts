import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ProgramComponent } from './program.component';
import { ProgramDetailComponent } from './program-detail.component';
import { ProgramPopupComponent } from './program-dialog.component';
import { ProgramDeletePopupComponent } from './program-delete-dialog.component';

@Injectable()
export class ProgramResolvePagingParams implements Resolve<any> {

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

export const programRoute: Routes = [
    {
        path: 'program',
        component: ProgramComponent,
        resolve: {
            'pagingParams': ProgramResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.program.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'program/:id',
        component: ProgramDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.program.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const programPopupRoute: Routes = [
    {
        path: 'program-new',
        component: ProgramPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.program.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'program/:id/edit',
        component: ProgramPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.program.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'program/:id/delete',
        component: ProgramDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eduPlatformApp.program.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
