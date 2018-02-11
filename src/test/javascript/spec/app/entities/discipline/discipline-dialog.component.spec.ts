/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { EduPlatformTestModule } from '../../../test.module';
import { DisciplineDialogComponent } from '../../../../../../main/webapp/app/entities/discipline/discipline-dialog.component';
import { DisciplineService } from '../../../../../../main/webapp/app/entities/discipline/discipline.service';
import { Discipline } from '../../../../../../main/webapp/app/entities/discipline/discipline.model';
import { ProgramService } from '../../../../../../main/webapp/app/entities/program';

describe('Component Tests', () => {

    describe('Discipline Management Dialog Component', () => {
        let comp: DisciplineDialogComponent;
        let fixture: ComponentFixture<DisciplineDialogComponent>;
        let service: DisciplineService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [DisciplineDialogComponent],
                providers: [
                    ProgramService,
                    DisciplineService
                ]
            })
            .overrideTemplate(DisciplineDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DisciplineDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DisciplineService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Discipline(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.discipline = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'disciplineListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Discipline();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.discipline = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'disciplineListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
