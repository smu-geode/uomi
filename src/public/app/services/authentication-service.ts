import { Injectable , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthenticationService implements OnInit { 

	private baseUrl = 'http://uomi.dev';
	private resource = 'api/sessions';

	constructor(private http: Http,
				private router: Router) {

	}

	ngOnInit() {}

	logIn(logInForm: any) {
		let options = this.getRequestOptions();

		this.http.post(`api/sessions/`, JSON.stringify(logInForm), options)
			.map(this.extractData)
			.catch(this.handleError)
			.subscribe(res => {
				// place data payload in sessionStorage
				sessionStorage.setItem('user_id', res.data.user_id);
				sessionStorage.setItem('token', res.data.token);
				this.router.navigate(['/dashboard']);
			}
		);
	}

	logOutUser() {
		let options = this.getRequestOptions();

		this.http.delete(`api/sessions/`, options)
			.map(this.extractData)
			.catch(this.handleError)
			.subscribe(res => {
				sessionStorage.clear();
				this.router.navigate(['/registration']);
			});
	}

	isUserAuthenticated(): boolean {
		return sessionStorage.getItem('token') !== null;
	}

	getCurrentUserId(): number {
		return +sessionStorage.getItem('user_id');
	}

	rerouteIfNotAuthenticated(route: string): void {
		if (!this.isUserAuthenticated()) {
			this.router.navigate([route]);
		}
	}

	getRequestOptions(): RequestOptions {
		let headers = {'Content-Type': 'application/json'};
		if(this.isUserAuthenticated()) {
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