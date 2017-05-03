<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;
use \Uomi\Authentication;

use \Uomi\Model\Loan;
use \Uomi\Model\User;

// ROUTES
$this->group('/loans', function() {
	$this->post('/', '\Uomi\Controller\LoanController:postLoanCollectionHandler');
	$this->get('/categories/', '\Uomi\Controller\LoanController:getLoanCategoryCollectionHandler');
	$this->get('/{loan_id}/', '\Uomi\Controller\LoanController:getLoanHandler');
	$this->put('/{loan_id}/', '\Uomi\Controller\LoanController:putLoanHandler');
	$this->delete('/{loan_id}/', '\Uomi\Controller\LoanController:deleteLoanHandler');
});

$this->group('/users/{user_id}/loans', function() {
	$this->get('/', '\Uomi\Controller\LoanController:getUserLoanCollection');
});

class LoanController {

	private $container;

	function __construct(Container $c) {
		$this->container = $c;
	}

	public function getLoanHandler(Request $req, Response $res): Response {
		
		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );
			
			$isTo = Authentication::isRequestAuthorized($req, $loan->to_user);
			$isFrom = Authentication::isRequestAuthorized($req, $loan->from_user);

			if(!($isTo || $isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}

			$stat = new Status($loan);
			$stat = $stat->message("Loan found");
			return $res->withStatus(200)->withJson($stat);
		} catch (ModelNotFoundException $e) {
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Loan with id:" . $req->getAttribute('loan_id') . " is not found");
			return $res->withStatus(404)->withJson($stat);
		}
	}

	public function getUserLoanCollection(Request $req, Response $res): Response {
		$auth = new Authentication();
		if(!$auth->isRequestAuthorized($req, $req->getAttribute('user_id'))) {
			return $auth->unauthorizedResponse($res);
		}
		try {
			$user = User::findOrFail( $req->getAttribute('user_id') );
		} catch(ModelNotFoundException $e) { // user not found
			return \Uomi\Controller\UserController::invalidUserResponse($res);
		}

		$stat = new Status(['from_me' => $user->loansFrom()->get(), 'to_me' => $user->loansTo()->get()]);
		return $res->withJson($stat);
	}

	public function getLoanCategoryCollectionHandler(Request $req, Response $res): Response {
		return $res->withJson( new Status(\Uomi\Model\Category::all() ));
	}

	public function putLoanHandler(Request $req, Response $res): Response {
		$form = $req->getParsedBody();

		$details = $form['details'] ?? null;
		$category_id = $form['category_id'] ?? null;

		$catModel = null;
		try {
			$catModel = \Uomi\Model\Category::findOrFail($category_id);
		}catch (ModelNotFoundException $e) {
			$stat = new \Uomi\Status();
			$stat = $stat->error("CategoryNotFound")->message("Category is not found");
			return $res->withStatus(404)->withJson($stat);
		}

		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );

			$auth = new Authentication();
			$isFrom = $auth->isRequestAuthorized($req, $loan->from_user);

			if(!($isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}

			$loan->details = $details;
			$loan->category_id = $catModel->id;
			$loan->save();

			$stat = new Status($loan);
			$stat = $stat->message("Loan found");
			return $res->withStatus(200)->withJson($stat);

		} catch (ModelNotFoundException $e) {
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Loan with id:" . $loan_id . " is not found");
			return $res->withStatus(404)->withJson($stat);
		}
	}

	public function postLoanCollectionHandler(Request $req, Response $res): Response {
		$form = $req->getParsedBody();

		$to_user = $form['to_user'] ?? null;
		$from_user = $form['from_user'] ?? null;
		$amount_cents = $form['amount_cents'] ?? null;
		$category_id = $form['category_id'] ?? null;


		$auth = new Authentication();
		$isTo = $auth->isRequestAuthorized($req, $to_user);
		$auth = new Authentication();
		$isFrom = $auth->isRequestAuthorized($req, $from_user);

		if(!($isTo || $isFrom)) {
			return \Authentication\unauthorizedResponse($res);
		}


		if($to_user === null) {
			$stat = new Status($form);
			$stat = $stat->error("InvalidRequestFormat")->message("Please make sure to include who the loan is to");
			return $res->withStatus(400)->withJson($stat);
		} elseif($from_user === null) {
			$stat = new Status($form);
			$stat = $stat->error("InvalidRequestFormat")->message("Please make sure to include who the loan is from");
			return $res->withStatus(400)->withJson($stat);
		} elseif ($amount_cents === null) {
			$stat = new Status($form);
			$stat = $stat->error("InvalidRequestFormat")->message("Please make sure to include the amount of the loan");
			return $res->withStatus(400)->withJson($stat);
		} elseif($category_id === null) {
			$stat = new Status($form);
			$stat = $stat->error("InvalidRequestFormat")->message("Please make sure to include a category for the loan");
			return $res->withStatus(400)->withJson($stat);
		} elseif($to_user === $from_user) {
			$stat = new Status($form);
			$stat = $stat->error("DuplicateUser")->message("Please make sure user ID's are unique");
			return $res->withStatus(400)->withJson($stat);
		}


		$loan = new \Uomi\Model\Loan();
		$loan->to_user = $to_user;
		$loan->from_user = $from_user;
		$loan->amount_cents = $amount_cents;

		$catModel;
		try {
			$catModel = \Uomi\Model\Category::findOrFail($category_id);
		}catch (ModelNotFoundException $e) {
			$stat = new \Uomi\Status();
			$stat = $stat->error("CategoryNotFound")->message("Category is not found");
			return $res->withStatus(404)->withJson($stat);
		}

		$loan->category_id = $catModel->id;
		$loan->save();


		$stat = new \Uomi\Status($loan);
		$stat = $stat->message('Loan successfully created.');
		return $res->withStatus(201)->withJson($stat);
	}

	public function deleteLoanHandler(Request $req, Response $res): Response {

		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );


			$auth = new Authentication();
			$isFrom = $auth->isRequestAuthorized($req, $loan->from_user);

			if(!($isFrom)) {
				return $auth->unathroizedResponse($res, $auth->getErrors());
			}

			$loan->delete();
			$stat = new Status();
			$stat = $stat->message("Loan deleted");
			return $res->withStatus(200)->withJson($stat);
		} catch (ModelNotFoundException $e) {
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Loan with id:" . $loan_id . " is not found");
			return $res->withStatus(404)->withJson($stat);
		} catch (\RuntimeExcetpion $e) {
			$stat = new Status();
			$stat = $stat->error("RuntimeException")->message("Loan with id:" . $loan_id . " was not deleted");
			return $res->withStatus(400)->withJson($stat);
		}
	}
}
