/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { EduPlatformTestModule } from '../../../test.module';
import { ResourceDialogComponent } from '../../../../../../main/webapp/app/entities/resource/resource-dialog.component';
import { ResourceService } from '../../../../../../main/webapp/app/entities/resource/resource.service';
import { Resource } from '../../../../../../main/webapp/app/entities/resource/resource.model';
import { NewsService } from '../../../../../../main/webapp/app/entities/news';
import { DisciplineService } from '../../../../../../main/webapp/app/entities/discipline';
import { ProgramService } from '../../../../../../main/webapp/app/entities/program';
import { CourseService } from '../../../../../../main/webapp/app/entities/course';
import { LessonService } from '../../../../../../main/webapp/app/entities/lesson';

describe('Component Tests', () => {

    describe('Resource Management Dialog Component', () => {
        let comp: ResourceDialogComponent;
        let fixture: ComponentFixture<ResourceDialogComponent>;
        let service: ResourceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EduPlatformTestModule],
                declarations: [ResourceDialogComponent],
                providers: [
                    NewsService,
                    DisciplineService,
                    ProgramService,
                    CourseService,
                    LessonService,
                    ResourceService
                ]
            })
            .overrideTemplate(ResourceDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Resource(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.resource = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'resourceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Resource();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.resource = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'resourceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
