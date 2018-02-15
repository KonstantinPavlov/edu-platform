import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { NewsComments } from './news-comments.model';
import { NewsCommentsPopupService } from './news-comments-popup.service';
import { NewsCommentsService } from './news-comments.service';

@Component({
    selector: 'jhi-news-comments-delete-dialog',
    templateUrl: './news-comments-delete-dialog.component.html'
})
export class NewsCommentsDeleteDialogComponent {

    newsComments: NewsComments;

    constructor(
        private newsCommentsService: NewsCommentsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.newsCommentsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'newsCommentsListModification',
                content: 'Deleted an newsComments'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-news-comments-delete-popup',
    template: ''
})
export class NewsCommentsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private newsCommentsPopupService: NewsCommentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.newsCommentsPopupService
                .open(NewsCommentsDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
