/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { EduPlatformTestModule } from '../../../test.module';
import { NewsCommentsDetailComponent } from '../../../../../../main/webapp/app/entities/news-comments/news-comments-detail.component';
import { NewsCommentsService } from '../../../../../../main/webapp/app/entities/news-comments/news-comments.service';
import { NewsComments } from '../../../../../../main/webapp/app/entities/news-comments/news-comments.model';

describe('Component Tests', () => {

    describe('NewsComments Management Detail Component', () => {
        let comp: NewsCommentsDetailComponent;
        let fixture: ComponentFixture<NewsCommentsDetailComponent>;
        let service: NewsCommentsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [NewsCommentsDetailComponent],
                providers: [
                    NewsCommentsService
                ]
            })
            .overrideTemplate(NewsCommentsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(NewsCommentsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NewsCommentsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new NewsComments(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.newsComments).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
