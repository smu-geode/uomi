<?php

namespace Uomi\Factory;

use \Slim\Container;

use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\ValidationException;
use \Respect\Validation\Exceptions\NestedValidationException;

use \Uomi\Status;
use \Uomi\Model\User;
use \Uomi\Model\Loan;
use \Uomi\Model\Payment;

class PaymentFactory {

	private $container;
	private $errors;

	function __construct(Container $c) {
		$this->container = $c;
		$this->errors = [];
	}

	public function create(string $loan_id, string $from_id, string $to_id, string $details, string $amount_cents): Payment {

		// DATA VALIDATION
		try {
			$loan = Loan::findOrFail($loan_id);
			$fromUser = User::findOrFail($from_id);
			$toUser = User::findOrFail($to_id);
		} catch(ModelNotFoundException $e) { // user not found
			$esc = htmlspecialchars($email);
			$this->errors += ["Either the sending or receiving users or the loan with which this payment is associated are invalid."];
			throw new \RuntimeException();
		}

		// CREATION
		$payment = new Payment();
		$payment->loan()->associate($loan);
		$payment->from()->associate($fromUser);
		$payment->to()->associate($toUser);
		$payment->amount_cents = $amount_cents;
		$payment->details = $details;
		return $payment;
	}

	public function submitPaymentForm(array $data): Payment {
		$form = self::makeForm();
		$f = [];

		// Validate the form
		try {
			$f = $form->submit($data);
		} catch(\RuntimeException $e) {
			$this->errors += $form->getErrors();
			throw $e;
		}

		// Create the payment
		$payment = $this->create(
			$f['loan_id'], $f['from_user'], $f['to_user'],
			$f['details'], $f['amount_cents']
		); // throws

		// TODO attach the payment to the loan
		$payment->save();
		return $payment;
	}

	public function getErrors(): array {
		return $this->errors;
	}

	public static function makeForm(): \Uomi\Form {
		// $emailValidator = v::notEmpty()->email()->setName('Email');

		$form = new \Uomi\Form('Payment Creation');
		$form->addField(
			\Uomi\Field::make()->name('Loan', 'loan_id')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('From', 'from_user')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('To', 'to_user')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('To', 'to_user')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('Details', 'details')->required()
		);
		$form->addField(
			\Uomi\Field::make()->name('Amount', 'amount_cents')->required()
		);
		return $form;
	}
}
