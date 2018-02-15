/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { EduPlatformTestModule } from '../../../test.module';
import { PaymentInfoDetailComponent } from '../../../../../../main/webapp/app/entities/payment-info/payment-info-detail.component';
import { PaymentInfoService } from '../../../../../../main/webapp/app/entities/payment-info/payment-info.service';
import { PaymentInfo } from '../../../../../../main/webapp/app/entities/payment-info/payment-info.model';

describe('Component Tests', () => {

    describe('PaymentInfo Management Detail Component', () => {
        let comp: PaymentInfoDetailComponent;
        let fixture: ComponentFixture<PaymentInfoDetailComponent>;
        let service: PaymentInfoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [PaymentInfoDetailComponent],
                providers: [
                    PaymentInfoService
                ]
            })
            .overrideTemplate(PaymentInfoDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentInfoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentInfoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PaymentInfo(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.paymentInfo).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
