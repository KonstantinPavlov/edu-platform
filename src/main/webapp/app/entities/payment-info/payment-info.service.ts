import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { PaymentInfo } from './payment-info.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PaymentInfo>;

@Injectable()
export class PaymentInfoService {

    private resourceUrl =  SERVER_API_URL + 'api/payment-infos';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-infos';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(paymentInfo: PaymentInfo): Observable<EntityResponseType> {
        const copy = this.convert(paymentInfo);
        return this.http.post<PaymentInfo>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(paymentInfo: PaymentInfo): Observable<EntityResponseType> {
        const copy = this.convert(paymentInfo);
        return this.http.put<PaymentInfo>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PaymentInfo>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PaymentInfo[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentInfo[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PaymentInfo[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentInfo[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentInfo[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PaymentInfo = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PaymentInfo[]>): HttpResponse<PaymentInfo[]> {
        const jsonResponse: PaymentInfo[] = res.body;
        const body: PaymentInfo[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PaymentInfo.
     */
    private convertItemFromServer(paymentInfo: PaymentInfo): PaymentInfo {
        const copy: PaymentInfo = Object.assign({}, paymentInfo);
        copy.paymentDate = this.dateUtils
            .convertDateTimeFromServer(paymentInfo.paymentDate);
        return copy;
    }

    /**
     * Convert a PaymentInfo to a JSON which can be sent to the server.
     */
    private convert(paymentInfo: PaymentInfo): PaymentInfo {
        const copy: PaymentInfo = Object.assign({}, paymentInfo);

        copy.paymentDate = this.dateUtils.toDate(paymentInfo.paymentDate);
        return copy;
    }
}
