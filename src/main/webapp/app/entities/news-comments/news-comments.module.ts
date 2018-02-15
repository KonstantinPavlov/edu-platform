import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EduPlatformSharedModule } from '../../shared';
import {
    NewsCommentsService,
    NewsCommentsPopupService,
    NewsCommentsComponent,
    NewsCommentsDetailComponent,
    NewsCommentsDialogComponent,
    NewsCommentsPopupComponent,
    NewsCommentsDeletePopupComponent,
    NewsCommentsDeleteDialogComponent,
    newsCommentsRoute,
    newsCommentsPopupRoute,
} from './';

const ENTITY_STATES = [
    ...newsCommentsRoute,
    ...newsCommentsPopupRoute,
];

@NgModule({
    imports: [
        EduPlatformSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        NewsCommentsComponent,
        NewsCommentsDetailComponent,
        NewsCommentsDialogComponent,
        NewsCommentsDeleteDialogComponent,
        NewsCommentsPopupComponent,
        NewsCommentsDeletePopupComponent,
    ],
    entryComponents: [
        NewsCommentsComponent,
        NewsCommentsDialogComponent,
        NewsCommentsPopupComponent,
        NewsCommentsDeleteDialogComponent,
        NewsCommentsDeletePopupComponent,
    ],
    providers: [
        NewsCommentsService,
        NewsCommentsPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EduPlatformNewsCommentsModule {}
