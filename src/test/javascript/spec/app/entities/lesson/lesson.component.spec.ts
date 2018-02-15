/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EduPlatformTestModule } from '../../../test.module';
import { LessonComponent } from '../../../../../../main/webapp/app/entities/lesson/lesson.component';
import { LessonService } from '../../../../../../main/webapp/app/entities/lesson/lesson.service';
import { Lesson } from '../../../../../../main/webapp/app/entities/lesson/lesson.model';

describe('Component Tests', () => {

    describe('Lesson Management Component', () => {
        let comp: LessonComponent;
        let fixture: ComponentFixture<LessonComponent>;
        let service: LessonService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [LessonComponent],
                providers: [
                    LessonService
                ]
            })
            .overrideTemplate(LessonComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LessonComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LessonService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Lesson(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.lessons[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
