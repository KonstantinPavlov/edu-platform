/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { EduPlatformTestModule } from '../../../test.module';
import { ProgramDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/program/program-delete-dialog.component';
import { ProgramService } from '../../../../../../main/webapp/app/entities/program/program.service';

describe('Component Tests', () => {

    describe('Program Management Delete Component', () => {
        let comp: ProgramDeleteDialogComponent;
        let fixture: ComponentFixture<ProgramDeleteDialogComponent>;
        let service: ProgramService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [ProgramDeleteDialogComponent],
                providers: [
                    ProgramService
                ]
            })
            .overrideTemplate(ProgramDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProgramDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProgramService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
