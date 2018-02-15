import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { NewsComments } from './news-comments.model';
import { NewsCommentsPopupService } from './news-comments-popup.service';
import { NewsCommentsService } from './news-comments.service';
import { News, NewsService } from '../news';

@Component({
    selector: 'jhi-news-comments-dialog',
    templateUrl: './news-comments-dialog.component.html'
})
export class NewsCommentsDialogComponent implements OnInit {

    newsComments: NewsComments;
    isSaving: boolean;

    news: News[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private newsCommentsService: NewsCommentsService,
        private newsService: NewsService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.newsService.query()
            .subscribe((res: HttpResponse<News[]>) => { this.news = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.newsComments.id !== undefined) {
            this.subscribeToSaveResponse(
                this.newsCommentsService.update(this.newsComments));
        } else {
            this.subscribeToSaveResponse(
                this.newsCommentsService.create(this.newsComments));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<NewsComments>>) {
        result.subscribe((res: HttpResponse<NewsComments>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: NewsComments) {
        this.eventManager.broadcast({ name: 'newsCommentsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackNewsById(index: number, item: News) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-news-comments-popup',
    template: ''
})
export class NewsCommentsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private newsCommentsPopupService: NewsCommentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.newsCommentsPopupService
                    .open(NewsCommentsDialogComponent as Component, params['id']);
            } else {
                this.newsCommentsPopupService
                    .open(NewsCommentsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
