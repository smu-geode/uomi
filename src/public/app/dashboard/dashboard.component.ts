import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { ModalService } from '../services/modal-service';
import { Loan } from '../services/loan';

// export enum SettingsTab {
// 	General,
// 	Security
// }

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	providers: [ 
		UsersService,
		AuthenticationService,
		LoansService,
		ModalService
	]
})
export class DashboardComponent implements OnInit { 

	settingsTab: string = "general";
	isLoaded: boolean = false;

	loans: Loan[] = [];
	loansFromMe: Loan[] = [];
	loansToMe: Loan[] = [];
	errorMessage: any;

	lentTotal: number;
	borrowedTotal: number;

	loanForPayment: Loan;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService,
				private loansService: LoansService,
				private modalService: ModalService) {}

	ngOnInit() {
		this.authService.rerouteIfNotAuthenticated('/login');

		let userId = this.authService.getCurrentUserId();
		this.loansService.getLoansForUser(userId).subscribe(
			data => this.didLoadLoanData(data),
			error => this.errorMessage = <any>error
		);
	}

	didLoadLoanData(loanData: object) {
		this.loansFromMe = loanData['from_me'];
		this.loansFromMe.forEach((l: Loan) => l.fromMe = true );

		this.loansToMe = loanData['to_me'];
		this.loansToMe.forEach((l: Loan) => l.fromMe = false );

		this.loans = this.loansFromMe.concat(this.loansToMe);

		this.lentTotal = this.loansTotal(this.loansFromMe);
		this.borrowedTotal = this.loansTotal(this.loansToMe);

		this.isLoaded = true;
	}

	loansTotal(loans: Loan[]): number {
		let sum = loans.map(l => l.balance).reduce((S, s) => S+s, 0);
		return sum;
	}

	openModal(id: string) {
		console.log("open modal: " + id);
		this.modalService.openModal(id);
	}

	openPaymentModal(loan: Loan) {
		this.loanForPayment = loan;
		this.modalService.openModal('payment-modal');
	}

	closeModal(id: string) {
		this.modalService.closeModal(id);
		
		let userId = this.authService.getCurrentUserId();
		this.loansService.getLoansForUser(userId).subscribe(
			data => this.didLoadLoanData(data),
			error => this.errorMessage = <any>error
		);
	}

	didClickLogOutButton() {
		this.authService.logOut();
	}

	forgiveLoan(loan: Loan) {
		console.log(loan);
		this.loansService.deleteLoan(loan.id).subscribe(x => {
			let userId = this.authService.getCurrentUserId();
			this.loansService.getLoansForUser(userId).subscribe(
				data => this.didLoadLoanData(data),
				error => this.errorMessage = <any>error
			);
		}, err => console.error(err));
		
	}

	setSettingsTab(val: string) {
		this.settingsTab = val;
	}

}
