import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
	private _allow_notifications: boolean;
	private _borrow_requests: boolean;
	private _payback_reminders: boolean;
	private _view_email: boolean;

	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

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
			this._allow_notifications = (x['allow_notifications'] == "0" ? false : true);
			this._borrow_requests = (x['borrow_requests'] == "0" ? false : true);
			this._payback_reminders = (x['payback_reminders'] == "0" ? false : true);
			this._view_email = (x['view_email'] == "0" ? false : true);
		}, err =>{
			console.error(err);
		});
	}

	updateSettings() {
		this.usersService.updateSettings(+sessionStorage.getItem('user_id'), this._allow_notifications, 
			this._borrow_requests, this._payback_reminders, this._view_email)
			.subscribe(x => {console.log(x); this.cancel()}, err => console.log(err));
	}

	cancel() {
		this.closeModal.emit();
	}
}
