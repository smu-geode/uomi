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

	ngOnInit() {
		// this.http.post(`${this.baseUrl}/${this.resource}`).map();
	}

	logIn(user: any) {
		console.log(JSON.stringify(user));
		let options = this.getRequestOptions();

		this.http.post(`${this.baseUrl}/${this.resource}/`, JSON.stringify(user), options)
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
		let headers = new Headers({'Content-Type': 'application/json'});
		return new RequestOptions({headers: headers});
	}

	extractData(response: Response) {
		// let body = response.json();
		// console.log("Response body: ");
		// console.log(body);
		return response.json() || { }
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