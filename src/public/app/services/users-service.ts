import { Injectable , OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UsersService implements OnInit { 

	private baseUrl = 'http://uomi.dev';
	private resource = 'api/users';

	constructor (private http: Http) {

	}

	ngOnInit() {
		// this.http.post(`${this.baseUrl}/${this.resource}`).map();
	}

	postUserToDB(newUser: any) {
		console.log(JSON.stringify(newUser));
		// this.http.post(`${this.baseUrl}/${this.resource}`, JSON.stringify(newUser));
		this.http.get(`${this.baseUrl}/${this.resource}`).subscribe();
	}

}