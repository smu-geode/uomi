<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Uomi\HashedPassword;
use \Uomi\Status;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

// ROUTES
$this->group('/sessions', function() {
	$this->post('', '\Uomi\Controller\SessionController:postSessionCollectionHandler');
	$this->delete('', '\Uomi\Controller\SessionController:deleteSessionCollectionHandler');
});

class SessionController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function postSessionCollectionHandler(Request $req, Response $res): Response{
		$form = $req->getParsedBody();

		$email = $form['email'] ?? null;
		$password = $form['password'] ?? null;

		if($email === null) {
			$stat = new Status($req);
			$stat = $stat->error("InvalidRequestFormat")->message("Please include an email attribute");
			return $res->withStatus(400)->withJson($stat);
		}elseif($password === null) {
			$stat = new Status($req);
			$stat = $stat->error("InvalidRequestFormat")->message("Please include a password attribute");
			return $res->withStatus(400)->withJson($stat);
		}

		$user;
		try {
			$user = \Uomi\Model\User::where('email' , $email)->first();
		}catch(ModelNotFound $e) {
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Resource not found in the database");
			return $res->withStatus(404)->withJson($stat);
		}

		$challenge = HashedPassword::makeFromPlainTextWithSalt($password, $user->salt);

		if(HashedPassword::compare($challenge, $user->password)) {
			$session = new \Uomi\Model\Session();
			$session->user_id = $user->id;
			$session->session_key = hash("sha512", $user->id . microtime());
			$session->save();
			$stat = new Status($session);
			$stat = $stat->message("Session created");
			return $res->withStatus(201)->withJson($stat);
		} else {
			$stat = new Status();
			$stat = $stat->error("Unauthorized")->message("Incorrect email or password");
			return $res->withStatus(401)->withJson($stat);
		}
		
	}

	public function deleteSessionCollectionHandler(Request $req, Response $res): Response {
		$form = $req->getParsedBody();

		$session_key = $form['session_key'] ?? null;

		if($session_key === null) {
			$stat = new Status($req);
			$stat = $stat->error("InvalidRequestFormat")->message("Please include a password attribute");
			return $res->withStatus(400)->withJson($stat);
		}

		try {
			$sessModel = \Uomi\Model\Session::where('session_key', $session_key)->first();
			$sessModel->delete();
			$stat = new Status();
			$stat = $stat->message("Session delete. User is now logged out.");
			return $res->withStatus(200)->withJson($stat);
		}catch(ModelNotFound $e) {
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Resource not found in the database");
			return $res->withStatus(404)->withJson($stat);
		}
	}
}
