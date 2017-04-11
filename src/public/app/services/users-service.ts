import { Injectable , OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UsersService implements OnInit { 

	private baseUrl = 'http://uomi.dev';
	private resource = 'api/users';

	constructor (private http: Http) {

	}

	// ngOnInit() {
	// 	this.http.post(`${this.baseUrl}/${this.resource}`).map();
	// }

	postUserToDB(newUser: any) {
		this.http.post(`${this.baseUrl}/${this.resource}`, JSON.stringify(newUser));
	}

	// getItems() : MovieItem[] {
	// 	return [
    //         new MovieItem('I am Legend', 2007, './images/i_am_legend.jpg'),
    //         new MovieItem('Independence Day', 1996, './images/independence_day.jpg'),
    //         new MovieItem('Hancock', 2008, './images/hancock.jpg')
    //     ];
	// }
}