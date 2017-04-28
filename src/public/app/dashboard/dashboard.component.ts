import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { ModalService } from '../services/modal-service';
import { Loan } from '../services/loan';
import * as c3 from 'c3';

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

	isLoaded: boolean = false;

	loans: Loan[] = [];
	loansFromMe: Loan[] = [];
	loansToMe: Loan[] = [];
	errorMessage: any;

	lentTotal: number;
	borrowedTotal: number;

	loanIdForPayment: number;

	@ViewChild('chartsElement') chartsElement: any;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService,
				private loansService: LoansService,
				private modalService: ModalService) {}

	ngOnInit() {
		this.authService.rerouteIfNotAuthenticated('/registration');

		let userId = this.authService.getCurrentUserId();
		this.loansService.getLoansForUser(userId).subscribe(
			data => this.didLoadLoanData(data),
			error => this.errorMessage = <any>error
		);		
	}

	ngAfterContentInit() {
		this.loadCharts();
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

	loadCharts() {
		console.log('loadCharts DUMMY');
		console.log(this.chartsElement);
		// let chart = c3.generate({
		// 	bindto: this.chartsElement.nativeElement,
		// 	data: {
		// 		// iris data from R
		// 		columns: [
		// 		['data1', 30],
		// 		['data2', 120],
		// 		],
		// 		type : 'pie',
		// 		onclick: function (d, i) { console.log("onclick", d, i); },
		// 		onmouseover: function (d, i) { console.log("onmouseover", d, i); },
		// 		onmouseout: function (d, i) { console.log("onmouseout", d, i); }
		// 	}
		// });
	}

	openModal(id: string) {
		console.log("open modal: " + id);
		this.modalService.openModal(id);
	}

	openPaymentModal(loanId: number) {
		this.loanIdForPayment = loanId;
		this.modalService.openModal('payment-modal');
	}

	closeModal(id: string) {
		this.modalService.closeModal(id);
	}

	didClickLogOutButton() {
		this.authService.logOut();
	}

}
