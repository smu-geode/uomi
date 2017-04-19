<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;
use \RuntimeException;

use \Uomi\Status;
use \Uomi\Model\User;
use \Uomi\Factory\UserFactory;

// ROUTES
$this->group('/users', function() {
    $this->group('/{user_id}', function() {
        $this->get('/', '\Uomi\Controller\UserController:getUserHandler');
    });
    $this->post('/', '\Uomi\Controller\UserController:postUserCollectionHandler');
});

class UserController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

    public function getUserHandler(Request $req, Response $res): Response {
        try {
            $user = User::findOrFail( $req->getAttribute('user_id') );
            return $res->withJson(new Status($user));
        } catch(ModelNotFoundException $e) { // user not found
            return self::invalidUserResponse($res);
        }
    }

    public function postUserCollectionHandler(Request $req, Response $res): Response {

        $data = $req->getParsedBody();

		// Create the user
		$factory = new UserFactory($this->container);

		try {
			$user = $factory->submitUserRegistrationForm($data);
		} catch(RuntimeException $e) {
			return self::badUserRegistrationResponse($res, $factory->getErrors());
		}

		$stat = new Status($user);
		$stat = $stat->message('User successfully created.');
		return $res->withStatus(201)->withJson($stat); // Created
    }

    public static function invalidUserResponse(Response $res): Response {
        $stat = new Status();
        $stat = $stat->error("InvalidUser")->message("Please make sure user is valid");
        return $res->withStatus(404)->withJson($stat);
    }

    protected static function badUserRegistrationResponse(Response $res, array $errorStrings): Response {
        $stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
        $stat = $stat->error('BadUserRegistration')->message('There was an error in registering the user.');

        return $res->withStatus(400)->withJson($stat); // Bad Request
    }
}
