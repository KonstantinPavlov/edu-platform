/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EduPlatformTestModule } from '../../../test.module';
import { DisciplineComponent } from '../../../../../../main/webapp/app/entities/discipline/discipline.component';
import { DisciplineService } from '../../../../../../main/webapp/app/entities/discipline/discipline.service';
import { Discipline } from '../../../../../../main/webapp/app/entities/discipline/discipline.model';

describe('Component Tests', () => {

    describe('Discipline Management Component', () => {
        let comp: DisciplineComponent;
        let fixture: ComponentFixture<DisciplineComponent>;
        let service: DisciplineService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [DisciplineComponent],
                providers: [
                    DisciplineService
                ]
            })
            .overrideTemplate(DisciplineComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DisciplineComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DisciplineService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Discipline(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.disciplines[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
