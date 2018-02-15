import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Lesson } from './lesson.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Lesson>;

@Injectable()
export class LessonService {

    private resourceUrl =  SERVER_API_URL + 'api/lessons';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/lessons';

    constructor(private http: HttpClient) { }

    create(lesson: Lesson): Observable<EntityResponseType> {
        const copy = this.convert(lesson);
        return this.http.post<Lesson>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(lesson: Lesson): Observable<EntityResponseType> {
        const copy = this.convert(lesson);
        return this.http.put<Lesson>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Lesson>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Lesson[]>> {
        const options = createRequestOption(req);
        return this.http.get<Lesson[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Lesson[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Lesson[]>> {
        const options = createRequestOption(req);
        return this.http.get<Lesson[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Lesson[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Lesson = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Lesson[]>): HttpResponse<Lesson[]> {
        const jsonResponse: Lesson[] = res.body;
        const body: Lesson[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Lesson.
     */
    private convertItemFromServer(lesson: Lesson): Lesson {
        const copy: Lesson = Object.assign({}, lesson);
        return copy;
    }

    /**
     * Convert a Lesson to a JSON which can be sent to the server.
     */
    private convert(lesson: Lesson): Lesson {
        const copy: Lesson = Object.assign({}, lesson);
        return copy;
    }
}
