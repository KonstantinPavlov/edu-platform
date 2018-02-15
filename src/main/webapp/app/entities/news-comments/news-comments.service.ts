import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { NewsComments } from './news-comments.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<NewsComments>;

@Injectable()
export class NewsCommentsService {

    private resourceUrl =  SERVER_API_URL + 'api/news-comments';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/news-comments';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(newsComments: NewsComments): Observable<EntityResponseType> {
        const copy = this.convert(newsComments);
        return this.http.post<NewsComments>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(newsComments: NewsComments): Observable<EntityResponseType> {
        const copy = this.convert(newsComments);
        return this.http.put<NewsComments>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<NewsComments>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<NewsComments[]>> {
        const options = createRequestOption(req);
        return this.http.get<NewsComments[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<NewsComments[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<NewsComments[]>> {
        const options = createRequestOption(req);
        return this.http.get<NewsComments[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<NewsComments[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: NewsComments = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<NewsComments[]>): HttpResponse<NewsComments[]> {
        const jsonResponse: NewsComments[] = res.body;
        const body: NewsComments[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to NewsComments.
     */
    private convertItemFromServer(newsComments: NewsComments): NewsComments {
        const copy: NewsComments = Object.assign({}, newsComments);
        copy.commentDate = this.dateUtils
            .convertDateTimeFromServer(newsComments.commentDate);
        return copy;
    }

    /**
     * Convert a NewsComments to a JSON which can be sent to the server.
     */
    private convert(newsComments: NewsComments): NewsComments {
        const copy: NewsComments = Object.assign({}, newsComments);

        copy.commentDate = this.dateUtils.toDate(newsComments.commentDate);
        return copy;
    }
}
