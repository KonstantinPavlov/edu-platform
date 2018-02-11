/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { EduPlatformTestModule } from '../../../test.module';
import { PaymentInfoDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/payment-info/payment-info-delete-dialog.component';
import { PaymentInfoService } from '../../../../../../main/webapp/app/entities/payment-info/payment-info.service';

describe('Component Tests', () => {

    describe('PaymentInfo Management Delete Component', () => {
        let comp: PaymentInfoDeleteDialogComponent;
        let fixture: ComponentFixture<PaymentInfoDeleteDialogComponent>;
        let service: PaymentInfoService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [PaymentInfoDeleteDialogComponent],
                providers: [
                    PaymentInfoService
                ]
            })
            .overrideTemplate(PaymentInfoDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentInfoDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentInfoService);
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
