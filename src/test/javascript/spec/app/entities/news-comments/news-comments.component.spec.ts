/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EduPlatformTestModule } from '../../../test.module';
import { NewsCommentsComponent } from '../../../../../../main/webapp/app/entities/news-comments/news-comments.component';
import { NewsCommentsService } from '../../../../../../main/webapp/app/entities/news-comments/news-comments.service';
import { NewsComments } from '../../../../../../main/webapp/app/entities/news-comments/news-comments.model';

describe('Component Tests', () => {

    describe('NewsComments Management Component', () => {
        let comp: NewsCommentsComponent;
        let fixture: ComponentFixture<NewsCommentsComponent>;
        let service: NewsCommentsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [NewsCommentsComponent],
                providers: [
                    NewsCommentsService
                ]
            })
            .overrideTemplate(NewsCommentsComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(NewsCommentsComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NewsCommentsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new NewsComments(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.newsComments[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
