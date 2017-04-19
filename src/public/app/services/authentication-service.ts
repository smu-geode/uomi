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

	verifyUserAccount(user: any) {
		console.log(JSON.stringify(user));
		let headers = new Headers({'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: headers});

		this.http.post(`${this.baseUrl}/${this.resource}/`, JSON.stringify(user), options)
				.map(this.extractData)
                .catch(this.handleError)
                .subscribe(r => {
					sessionStorage.setItem('userId', r.id);
					sessionStorage.setItem('token', r.session);
                    // document.cookie = "username=" + user.email;
                    // document.cookie = "isAuthenticated=true";
                    this.router.navigate(['/dashboard']);
        });
	}

	extractData(response: Response) {
		let body = response.json();
        console.log("Response body: ");
        console.log(body);
        return body.data || { }
	}

	handleError(error: Response | any) {
		let errorMessage: string;
		if (error instanceof Response) 
        {
            let body = error.json() || '';
            let err = body.error || JSON.stringify(body);
            errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
        } 
        else 
        {
            errorMessage = error._body.message ? error._body.message : error.toString();
        }
        console.error(errorMessage);
        return Observable.throw(errorMessage);
	}

}	