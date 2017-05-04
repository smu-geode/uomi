<?php

namespace Uomi\Factory;

use \Slim\Container;

use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;
use \Illuminate\Database\Eloquent\ModelNotFoundException;

use \Uomi\Status;
use \Uomi\Model\Loan;
use \Uomi\Model\Category;

class LoanFactory {

	private $container;
	private $errors;

	function __construct(\Slim\Container $c) {
		$this->container = $c;
		$this->errors = [];
	}

	public function submitLoanCreationForm(array $data): Loan {
		$form = self::makeForm();
		$formResult = [];

		try {
			$formResult = $form->submit($data);
		} catch(\RuntimeException $e) {
			$this->errors += $form->getErrors();
			throw $e;
		}

		$loan = $this->create($formResult['to_user'], $formResult['from_user'], $formResult['amount_cents'], $formResult['category_id']);
		$loan->save();
		return $loan;
	}

	public function create(string $to_user, string $from_user, string $amount_cents, string $name): Loan {
		try {
			$categoryModel = \Uomi\Model\Category::where('name', $name)->firstOrFail();
		} catch(ModelNotFoundException $e) {
			try {
				$categoryModel = \Uomi\Model\Category::findOfFail(4);
			} catch (ModelNotFoundException $f) {
				$this->errors += [$f];
				throw new \RuntimeException();
			}
		}

		$loan = new Loan();
		$loan->to_user = $to_user;
		$loan->from_user = $from_user;
		$loan->amount_cents = $amount_cents;
		$loan->category_id = $categoryModel->id;

		return $loan;
	}

	public function getErrors(): array {
		return $this->errors;
	}

	public static function makeForm(): \Uomi\Form {
		$form = new \Uomi\Form('Loan Creation');
		$form->addField(
			\Uomi\Field::make()->name('To User', 'to_user')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('From User', 'from_user')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('Loan amount(Cents)', 'amount_cents')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('Category', 'category_id')
		);
		return $form;
	}
}

