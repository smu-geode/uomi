<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;

// ROUTES
$this->group('/users', function() {
    $this->get('/{user_id}', '\Uomi\UserController:getUserHandler');
    $this->post('/', '\Uomi\UserController:postUserCollectionHandler');
});

class UserController {

    private $container;
	private $emailValidator;
	private $passwordValidator;

    function __construct(Container $c) {
        $this->container = $c;

		$this->emailValidator = v::email()->length(null, 254);
		$this->passwordValidator = v::length(8, 254);
    }

    private static function arrayToHtmlUnorderedList(array $a): string {
        $li = array_map(function($e){
			$he = htmlspecialchars($e);
			return "<li>$he</li>";
	    }, $a);
		return '<ul>'. implode('',$li) .'</ul>';
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

        $form = $req->getParsedBody();

        $email = $form['email'];
        $plainTextPassword = $form['password'];

		// FIELD VALIDATION
        try {
			$this->emailValidator->check($email);
			$this->passwordValidator->check($plainTextPassword);
        } catch(NestedValidationException $exception) {
			// this gets an array of human readable validation fixes
            return self::badUserRegistrationResponse($res, $exception->getMessages());
        }

		// CONFLICT CHECKS
		if($otherUser = User::where('email',$email)->first()) {
			$esc = htmlspecialchars($email);
			return self::badUserRegistrationResponse($res, ["The email $esc is already in use."]);
		}

		// CREATION
		$user = new \Uomi\Model\User();
		$user->email = $email;
		$user->password = new HashedPassword($plainTextPassword);
		$user->save();

		$stat = new Status($user);
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
		$message = self::arrayToHtmlUnorderedList($errorStrings);

        $stat = new Status([ 'errors' => $errorStrings ]);
        $stat = $stat->error('BadUserRegistration')->message($message);

        $res = $res->withStatus(400)->withJson($stat); // Bad Request
    }
}
