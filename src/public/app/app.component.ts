import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {

	private isAuthenticated: boolean;
	private isAuthenticatedSubscription: Subscription;

	constructor(private authService: AuthenticationService) {
		console.log('AppComponent.constructor: subscribing to isAuthenticated');

		this.isAuthenticatedSubscription = authService.isAuthenticated
			.subscribe(newValue => this.isAuthenticated = newValue);
	}

	didClickLogOutButton() {
		this.authService.logOut();
	}
}
