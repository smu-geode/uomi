<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;
use \RuntimeException;

use \Uomi\Status;
use \Uomi\Model\User;
use \Uomi\Model\Settings;
use \Uomi\Factory\UserFactory;
use \Uomi\HashedPassword;

// ROUTES
$this->group('/users', function() {
    $this->group('/{user_id}', function() {
        $this->get('/', '\Uomi\Controller\UserController:getUserHandler');
		$this->put('/', '\Uomi\Controller\UserController:putUserHandler');

		$this->get('/settings/', '\Uomi\Controller\UserController:getUserSettingsHandler');
		$this->put('/settings/', '\Uomi\Controller\UserController:putUserSettingsHandler');
    });
    $this->post('/', '\Uomi\Controller\UserController:postUserCollectionHandler');
});

class UserController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

    public function getUserHandler(Request $req, Response $res): Response {
		$auth = new Authentication();
		$isAuth = $auth->isRequestAuthorized($req);

		if(!($isAuth)) {
			return $auth->unathroizedResponse($res, $auth->getErrors());
		}

        try {
            $user = User::findOrFail( $req->getAttribute('user_id') );
            return $res->withJson(new Status($user));
        } catch(ModelNotFoundException $e) { // user not found
            return self::invalidUserResponse($res);
        }
    }

    public function postUserCollectionHandler(Request $req, Response $res): Response {
		//again no authorization errors
        $data = $req->getParsedBody();

		// Create the user
		$factory = new UserFactory($this->container);

		try {
			$user = $factory->submitUserRegistrationForm($data);
		} catch(RuntimeException $e) {
			return self::badUserRegistrationResponse($res, $factory->getErrors());
		}

		try {
			$settings = new \Uomi\Model\Settings();  //creating new settings when user is created
			$settings->user_id = $user->id;
			$settings->save();
		} catch(ModelNotFoundException $e) {
			$stat = new Status($e);
			return $res->withJson($stat);
		}

		$stat = new Status($user);
		$stat = $stat->message('User successfully created.');
		return $res->withStatus(201)->withJson($stat); // Created
    }

	public function getUserSettingsHandler(Request $req, Response $res): Response {
		$auth = new Authentication();
		$isAuth = $auth->isRequestAuthorized($req, $req->getAttribute('user_id'));

		if(!($isAuth)) {
			return $auth->unathroizedResponse($res, $auth->getErrors());
		}

		try {
			$settings = Settings::where("user_id", $req->getAttribute('user_id'))->first();
			$stat = new Status($settings);
			$stat = $stat->message('Got settings.');
			return $res->withStatus(200)->withJson($stat); // Get
		} catch(ModelNotFoundException $e) { //user/settings not found
			return self::invalidUserResponse($res);
		}
	}

	public function putUserSettingsHandler(Request $req, Response $res): Response {
		$auth = new Authentication();
		$isAuth = $auth->isRequestAuthorized($req, $req->getAttribute('user_id'));

		if(!($isAuth)) {
			return $auth->unathroizedResponse($res, $auth->getErrors());
		}

		$data = $req->getParsedBody();

		try {
			$settings = Settings::where("user_id", $req->getAttribute('user_id'))->first();

			$allNotifications = $data['allNotifications'] ?? $settings->allow_notif;
			$borrowingRequests = $data['borrowingRequests'] ?? $settings->borrow_requests;
			$payBackReminders = $data['payBackReminders'] ?? $settings->payback_reminders;
			$viewEmail = $data['viewEmail'] ?? $settings->view_email;

			$settings->allNotifications = $allNotifications;
			$settings->borrowingRequests = $borrowingRequests;
			$settings->payBackReminders = $payBackReminders;
			$settings->viewEmail = $viewEmail;
			$settings->save();

			$stat = new Status($settings);
			$stat = $stat->message("User updated");
			return $res->withStatus(201)->withJson($stat); // Updated
		} catch(ModelNotFoundException $e) { //user not found
			return self::invalidUserResponse($res);
		}
	}

	public function putUserHandler(Request $req, Response $res): Response {
		$auth = new Authentication();
		$isAuth = $auth->isRequestAuthorized($req, $req->getAttribute('user_id'));

		if(!($isAuth)) {
			return $auth->unathroizedResponse($res, $auth->getErrors());
		}

		$data = $req->getParsedBody();

		$oldPassword = $data['oldPassword'] ?? null;
		$newPassword = $data['newPassword'] ?? null;

		if($oldPassword === null || $newPassword === null) {
			$stat = new Status();
			$stat = $stat->error("BadUserUpdate")->message("There was an error updating the user. Password(s) blank.");
			return $res->withStatus(400)->withJson($stat);
		}
		//never check whether a user has proper access to modify; will implement later i suppose
		try {
			$user = \Uomi\Model\User::findOrFail($req->getAttribute('user_id'));
			$user->password = HashedPassword::makeFromPlainText($newPassword);  //where does the hashing occur again? i think we'll replace this with better implementation later
			$user->save();

			$stat = new Status($user);
			$stat = $stat->message("User updated");
			return $res->withStatus(201)->withJson($stat); // Updated
		} catch(ModelNotFoundException $e) { //user not found
			return self::invalidUserResponse($res);
		}
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
