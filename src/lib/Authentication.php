<?php

namespace Uomi;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;

class Authentication {

	private $errors;

	function __construct() {
		$this->errors = [];
	}

	public function isRequestAuthorized(Request $req, int $user_id = null): bool {
		$token = $this->getBearerToken($req);
		if($token === "") {
			array_push($this->errors, 'No token found.');
			return false;
		}

		if($user_id === null) {
			try {
				$session = \Uomi\Model\Session::where('token', $token)->first();
				return true;
			} catch (ModelNotFoundException $e) {
				array_push($this->errors, 'No session open for that token');
				return false;
			}
		}else {
			try {
				$session = \Uomi\Model\Session::where('token', $token)->first();
				if($user_id == $session->user_id) {
					return true;
				}else {
					array_push($this->errors, 'User not authorized to access that data.');
					return false;
				}
			} catch (ModelNotFoundException $e) {
				array_push($this->errors, 'No session open for that token.');
				return false;
			}
		}
	}

	private function getBearerToken(Request $req): string {
		$header = $req->getHeaders();

		$auth;
		foreach($header as $name => $value) {
			if($name == 'HTTP_AUTHORIZATION') {
				$auth = $value ?? null;
			}
		}

		if($auth === null) {
			array_push('No authorization field');
		}

		$token = explode(' ', $auth[0]);
		//array_push($this->errors, $token[0]);
		if($token[0] != "Bearer") {
			array_push($this->errors, 'Token is not of type Bearer');
		} else {
			if (sizeof($this->errors) == 0) {
				return $token[1] ?? "";
			}	
		}
		return "";
	}

	public function getErrors(): array {
		return $this->errors;
	}

	public static function unathroizedResponse(Response $res, array $errorStrings): Response {
        $stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
        $stat = $stat->error('UnathorizedAccess')->message('You do not have permission to access this data.');

        return $res->withStatus(401)->withJson($stat); // Bad Request
    }
}
