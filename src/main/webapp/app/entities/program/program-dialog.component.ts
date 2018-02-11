import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Program } from './program.model';
import { ProgramPopupService } from './program-popup.service';
import { ProgramService } from './program.service';
import { Course, CourseService } from '../course';
import { Discipline, DisciplineService } from '../discipline';

@Component({
    selector: 'jhi-program-dialog',
    templateUrl: './program-dialog.component.html'
})
export class ProgramDialogComponent implements OnInit {

    program: Program;
    isSaving: boolean;

    courses: Course[];

    disciplines: Discipline[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private programService: ProgramService,
        private courseService: CourseService,
        private disciplineService: DisciplineService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.courseService.query()
            .subscribe((res: HttpResponse<Course[]>) => { this.courses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.disciplineService.query()
            .subscribe((res: HttpResponse<Discipline[]>) => { this.disciplines = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.program.id !== undefined) {
            this.subscribeToSaveResponse(
                this.programService.update(this.program));
        } else {
            this.subscribeToSaveResponse(
                this.programService.create(this.program));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Program>>) {
        result.subscribe((res: HttpResponse<Program>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Program) {
        this.eventManager.broadcast({ name: 'programListModification', content: 'OK'});
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

    trackDisciplineById(index: number, item: Discipline) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-program-popup',
    template: ''
})
export class ProgramPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private programPopupService: ProgramPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.programPopupService
                    .open(ProgramDialogComponent as Component, params['id']);
            } else {
                this.programPopupService
                    .open(ProgramDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
