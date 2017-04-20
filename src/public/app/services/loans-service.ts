import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication-service';

import { Loan } from './loan';

@Injectable()
export class LoansService { 

	constructor(private http: Http,
				private router: Router,
				private authService: AuthenticationService) {}

	getLoansForUser(id: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/${id}/loans/`, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	extractData(res: Response) {
		let loan = new Loan();
		let data = res.json().data;
		let result: object = {'from_me':[], 'to_me':[]};
		for(let loanObject of data['from_me'] || {}) {
			result['from_me'].push(loan.deserialize(loanObject));
		}
		for(let loanObject of data['to_me'] || {}) {
			result['to_me'].push(loan.deserialize(loanObject));
		}
		return result;
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