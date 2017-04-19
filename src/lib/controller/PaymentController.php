<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;

// ROUTES
$this->group('/', function() {
    $this->post('', '\Uomi\Controller\PaymentController:postPaymentControllerHandler');
	$this->get('', '\Uomi\Controller\PaymentController:getPaymentControllerHandler');
	$this->get('{payment_id}', '\Uomi\Controller\PaymentController:getPaymentControllerHandlerWithId');
	$this->delete('{payment_id}', '\Uomi\Controller\PaymentController:deletePaymentControllerHandler');
});

class PaymentController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function postPaymentControllerHandler(Request $req, Response $res): Response {
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
		} catch (ModelNotFound $e) {
			$stat = new Status($req);
			$stat = $stat->error("LoanNotFound")->message("Loan not found for " . $req->getAttribute('loan_id') . ".");
			return $res->withStatus(404)->withJson($stat);
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

	public function getPaymentControllerHandler(Request $req, Response $res): Response {
		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );
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

	public function getPaymentControllerHandlerWithId(Request $req, Response $res): Response {		
		$loan;
		$payment;
		
		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );
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

	public function deletePaymentControllerHandler(Request $req, Response $res): Response {	

		try {
			\Uomi\Model\Payment::destroy($req->getAttribute('payment_id'));
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
