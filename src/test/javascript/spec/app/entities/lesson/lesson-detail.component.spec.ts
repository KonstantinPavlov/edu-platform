/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { EduPlatformTestModule } from '../../../test.module';
import { LessonDetailComponent } from '../../../../../../main/webapp/app/entities/lesson/lesson-detail.component';
import { LessonService } from '../../../../../../main/webapp/app/entities/lesson/lesson.service';
import { Lesson } from '../../../../../../main/webapp/app/entities/lesson/lesson.model';

describe('Component Tests', () => {

    describe('Lesson Management Detail Component', () => {
        let comp: LessonDetailComponent;
        let fixture: ComponentFixture<LessonDetailComponent>;
        let service: LessonService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [LessonDetailComponent],
                providers: [
                    LessonService
                ]
            })
            .overrideTemplate(LessonDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LessonDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LessonService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Lesson(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.lesson).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
