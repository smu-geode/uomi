<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;
use \Uomi\Factory\PaymentFactory;
use \Uomi\Authentication;
use \Uomi\Status;

// ROUTES
$this->group('/loans/{loan_id}/payments', function() {
    $this->post('/', '\Uomi\Controller\PaymentController:postPaymentCollectionHandler');
	$this->get('/', '\Uomi\Controller\PaymentController:getPaymentCollectionHandler');
	$this->get('/{payment_id}/', '\Uomi\Controller\PaymentController:getPaymentHandler');
	$this->delete('/{payment_id}/', '\Uomi\Controller\PaymentController:deletePaymentHandler');
});

class PaymentController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function postPaymentCollectionHandler(Request $req, Response $res): Response {
		$data = $req->getParsedBody();

		// Create the user
		$factory = new PaymentFactory($this->container);
		try {
			$payment = $factory->submitPaymentForm($data);
		} catch(\RuntimeException $e) {
			return self::badPaymentResponse($res, array_merge($factory->getErrors(),[$e]));
		}

		\Uomi\Factory\AnalyticFactory::track($req);
		
		$stat = new Status($payment);
		$stat = $stat->message('Payment successfully created.');
		return $res->withStatus(201)->withJson($stat); // Created
	}

	public function getPaymentCollectionHandler(Request $req, Response $res): Response {
		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );

			$isToMe = Authentication::isRequestAuthorized($req, $loan->to_user);
			$isFromMe = Authentication::isRequestAuthorized($req, $loan->from_user);

			if(!($isToMe || $isFromMe)) {
				return Authentication::unauthorizedResponse($res);
			}

			$payments = $loan->payments()->get();
			$stat = new Status($payments);
			$stat = $stat->message("Payments found for loan " . $req->getAttribute('loan_id') . ".");
			return $res->withStatus(200)->withJson($stat);
		} catch (ModelNotFound $e) {
			$stat = new Status();
			$stat = $stat->error("LoanNotFound")->message("Loan not found.");
			return $res->withStatus(404)->withJson();
		}
	}

	public function getPaymentHandler(Request $req, Response $res): Response {
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

	protected static function badPaymentResponse(Response $res, array $errorStrings): Response {
		$stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
		$stat = $stat->error('BadPayment')->message('There was an error while making a payment.');

		return $res->withStatus(400)->withJson($stat); // Bad Request
	}
}
