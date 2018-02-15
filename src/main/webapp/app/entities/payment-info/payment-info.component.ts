import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PaymentInfo } from './payment-info.model';
import { PaymentInfoService } from './payment-info.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-payment-info',
    templateUrl: './payment-info.component.html'
})
export class PaymentInfoComponent implements OnInit, OnDestroy {
paymentInfos: PaymentInfo[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private paymentInfoService: PaymentInfoService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.paymentInfoService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<PaymentInfo[]>) => this.paymentInfos = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.paymentInfoService.query().subscribe(
            (res: HttpResponse<PaymentInfo[]>) => {
                this.paymentInfos = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInPaymentInfos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: PaymentInfo) {
        return item.id;
    }
    registerChangeInPaymentInfos() {
        this.eventSubscriber = this.eventManager.subscribe('paymentInfoListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
