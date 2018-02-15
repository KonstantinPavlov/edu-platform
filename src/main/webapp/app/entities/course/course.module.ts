import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EduPlatformSharedModule } from '../../shared';
import {
    CourseService,
    CoursePopupService,
    CourseComponent,
    CourseDetailComponent,
    CourseDialogComponent,
    CoursePopupComponent,
    CourseDeletePopupComponent,
    CourseDeleteDialogComponent,
    courseRoute,
    coursePopupRoute,
    CourseResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...courseRoute,
    ...coursePopupRoute,
];

@NgModule({
    imports: [
        EduPlatformSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CourseComponent,
        CourseDetailComponent,
        CourseDialogComponent,
        CourseDeleteDialogComponent,
        CoursePopupComponent,
        CourseDeletePopupComponent,
    ],
    entryComponents: [
        CourseComponent,
        CourseDialogComponent,
        CoursePopupComponent,
        CourseDeleteDialogComponent,
        CourseDeletePopupComponent,
    ],
    providers: [
        CourseService,
        CoursePopupService,
        CourseResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EduPlatformCourseModule {}
