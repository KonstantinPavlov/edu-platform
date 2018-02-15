import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EduPlatformSharedModule } from '../../shared';
import {
    LessonService,
    LessonPopupService,
    LessonComponent,
    LessonDetailComponent,
    LessonDialogComponent,
    LessonPopupComponent,
    LessonDeletePopupComponent,
    LessonDeleteDialogComponent,
    lessonRoute,
    lessonPopupRoute,
} from './';

const ENTITY_STATES = [
    ...lessonRoute,
    ...lessonPopupRoute,
];

@NgModule({
    imports: [
        EduPlatformSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LessonComponent,
        LessonDetailComponent,
        LessonDialogComponent,
        LessonDeleteDialogComponent,
        LessonPopupComponent,
        LessonDeletePopupComponent,
    ],
    entryComponents: [
        LessonComponent,
        LessonDialogComponent,
        LessonPopupComponent,
        LessonDeleteDialogComponent,
        LessonDeletePopupComponent,
    ],
    providers: [
        LessonService,
        LessonPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EduPlatformLessonModule {}
