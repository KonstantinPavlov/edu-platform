import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PaymentInfo } from './payment-info.model';
import { PaymentInfoPopupService } from './payment-info-popup.service';
import { PaymentInfoService } from './payment-info.service';
import { Course, CourseService } from '../course';
import { Student, StudentService } from '../student';

@Component({
    selector: 'jhi-payment-info-dialog',
    templateUrl: './payment-info-dialog.component.html'
})
export class PaymentInfoDialogComponent implements OnInit {

    paymentInfo: PaymentInfo;
    isSaving: boolean;

    courses: Course[];

    students: Student[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private paymentInfoService: PaymentInfoService,
        private courseService: CourseService,
        private studentService: StudentService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.courseService
            .query({filter: 'payments-is-null'})
            .subscribe((res: HttpResponse<Course[]>) => {
                if (!this.paymentInfo.courseId) {
                    this.courses = res.body;
                } else {
                    this.courseService
                        .find(this.paymentInfo.courseId)
                        .subscribe((subRes: HttpResponse<Course>) => {
                            this.courses = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.studentService.query()
            .subscribe((res: HttpResponse<Student[]>) => { this.students = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.paymentInfo.id !== undefined) {
            this.subscribeToSaveResponse(
                this.paymentInfoService.update(this.paymentInfo));
        } else {
            this.subscribeToSaveResponse(
                this.paymentInfoService.create(this.paymentInfo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PaymentInfo>>) {
        result.subscribe((res: HttpResponse<PaymentInfo>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PaymentInfo) {
        this.eventManager.broadcast({ name: 'paymentInfoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCourseById(index: number, item: Course) {
        return item.id;
    }

    trackStudentById(index: number, item: Student) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-payment-info-popup',
    template: ''
})
export class PaymentInfoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentInfoPopupService: PaymentInfoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.paymentInfoPopupService
                    .open(PaymentInfoDialogComponent as Component, params['id']);
            } else {
                this.paymentInfoPopupService
                    .open(PaymentInfoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
