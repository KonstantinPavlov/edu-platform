import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PaymentInfo } from './payment-info.model';
import { PaymentInfoService } from './payment-info.service';

@Injectable()
export class PaymentInfoPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private paymentInfoService: PaymentInfoService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.paymentInfoService.find(id)
                    .subscribe((paymentInfoResponse: HttpResponse<PaymentInfo>) => {
                        const paymentInfo: PaymentInfo = paymentInfoResponse.body;
                        paymentInfo.paymentDate = this.datePipe
                            .transform(paymentInfo.paymentDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.paymentInfoModalRef(component, paymentInfo);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.paymentInfoModalRef(component, new PaymentInfo());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    paymentInfoModalRef(component: Component, paymentInfo: PaymentInfo): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.paymentInfo = paymentInfo;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
