import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Discipline } from './discipline.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Discipline>;

@Injectable()
export class DisciplineService {

    private resourceUrl =  SERVER_API_URL + 'api/disciplines';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/disciplines';

    constructor(private http: HttpClient) { }

    create(discipline: Discipline): Observable<EntityResponseType> {
        const copy = this.convert(discipline);
        return this.http.post<Discipline>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(discipline: Discipline): Observable<EntityResponseType> {
        const copy = this.convert(discipline);
        return this.http.put<Discipline>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Discipline>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Discipline[]>> {
        const options = createRequestOption(req);
        return this.http.get<Discipline[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Discipline[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Discipline[]>> {
        const options = createRequestOption(req);
        return this.http.get<Discipline[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Discipline[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Discipline = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Discipline[]>): HttpResponse<Discipline[]> {
        const jsonResponse: Discipline[] = res.body;
        const body: Discipline[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Discipline.
     */
    private convertItemFromServer(discipline: Discipline): Discipline {
        const copy: Discipline = Object.assign({}, discipline);
        return copy;
    }

    /**
     * Convert a Discipline to a JSON which can be sent to the server.
     */
    private convert(discipline: Discipline): Discipline {
        const copy: Discipline = Object.assign({}, discipline);
        return copy;
    }
}
