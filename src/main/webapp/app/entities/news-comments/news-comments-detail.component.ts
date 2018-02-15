import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { NewsComments } from './news-comments.model';
import { NewsCommentsService } from './news-comments.service';

@Component({
    selector: 'jhi-news-comments-detail',
    templateUrl: './news-comments-detail.component.html'
})
export class NewsCommentsDetailComponent implements OnInit, OnDestroy {

    newsComments: NewsComments;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private newsCommentsService: NewsCommentsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInNewsComments();
    }

    load(id) {
        this.newsCommentsService.find(id)
            .subscribe((newsCommentsResponse: HttpResponse<NewsComments>) => {
                this.newsComments = newsCommentsResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInNewsComments() {
        this.eventSubscriber = this.eventManager.subscribe(
            'newsCommentsListModification',
            (response) => this.load(this.newsComments.id)
        );
    }
}
