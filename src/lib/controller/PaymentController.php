<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;
use \Uomi\Authentication;
use \Uomi\Status;

// ROUTES
$this->group('/loans/{loan_id}/payments', function() {
    $this->post('/', '\Uomi\Controller\PaymentController:postPaymentCollectionHandler');
	$this->get('/', '\Uomi\Controller\PaymentController:getPaymentHandler');
	$this->get('/{payment_id}/', '\Uomi\Controller\PaymentController:getPaymentHandlerWithID');
	$this->delete('/{payment_id}/', '\Uomi\Controller\PaymentController:deletePaymentHandler');
});

class PaymentController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function postPaymentCollectionHandler(Request $req, Response $res): Response {
		$form = $req->getParsedBody();
		$loan;

		$amount = $form['amount_cents'];
		$details = $form['details'];

		if($amount === null) {
			$stat = new Status($form);
            $stat = $stat->error("InvalidRequestFormat")->message("Please make sure to include an amount for the payment.");
            return $res->withStatus(400)->withJson($stat);
		}

		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );


			$auth = new Authentication();
			$isTo = $auth->isRequestAuthorized($req, $loan->to_user);
			$auth = new Authentication();
			$isFrom = $auth->isRequestAuthorized($req, $loan->from_user);

			if(!($isTo || $isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}

		} catch (ModelNotFound $e) {
			$stat = new Status($req);
			$stat = $stat->error("LoanNotFound")->message("Loan not found for " . $req->getAttribute('loan_id') . ".");
			return $res->withStatus(404)->withJson($stat);
		}

		if($amount > $loan->balance){
			$stat = new Status($req);
			$stat = $stat->error("Overdraw")->message("Withdrawal amount exceeds balance on loan");
			return $res->withStatus(406)->withJson($stat);
		}

		$payment = new \Uomi\Model\Payment();
		$payment->loan_id = $loan->id;
		$payment->amount_cents = $amount;
		$payment->details = $details;
		$payment->save();

		$stat = new Status($payment);
		$stat = $stat->message("New payment created for loan " . $req->getAttribute('loan_id') . ".");
		return $res->withStatus(201)->withJson($stat);
	}

	public function getPaymentHandler(Request $req, Response $res): Response {
		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );


			$auth = new Authentication();
			$isTo = $auth->isRequestAuthorized($req, $loan->to_user);
			$auth = new Authentication();
			$isFrom = $auth->isRequestAuthorized($req, $loan->from_user);

			if(!($isTo || $isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}


			$payments = $loan->payments;
			$stat = new Status($payments);
			$stat = $stat->message("Payments found for loan " . $req->getAttribute('loan_id') . ".");
			return $res->withStatus(200)->withJson($stat);
		} catch (ModelNotFound $e) {
			$stat = new Status();
			$stat = $stat->error("LoanNotFound")->message("Loan not found.");
			return $res->withStatus(404)->withJson($req);
		}
	}

	public function getPaymentHandlerWithId(Request $req, Response $res): Response {
		$loan;
		$payment;

		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );


			$auth = new Authentication();
			$isTo = $auth->isRequestAuthorized($req, $loan->to_user);
			$auth = new Authentication();
			$isFrom = $auth->isRequestAuthorized($req, $loan->from_user);

			if(!($isTo || $isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}


		} catch (ModelNotFound $e) {
			$stat = new Status($req);
			$stat = $stat->error("LoanNotFound")->message("Loan not found for " . $req->getAttribute('loan_id') . ".");
			return $res->withStatus(404)->withJson($stat);
		}

		try {
			$payment = $loan->payments->where( 'id', $req->getAttribute('payment_id') );
		} catch (ModelNotFound $e) {
			$stat = new Status($req);
			$stat = $stat->error("PaymnetNotFound")->message("Payment not found for " . $req->getAttribute('payment_id') . ".");
			return $res->withStatus(404)->withJson($stat);
		}

		$stat = new Status($payment);
		$stat = $stat->message("Payments found for loan " . $req->getAttribute('loan_id') . ".");
		return $res->withStatus(200)->withJson($stat);
	}

	public function deletePaymentHandler(Request $req, Response $res): Response {

		try {
			$payment = \Uomi\Model\Payment::findOrFail($req->getAttribute('payment_id'));


			$auth = new Authentication();
			$isFrom = $auth->isRequestAuthorized($req, $payment->from_user);

			if(!($isTo || $isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}


			$payment->delete();
		} catch (ModelNotFound $e) {
			$stat = new Status($req);
			$stat = $stat->error("PaymnetNotFound")->message("Payment not found for " . $req->getAttribute('payment_id') . ".");
			return $res->withStatus(404)->withJson($stat);
		}

		$stat = new Status();
		$stat = $stat->message("Payment deleted for loan " . $req->getAttribute('loan_id') . ".");
		return $res->withStatus(200)->withJson($stat);
	}
}
