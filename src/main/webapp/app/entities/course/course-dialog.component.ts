import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Course } from './course.model';
import { CoursePopupService } from './course-popup.service';
import { CourseService } from './course.service';
import { Student, StudentService } from '../student';
import { Program, ProgramService } from '../program';
import { PaymentInfo, PaymentInfoService } from '../payment-info';

@Component({
    selector: 'jhi-course-dialog',
    templateUrl: './course-dialog.component.html'
})
export class CourseDialogComponent implements OnInit {

    course: Course;
    isSaving: boolean;

    students: Student[];

    programs: Program[];

    paymentinfos: PaymentInfo[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private courseService: CourseService,
        private studentService: StudentService,
        private programService: ProgramService,
        private paymentInfoService: PaymentInfoService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.studentService.query()
            .subscribe((res: HttpResponse<Student[]>) => { this.students = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.programService.query()
            .subscribe((res: HttpResponse<Program[]>) => { this.programs = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.paymentInfoService.query()
            .subscribe((res: HttpResponse<PaymentInfo[]>) => { this.paymentinfos = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.course.id !== undefined) {
            this.subscribeToSaveResponse(
                this.courseService.update(this.course));
        } else {
            this.subscribeToSaveResponse(
                this.courseService.create(this.course));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Course>>) {
        result.subscribe((res: HttpResponse<Course>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Course) {
        this.eventManager.broadcast({ name: 'courseListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackStudentById(index: number, item: Student) {
        return item.id;
    }

    trackProgramById(index: number, item: Program) {
        return item.id;
    }

    trackPaymentInfoById(index: number, item: PaymentInfo) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-course-popup',
    template: ''
})
export class CoursePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private coursePopupService: CoursePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.coursePopupService
                    .open(CourseDialogComponent as Component, params['id']);
            } else {
                this.coursePopupService
                    .open(CourseDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
