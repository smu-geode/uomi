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
		this.authService.logIn(this.user);
	}
}
