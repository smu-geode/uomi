<?php

namespace Uomi;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;
use \Uomi\Model\Session;

class Authentication {

	private $errors;

	function __construct() {
		$this->errors = [];
	}

	public static function isRequestAuthorized(Request $req, int $user_id = null): bool {

		try {
			$token = self::getSessionToken($req);
		} catch(\RuntimeException $e) {
			return false;
		}

		try {
			$session = Session::where('token', $token)->firstOrFail();
		} catch (ModelNotFoundException $e) {
			return false; // session does not exist
		}

		// if the session exists and $user_id is null, we don't care what user
		// holds the token
		if($user_id === null) {
			return true;
		}

		// Otherwise we must additionally check that the session belongs to the
		// given user ID.
		return $session->user_id === $user_id;
	}

	public static function getCurrentUserId(Request $req): int {
		try {
			$token = self::getSessionToken($req);
		} catch(\RuntimeException $e) {
			return null;
		}

		try {
			$session = Session::where('token', $token)->firstOrFail();
		} catch(ModelNotFoundException $e) {
			return null;
		}

		return $session->user_id;
	}

	public static function getSessionToken(Request $req): string {
		$header = $req->getHeaders();

		$authorizationHeader = $req->getHeaders()['HTTP_AUTHORIZATION'][0];
		$headerArray = explode(' ', $authorizationHeader);

		if(count($headerArray) !== 2) {
			throw new \RuntimeException('Authorization header must be of the form "Bearer [token]"');
		}

		if($headerArray[0] !== 'Bearer') {
			throw new \RuntimeException('Authorization header not of type Bearer.');
		}

		$token = $headerArray[1];
		return $token;
	}

	public static function unauthorizedResponse(Response $res): Response {
        $stat = new Status();
        $stat = $stat->error('MustBeLoggedIn')->message('You must be logged in to perform this action.');
        return $res->withStatus(401)->withJson($stat);
    }
}
