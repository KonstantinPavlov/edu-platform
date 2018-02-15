import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EduPlatformNewsModule } from './news/news.module';
import { EduPlatformNewsCommentsModule } from './news-comments/news-comments.module';
import { EduPlatformStudentModule } from './student/student.module';
import { EduPlatformPaymentInfoModule } from './payment-info/payment-info.module';
import { EduPlatformProgramModule } from './program/program.module';
import { EduPlatformCourseModule } from './course/course.module';
import { EduPlatformLessonModule } from './lesson/lesson.module';
import { EduPlatformResourceModule } from './resource/resource.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        EduPlatformNewsModule,
        EduPlatformNewsCommentsModule,
        EduPlatformStudentModule,
        EduPlatformPaymentInfoModule,
        EduPlatformProgramModule,
        EduPlatformCourseModule,
        EduPlatformLessonModule,
        EduPlatformResourceModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EduPlatformEntityModule {}
