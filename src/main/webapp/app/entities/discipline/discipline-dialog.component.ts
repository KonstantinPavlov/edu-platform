import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Discipline } from './discipline.model';
import { DisciplinePopupService } from './discipline-popup.service';
import { DisciplineService } from './discipline.service';
import { Program, ProgramService } from '../program';

@Component({
    selector: 'jhi-discipline-dialog',
    templateUrl: './discipline-dialog.component.html'
})
export class DisciplineDialogComponent implements OnInit {

    discipline: Discipline;
    isSaving: boolean;

    programs: Program[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private disciplineService: DisciplineService,
        private programService: ProgramService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.programService.query()
            .subscribe((res: HttpResponse<Program[]>) => { this.programs = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.discipline.id !== undefined) {
            this.subscribeToSaveResponse(
                this.disciplineService.update(this.discipline));
        } else {
            this.subscribeToSaveResponse(
                this.disciplineService.create(this.discipline));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Discipline>>) {
        result.subscribe((res: HttpResponse<Discipline>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Discipline) {
        this.eventManager.broadcast({ name: 'disciplineListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProgramById(index: number, item: Program) {
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
    selector: 'jhi-discipline-popup',
    template: ''
})
export class DisciplinePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private disciplinePopupService: DisciplinePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.disciplinePopupService
                    .open(DisciplineDialogComponent as Component, params['id']);
            } else {
                this.disciplinePopupService
                    .open(DisciplineDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
