import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication-service';

import { Loan } from './loan';

@Injectable()
export class LoansService { 
	private baseUrl = 'http://uomi.dev';
	private resource = 'api/loans';

	constructor(private http: Http,
				private router: Router,
				private authService: AuthenticationService) {}

	getLoansForUser(id: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/users/${id}/loans/`, options)
			.map(this.extractLoanData)
			.catch(this.handleError);
	}

	postNewLoan(fromUser: number, toUser: number, amountCents: number, category: number): Observable<object> {
		let newLoan: object = {
			'to_user': toUser,
			'from_user': fromUser,
			'amount_cents': amountCents,
			'category_id': category
		};

		let options = this.authService.getRequestOptions();

		return this.http.post(`api/loans/`, JSON.stringify(newLoan), options)
			.map(this.extractLoanData)
			.catch(this.handleError);
	}

	getLoanById(loanId: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/loans/${loanId}/`, options)
			.map(this.extractSingleLoanData)
			.catch(this.handleError);
	}

	updateLoanData(loanId: number, fromUser: number, amountCents: number, categoryId: number): Observable<object> {
		let updateData = {
			'from_user': fromUser,
			'amount_cents': amountCents,
			'category_id': categoryId
		};

		let options = this.authService.getRequestOptions();

		return this.http.put(`api/loans/${loanId}/`, JSON.stringify(updateData), options)
			.map(this.extractLoanData)
			.catch(this.handleError);
	}

	deleteLoan(loanId: number) {
		let options = this.authService.getRequestOptions();

		this.http.delete(`api/loans/${loanId}/`, options)
			.map(this.extractLoanData)
			.catch(this.handleError);
	}

	getPaymentsForLoan(loanId: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/loans/${loanId}/payments/`, options)
			.map(this.extractPaymentData)
			.catch(this.handleError);
	}

	addPaymentToLoan(loan: Loan, amount: number, details: string): Observable<object> {

		let payment = {
			'loan_id': loan.id,
			'amount_cents': amount,
			'details': details,
			'from_user': loan.to.id,
			'to_user': loan.from.id
		};

		let options = this.authService.getRequestOptions();

		let sub = this.http.post(`api/loans/${loan.id}/payments/`, payment, options)
				.map(this.extractPaymentData)
				.catch(this.handleError);

		return sub;
	}

	getPaymentForLoan(loanId: number, paymentId: number): Observable<object> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/loans/${loanId}/payments/${paymentId}/`, options)
			.map(this.extractPaymentData)
			.catch(this.handleError);
	}

	getCategories(): Observable<object[]> {
		let options = this.authService.getRequestOptions();

		return this.http.get(`api/loans/categories/`, options)
			.map(this.extractCategoryData)
			.catch(this.handleError);
	}

	extractLoanData(res: Response) {
		let loan = new Loan();
		let data = res.json().data;
		let result: object = {'from_me':[], 'to_me':[]};
		for(let loanObject of data['from_me'] || {}) {
			result['from_me'].push(loan.deserialize(loanObject));
		}
		for(let loanObject of data['to_me'] || {}) {
			result['to_me'].push(loan.deserialize(loanObject));
		}
		return result || { };
	}

	extractSingleLoanData(res: Response) {
		// let loan = new Loan();
		return res.json().data || { };

	}

	extractPaymentData(res: Response) {
		return res.json().data || { };
	}

	extractCategoryData(res: Response) {
		return res.json().data || { };
	}

	handleError(error: Response | any) {
		if(error instanceof Response) {
			try {
				console.error('LoansService error:', JSON.parse(error['_body']));
			} catch(e) {
				console.error('LoansService error:', error['_body']);
			}
		} else {
			console.error('LoansService error', error);
		}
		return Observable.throw('LoansService error handler todo');
	}

}