<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;

// ROUTES
$this->group('/loans', function() {
    $this->post('/', '\Uomi\Controller\LoanController:postLoanControllerHandler');
	$this->get('/{loan_id}', '\Uomi\Controller\LoanController:getLoanControllerHandler');
	$this->put('/{loan_id}', '\Uomi\Controller\LoanController:putLoanControllerHandler');

	$this->group('/{loan_id}/payments', function() {
		require "PaymentController.php";
	});
});

class LoanController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function getLoanControllerHandler(Request $req, Response $res): Response {

		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );
			$stat = new Status($loan);
			$stat = $stat->message("Loan found");
			return $res->withStatus(200)->withJson($stat);
		} catch (ModelNotFoundException $e) {
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Loan with id:" . $loan_id . " is not found");
			return $res->withStatus(404)->withJson($stat);
		}
	}

	public function putLoanControllerHandler(Request $req, Response $res): Response {
		$form = $req->getParsedBody();

		$details = $form['details'] ?? null;
		$category = $form['category'] ?? null;

		$catModel = null;
		try {
			$catModel = \Uomi\Model\Category::where('name', $category)->findOrFail(1);
		}catch (ModelNotFoundException $e) {
			$catModel = new \Uomi\Model\Category();
			$catModel->name = $category;
			$catModel->icon = "https://maxcdn.icons8.com/Share/icon/User_Interface//ios_application_placeholder1600.png";
			$catModel->save();
		}

		try {
			$loan = \Uomi\Model\Loan::findOrFail( $req->getAttribute('loan_id') );
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

    public function postLoanControllerHandler(Request $req, Response $res): Response {
        $form = $req->getParsedBody();

        $to_user = $form['to_user'] ?? null;
        $from_user = $form['from_user'] ?? null;
        $amount_cents = $form['amount_cents'] ?? null;
        $category = $form['category'] ?? null;


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
		} elseif($category === null) {
			$stat = new Status($form);
            $stat = $stat->error("InvalidRequestFormat")->message("Please make sure to include a category for the loan");
            return $res->withStatus(400)->withJson($stat);
		}


        $loan = new \Uomi\Model\Loan();
        $loan->to_user = $to_user;
        $loan->from_user = $from_user;
        $loan->amount_cents = $amount_cents;

		$catModel = null;
		try {
			//$category = \Uomi\Model\Category::findOrFail(1);
			$catModel = \Uomi\Model\Category::where('name', $category)->findOrFail(1);
		}catch (ModelNotFoundException $e) {
			$category = new \Uomi\Model\Category();
			$category->name = $category;
			$category->icon = "https://maxcdn.icons8.com/Share/icon/User_Interface//ios_application_placeholder1600.png";
			$category->save();
		}


        $loan->category_id = $catModel->id;
        $loan->save();


        $stat = new \Uomi\Status($loan);
		$stat = $stat->message('Loan successfully created.');
		return $res->withStatus(201)->withJson($stat);
    }

    /*
    public function verbModelHandler(Request $req, Response $res): Response {
        // use this format for any endpoint that represents a single model, like
        // `/api/models/1`

        try {
            $modelName = Model\ModelName::findOrFail( $req->getAttribute('model_id') );
            $stat = new Status($modelName);
            return $res->withJson($stat);
        } catch(ModelNotFoundException $e) { // user not found
            $stat = new Status();
            $stat = $stat->error("InvalidModelName")->message("Please make sure ModelName is valid");
            return $res->withStatus(404)->withJson($stat);
        }
    }
    */

    /*
    public function verbModelCollectionHandler(Request $req, Response $res): Response {
        // use this format for any endpoint that represents a collection, like
        // `/api/models`

        // You probably don't want to get **all** of a model - narrow it down!
        // https://laravel.com/docs/5.4/eloquent
        $modelNames = Model\ModelName::all();
        $stat = new Status($modelNames);
        return $res->withJson($stat);

    }
    */

}
