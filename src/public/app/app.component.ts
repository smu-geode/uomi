import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  providers: [AuthenticationService]
})
export class AppComponent {

	private isAuthenticated: boolean;
	private isAuthenticatedSubscription: Subscription;

	constructor(private authService: AuthenticationService) {
		// this.isAuthenticated = authService.isAuthenticated.getValue();
		this.isAuthenticatedSubscription = authService
		.isAuthenticated.subscribe(newValue => {
			console.log('change:', newValue);
			this.isAuthenticated = newValue;
		});
	}

	didClickLogOutButton() {
		this.authService.logOut();
	}
}
