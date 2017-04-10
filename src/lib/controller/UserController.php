<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

// ROUTES
$this->group('/users', function() {
    $this->get('/{user_id}', '\Uomi\Controller\UserController:getUserHandler');
    $this->post('/', '\Uomi\Controller\UserController:postUserCollectionHandler');
});

class UserController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

    public function getUserHandler(Request $req, Response $res): Response {
        try {
            $user = Model\User::findOrFail( $req->getAttribute('user_id') );
            $stat = new Status($user);
            return $res->withJson($stat);
        } catch(ModelNotFoundException $e) { // user not found
            $stat = new Status();
            $stat = $stat->error("InvalidUser")->message("Please make sure user is valid");
            return $res->withStatus(404)->withJson($stat);
        }
    }

    public function postUserCollectionHandler(Request $req, Response $res): Response {

        $data = $req->getParsedBody();

		// Create the user
		$factory = new \Uomi\Factory\UserFactory($this->container);

		try {
			$user = $factory->submitUserRegistrationForm($data);
		} catch(\RuntimeException $e) {
			return self::badUserRegistrationResponse($res, $factory->getErrors());
		}

		$stat = new \Uomi\Status($user);
		$stat = $stat->message('User successfully created.');
		return $res->withStatus(201)->withJson($stat); // Created
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

    public static function badUserRegistrationResponse(Response $res, array $errorStrings): Response {
        $stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
        $stat = $stat->error('BadUserRegistration')->message('There was an error in registering the user.');

        return $res->withStatus(400)->withJson($stat); // Bad Request
    }
}
