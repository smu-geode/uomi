<?php

namespace Uomi\Factory;

use \Slim\Container;

use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;
use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;
use \Uomi\Model\User;
use \Uomi\Model\Session;

use \Uomi\HashedPassword;

class SessionFactory {

	private $container;
	private $errors;

	function __construct(Container $c) {
		$this->container = $c;
		$this->errors = [];
	}

	public function submitLogInForm(array $data): Session {
		$form = self::makeForm();
		$formResult = [];

		// Validate the form
		try {
			$formResult = $form->submit($data);
		} catch(\RuntimeException $e) {
			$this->errors += $form->getErrors();
			throw $e;
		}

		// Create the session
		$session = $this->create($formResult['email'], $formResult['password']); // throws
		$session->save();
		return $session;
	}

	public function create(string $email, string $givenPassword): Session {
		// GETTING THE USER
		try {
			$user = User::where('email', $email)->firstOrFail();
		} catch(ModelNotFoundException $e) { // user not found
			$esc = htmlspecialchars($email);
			$this->errors += ["The user $esc does not exist."];
			throw new \RuntimeException();
		}

		// CREATION
		$session = new Session();

		$givenHash = HashedPassword::makeFromPlainTextWithSalt($givenPassword, $user->salt);
		$doesMatch = HashedPassword::compare($givenHash, $user->password);

		if(!$doesMatch) {
			$this->errors += ["The given password is incorrect."];
			throw new \RuntimeException();
		}

		$session = new \Uomi\Model\Session();
		$session->user()->associate($user);
		$session->token = hash("sha512", $user->id . microtime());

		return $session;
	}

	public function getErrors(): array {
		return $this->errors;
	}

	public static function makeForm(): \Uomi\Form {
		$emailValidator = v::notEmpty()->setName('Email');
		$passwordValidator = v::notEmpty()->setName('Password');
		$form = new \Uomi\Form('Log In');
		$form->addField(
			\Uomi\Field::make()->name('Email', 'email')->required()->validated($emailValidator)
		);
		$form->addField(
			\Uomi\Field::make()->name('Password', 'password')->required()->validated($passwordValidator)
		);
		return $form;
	}

}
