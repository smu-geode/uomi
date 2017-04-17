<? php

namespace Uomi\Factory
use \Uomi\Model\User;
use \Uomi\Api\User
class SessionController{

   private $session;
   private $errors;
   private $token;
   private $hashedPassword;




	function submitSessionForm(array $data){
		$form = self::makeForm();
		$formResult = [];

		// Validate the form

		try {
			$formResult = $form->submit($data);
		} catch(\RuntimeException $e) {
			$this->errors += $form->getErrors();
			throw $e;
		}

		// Create session
		$session = this->createSession($data->email, $data->password);
		$session->save();
		return $session;

	}

	function createSession(string $email, string $password): \Uomi\Session {
		if($email_exists = \Uomi\Model\User::where('email',$email))->first()) {
			if($password_matches = \Uomi\Model\User::where('password', password)) {
				$session = new Session;
				$session->token = createToken($email);
			}
			else {
				$this->errors += ["The password you entered is invalid"];
				throw new \RuntimeException();
			}

		}

		else {
			$esc = htmlspecialchars($email);
			$this->errors += ["The email $esc is not registered with an account."];
			throw new \RuntimeException();
		}
	}

   function __construct__(Sesion $s){
	   this->session = s;
	   this->errors = [];
   }

	public function createToken(string $email){
		$milliseconds = round(microtime(true) * 1000);
		$concat = strval($milliseconds) . $email;

	}

   public function createSession():  {

	   // CONFLICT CHECKS
	   	// idk what conflict checks there would be if im making a
		// new sessions

	   // CREATION
	   $session = new Session();

   }

   public function getErrors(): array {
	   return $this->errors;
   }

}

 ?>
