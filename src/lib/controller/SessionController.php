<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Uomi\Factory\SessionFactory;
use \Uomi\HashedPassword;
use \Uomi\Status;
use \Uomi\Analytics;
use \Uomi\Authentication;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

// ROUTES
$this->group('/sessions', function() {
	$this->post('/', '\Uomi\Controller\SessionController:postSessionCollectionHandler');
	$this->delete('/', '\Uomi\Controller\SessionController:deleteSessionCollectionHandler');
});

class SessionController {

	private $container;

	function __construct(Container $c) {
		$this->container = $c;
	}

	public function postSessionCollectionHandler(Request $req, Response $res): Response {
		$data = $req->getParsedBody();

		// Create the user
		$factory = new SessionFactory($this->container);
		try {
			$session = $factory->submitLogInForm($data);
		} catch(\RuntimeException $e) {
			return self::badLogInResponse($res, $factory->getErrors());
		}

		\Uomi\Factory\AnalyticFactory::track($req);
		
		$stat = new Status($session);
		$stat = $stat->message('Session successfully created.');
		return $res->withStatus(201)->withJson($stat); // Created
	}

	public function deleteSessionCollectionHandler(Request $req, Response $res): Response {
		
		try {
			$token = Authentication::getSessionToken($req);
		} catch(\RuntimeException $e) {
			return Authentication::unauthorizedResponse($res);
		}

		try {
			$sessModel = \Uomi\Model\Session::where('token', $token)->firstOrFail();
			$sessModel->delete();
			$stat = new Status();
			return $res->withStatus(201)->withJson($stat);
		} catch(ModelNotFoundException $e) {
			$stat = new Status();
			$stat = $stat->error('SessionNotFound');
			return $res->withStatus(404)->withJson($stat);
		}
	}

	protected static function badLogInResponse(Response $res, array $errorStrings): Response {
		$stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
		$stat = $stat->error('BadLogIn')->message('There was an error while logging in.');

		return $res->withStatus(400)->withJson($stat); // Bad Request
	}
}
