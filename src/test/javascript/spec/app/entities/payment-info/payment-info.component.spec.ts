/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EduPlatformTestModule } from '../../../test.module';
import { PaymentInfoComponent } from '../../../../../../main/webapp/app/entities/payment-info/payment-info.component';
import { PaymentInfoService } from '../../../../../../main/webapp/app/entities/payment-info/payment-info.service';
import { PaymentInfo } from '../../../../../../main/webapp/app/entities/payment-info/payment-info.model';

describe('Component Tests', () => {

    describe('PaymentInfo Management Component', () => {
        let comp: PaymentInfoComponent;
        let fixture: ComponentFixture<PaymentInfoComponent>;
        let service: PaymentInfoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [PaymentInfoComponent],
                providers: [
                    PaymentInfoService
                ]
            })
            .overrideTemplate(PaymentInfoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentInfoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentInfoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PaymentInfo(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.paymentInfos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
