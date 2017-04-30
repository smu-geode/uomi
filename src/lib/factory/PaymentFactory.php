<?php

namespace Uomi\Factory;

use \Slim\Container;

use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;

use \Uomi\Status;
use \Uomi\Model\Payment;

class PaymentFactory {

	private $container;
	private $errors;

	function __construct(Contianer $c) {
		$this->container = $c;
		$this->errors = [];
	}

	public function submitLoanCreationForm(array $data): Payment {
		$form = self::makeForm();
		$formResult = [];

		try {
			$fromResult = $form->submit($data);
		} catch(\RuntimeException $e) {
			$this->errors += $form->getErrors();
			throw $e;
		}

		$payment = $this->create($formResult['amount_cents']);
		return $payment;
	}

	public function create(string $amount_cents): Payment {
		$payment = new Payment();
		$payment->amount_cents = $amount_cents;

		return $payment;
	}

	public function getErrors(): array {
		return $this->errors;
	}

	public static function makeForm(): \Uomi\Form {
		$form = new \Uomi\Form('Payment Creation');
		$form->addField(
			\Uomi\Field::make()->name('Payment amount(Cents)', 'amount_cents')->required()
		);
	}
}

