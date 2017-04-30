import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service';
import { UsersService } from '../services/users-service';

@Component({
	selector: 'settings-form',
	templateUrl: './settings-form.component.html',
	providers: [ AuthenticationService ]
})

export class SettingsFormComponent implements OnInit {
	
	private settings: object = {};
	private allow_notifications: boolean;
	private borrow_requests: boolean;
	private payback_reminders: boolean;
	private view_email: boolean;

	constructor(private authService: AuthenticationService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {}

	ngOnInit() {
		this.authService.rerouteIfAuthenticated('/dashboard');
		this.authService.rerouteIfNotAuthenticated('/login');
		this.usersService.getSettings(+sessionStorage.getItem('user_id')).subscribe(x => {
			console.log(x);
			this.settings = x;
			this.allow_notifications = x['allow_notifications'];
			this.borrow_requests = x['borrow_requests'];
			this.payback_reminders = x['payback_reminders'];
			this.view_email = x['view_email'];
		}, err =>{
			console.error(err);
		});
	}

	// get AllowNotifications(): boolean {
	// 	return this.allow_notifications;
	// }

	// set AllowNotifications(val: boolean) {
	// 	this.allow_notifications = val;
	// }

	// get BorrowRequests(): boolean {
	// 	return this.borrow_requests;
	// }

	// set BorrowRequests(val: boolean) {
	// 	this.borrow_requests = val;
	// }

	// get PaybackReminders(): boolean {
	// 	return this.payback_reminders;
	// }

	// set PaybackReminders(val: boolean) {
	// 	this.payback_reminders = val;
	// }

	// get ViewEmail(): boolean {
	// 	return this.view_email;
	// }

	// set ViewEmail(val: boolean) {
	// 	this.view_email = val;
	// }

}
