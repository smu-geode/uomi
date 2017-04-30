import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

@Injectable()
export class AuthenticationService { 

	private baseUrl = 'http://uomi.dev';
	private resource = 'api/sessions';

	public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(null); 

	constructor(private http: Http,
				private router: Router) {
		let status = this.checkUserAuthenticated();
		this.isAuthenticated.next(status);
	}

	logIn(logInForm: any) {
		let options = this.getRequestOptions();

		this.http.post(`api/sessions/`, logInForm, options)
			.map(this.extractData)
			.catch(this.handleError)
			.subscribe(res => {
				// place data payload in sessionStorage
				sessionStorage.setItem('user_id', res.data.user_id);
				sessionStorage.setItem('token', res.data.token);
				this.isAuthenticated.next(true);
				this.router.navigate(['/dashboard']);
			})
		;
	}

	logOut() {
		let options = this.getRequestOptions();
		this.http.delete(`api/sessions/`, options)
			.map(this.extractData)
			.catch(this.handleError)
			.subscribe(res => {
				sessionStorage.clear();
				this.isAuthenticated.next(false);
				this.router.navigate(['/registration']);
			})
		;
	}

	checkUserAuthenticated(): boolean {
		return sessionStorage.getItem('token') !== null;
	}

	getCurrentUserId(): number {
		return +sessionStorage.getItem('user_id');
	}

	rerouteIfAuthenticated(route: string) {
		if (this.isAuthenticated.getValue() === true) {
			this.router.navigate([route]);
		}
	}

	rerouteIfNotAuthenticated(route: string) {
		if (this.isAuthenticated.getValue() === false) {
			this.router.navigate([route]);
		}
	}

	getRequestOptions(): RequestOptions {
		let headers = {'Content-Type': 'application/json'};
		if(this.isAuthenticated.getValue() === true) {
			headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
		}
		return new RequestOptions({headers: new Headers(headers)});
	}

	extractData(response: Response) {
		return response.json() || {}
	}

	handleError(error: Response | any) {
		let errorMessage: string;
		if (error instanceof Response) {
			let body = error.json() || '';
			let err = body.error || JSON.stringify(body);
			errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
		} 
		else {
			errorMessage = error._body.message ? error._body.message : error.toString();
		}
		console.error(errorMessage);
		return Observable.throw(errorMessage);
	}

}	