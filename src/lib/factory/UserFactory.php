<?php

namespace Uomi\Factory;

use \Slim\Container;

use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;

use \Uomi\Status;
use \Uomi\Model\User;
use \Uomi\HashedPassword;

class UserFactory {

	private $container;
	private $errors;

	function __construct(Container $c) {
		$this->container = $c;
		$this->errors = [];
	}

	public function submitUserRegistrationForm(array $data): User {
		$form = self::makeForm();
		$formResult = [];

		// Validate the form
		try {
			$formResult = $form->submit($data);
		} catch(\RuntimeException $e) {
			$this->errors += $form->getErrors();
			throw $e;
		}

		// Create the user
		$user = $this->create($formResult['email'], $formResult['password']); // throws
		$user->save();
		return $user;
	}

	public function create(string $email, string $plainTextPassword): User {

		// CONFLICT CHECKS
		if($exists = \Uomi\Model\User::where('email',$email)->first()) {
			$esc = htmlspecialchars($email);
			$this->errors += ["The email $esc is already in use."];
			throw new \RuntimeException();
		}

		// CREATION
		$user = new User();
		$user->email = $email;
		$user->password = HashedPassword::makeFromPlainText($plainTextPassword);
		$settings = new \Uomi\Model\Settings();
		$settings->user_id = $user->id;
		return $user;
	}

	public function getErrors(): array {
		return $this->errors;
	}

	public static function makeForm(): \Uomi\Form {
		$emailValidator = v::notEmpty()->email()->setName('Email');
		$passwordValidator = v::notEmpty()->length(8, null)->setName('Password');
		$form = new \Uomi\Form('User Registration');
		$form->addField(
			\Uomi\Field::make()->name('Email', 'email')->required()->validated($emailValidator)
		);
		$form->addField(
			\Uomi\Field::make()->name('Password', 'password')->required()->validated($passwordValidator)
		);
		return $form;
	}

}
