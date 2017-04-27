import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  providers: [AuthenticationService]
})
export class AppComponent {

	private isAuthenticated: boolean;

	constructor(private authService: AuthenticationService) {
		setTimeout(() => console.log('AppComponent heartbeat'), 3000);
		// this.isAuthenticated = authService.isAuthenticated.getValue();
		authService.isAuthenticated.subscribe(newValue => {
			console.log('change:', newValue);
			this.isAuthenticated = newValue;
		});
	}

	didClickLogOutButton() {
		this.authService.logOut();
	}
}
