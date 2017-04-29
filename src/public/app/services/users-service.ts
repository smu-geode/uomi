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

	signUp(newUser: any): Observable<object> {
		console.log(JSON.stringify(newUser));
		let options = this.authService.getRequestOptions();

		return this.http.post(`api/users/`, JSON.stringify(newUser), options)
				.map(this.extractData)
				.catch(this.handleError);
		
		// this.http.get(`${this.baseUrl}/${this.resource}`).subscribe();
	}

	getUserInfo(userId: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/${userId}/`, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	updatePassword(userId: number, email: string, oldPassword: string, newPassword: string): Observable<object> {
		let accountUpdate = {
			'email': email,
			'oldPassword': oldPassword,
			'newPassword': newPassword
		};

		let options = this.authService.getRequestOptions();
		return this.http.put(`api/users/${userId}/`, JSON.stringify(accountUpdate), options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getSettings(userId: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/${userId}/settings/`, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	updateSettings(userId: number, allowNotifications: boolean, 
		borrowingRequests: boolean, payBackReminders: boolean, 
		allowEmailUseBySearch: boolean): Observable<object> {
		
		let settings = {
			'allNotifications': allowNotifications,
			'borrowingRequests': borrowingRequests,
			'payBackReminders': payBackReminders,
			'allowEmailUseBySearch': allowEmailUseBySearch
		};

		let options = this.authService.getRequestOptions();

		return this.http.put(`api/users/${userId}/settings/`, JSON.stringify(settings), options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	searchUserByName(userName: string): Observable<object> {

		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/?name=${userName}`, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	searchUserByEmail(userEmail: string): Observable<object> {

		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/?email=${userEmail}`, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	extractData(response: Response) {
		// let body = response.json();
		// console.log("Response body: ");
		// console.log(body);
		return response.json().data || { }
	}

	handleError(error: Response | any) {
		let errorMessage: string;
		let err: string;
		if (error instanceof Response) {
			let body = error.json() || '';
			err = body.error || JSON.stringify(body);
			errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errorMessage = error._body.message ? error._body.message : error.toString();
		}
		console.error(errorMessage);
		return Observable.throw(err);
	}

}