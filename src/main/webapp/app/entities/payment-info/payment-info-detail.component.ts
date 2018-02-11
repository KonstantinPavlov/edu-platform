import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentInfo } from './payment-info.model';
import { PaymentInfoService } from './payment-info.service';

@Component({
    selector: 'jhi-payment-info-detail',
    templateUrl: './payment-info-detail.component.html'
})
export class PaymentInfoDetailComponent implements OnInit, OnDestroy {

    paymentInfo: PaymentInfo;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private paymentInfoService: PaymentInfoService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPaymentInfos();
    }

    load(id) {
        this.paymentInfoService.find(id)
            .subscribe((paymentInfoResponse: HttpResponse<PaymentInfo>) => {
                this.paymentInfo = paymentInfoResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPaymentInfos() {
        this.eventSubscriber = this.eventManager.subscribe(
            'paymentInfoListModification',
            (response) => this.load(this.paymentInfo.id)
        );
    }
}
