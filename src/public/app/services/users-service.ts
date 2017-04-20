import { Injectable , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from './authentication-service';

@Injectable(
	// providers: [AuthenticationService]
)
export class UsersService implements OnInit { 

	constructor(private http: Http,
				private router: Router,
				private authService: AuthenticationService) {

	}

	ngOnInit() {
		// this.http.post(`${this.baseUrl}/${this.resource}`).map();
	}

	signUp(newUser: any) {
		console.log(JSON.stringify(newUser));
		let options = this.authService.getRequestOptions();

		this.http.post(`api/users/`, JSON.stringify(newUser), options)
				.map(this.extractData)
				.catch(this.handleError)
				.subscribe(r => {
					console.log("user created: ")
					console.log(r);
					this.authService.logIn(newUser);
		});
		
		// this.http.get(`${this.baseUrl}/${this.resource}`).subscribe();
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
		} else {
			errorMessage = error._body.message ? error._body.message : error.toString();
		}
		console.error(errorMessage);
		return Observable.throw(errorMessage);
	}

}