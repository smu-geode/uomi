import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [ AuthenticationService ]
})

export class LoginComponent { 
	user: any;
	incorrect: boolean;

	private serverError: string;
	private isServerError: boolean;

	constructor(private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute ) {
		this.user = {
			email: '',
			password: ''
		};
		this.incorrect = false;
	}

	authenticateUser() {
		// call to users service
		this.authService.logIn(this.user).subscribe(res => {
			console.log(res);
			sessionStorage.setItem('user_id', res.data.user_id);
			sessionStorage.setItem('token', res.data.token);
			this.authService.isAuthenticated.next(true);
			this.router.navigate(['/dashboard']);
		}, err => {
				let errors = JSON.parse(err);
				console.log(errors);
				this.serverError = errors['data']['errors'][0];
				console.log(this.serverError);
				this.isServerError = true;
		});
	}
}
