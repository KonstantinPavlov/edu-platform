/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { EduPlatformTestModule } from '../../../test.module';
import { DisciplineDetailComponent } from '../../../../../../main/webapp/app/entities/discipline/discipline-detail.component';
import { DisciplineService } from '../../../../../../main/webapp/app/entities/discipline/discipline.service';
import { Discipline } from '../../../../../../main/webapp/app/entities/discipline/discipline.model';

describe('Component Tests', () => {

    describe('Discipline Management Detail Component', () => {
        let comp: DisciplineDetailComponent;
        let fixture: ComponentFixture<DisciplineDetailComponent>;
        let service: DisciplineService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [DisciplineDetailComponent],
                providers: [
                    DisciplineService
                ]
            })
            .overrideTemplate(DisciplineDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DisciplineDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DisciplineService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Discipline(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.discipline).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
