import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Resource } from './resource.model';
import { ResourcePopupService } from './resource-popup.service';
import { ResourceService } from './resource.service';
import { News, NewsService } from '../news';
import { Program, ProgramService } from '../program';
import { Course, CourseService } from '../course';
import { Lesson, LessonService } from '../lesson';

@Component({
    selector: 'jhi-resource-dialog',
    templateUrl: './resource-dialog.component.html'
})
export class ResourceDialogComponent implements OnInit {

    resource: Resource;
    isSaving: boolean;

    news: News[];

    programs: Program[];

    courses: Course[];

    lessons: Lesson[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private resourceService: ResourceService,
        private newsService: NewsService,
        private programService: ProgramService,
        private courseService: CourseService,
        private lessonService: LessonService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.newsService.query()
            .subscribe((res: HttpResponse<News[]>) => { this.news = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.programService.query()
            .subscribe((res: HttpResponse<Program[]>) => { this.programs = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.courseService.query()
            .subscribe((res: HttpResponse<Course[]>) => { this.courses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.lessonService.query()
            .subscribe((res: HttpResponse<Lesson[]>) => { this.lessons = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.resource.id !== undefined) {
            this.subscribeToSaveResponse(
                this.resourceService.update(this.resource));
        } else {
            this.subscribeToSaveResponse(
                this.resourceService.create(this.resource));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Resource>>) {
        result.subscribe((res: HttpResponse<Resource>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Resource) {
        this.eventManager.broadcast({ name: 'resourceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackNewsById(index: number, item: News) {
        return item.id;
    }

    trackProgramById(index: number, item: Program) {
        return item.id;
    }

    trackCourseById(index: number, item: Course) {
        return item.id;
    }

    trackLessonById(index: number, item: Lesson) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-resource-popup',
    template: ''
})
export class ResourcePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resourcePopupService: ResourcePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.resourcePopupService
                    .open(ResourceDialogComponent as Component, params['id']);
            } else {
                this.resourcePopupService
                    .open(ResourceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
