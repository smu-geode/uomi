import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication-service';

@Injectable()
export class LoansService { 

	constructor(private http: Http,
				private router: Router,
				private authService: AuthenticationService) {}

	getLoansForUser(id: number): Observable<object[]> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/${id}/loans/`, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	extractData(res: Response) {
		let body = res.json();
		return body.data || [];
	}

	handleError(error: Response | any) {
		let errorMessage: string;
		if (error instanceof Response) {
			let body = error.json() || '';
			let err = body.error || JSON.stringify(body);
			errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errorMessage = error._body.message ? error._body.message : error.toString();
		}
		console.error(errorMessage);
		return Observable.throw(errorMessage);
	}

}