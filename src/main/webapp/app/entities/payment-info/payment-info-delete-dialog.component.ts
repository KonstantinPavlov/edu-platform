import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentInfo } from './payment-info.model';
import { PaymentInfoPopupService } from './payment-info-popup.service';
import { PaymentInfoService } from './payment-info.service';

@Component({
    selector: 'jhi-payment-info-delete-dialog',
    templateUrl: './payment-info-delete-dialog.component.html'
})
export class PaymentInfoDeleteDialogComponent {

    paymentInfo: PaymentInfo;

    constructor(
        private paymentInfoService: PaymentInfoService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentInfoService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'paymentInfoListModification',
                content: 'Deleted an paymentInfo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-payment-info-delete-popup',
    template: ''
})
export class PaymentInfoDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentInfoPopupService: PaymentInfoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.paymentInfoPopupService
                .open(PaymentInfoDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
