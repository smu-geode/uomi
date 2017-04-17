<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

// ROUTES
$this->group('/sessions', function() {
	$this->post('/', '\Uomi\SessionController:postSessionCollectionHandler');
});

class SessionController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function postSessionCollectionHandler(Request $req, Response $rep){
		$data = req->getParsedBody();

		$factory = new SessionFactory($this->container);

		try {
			$session = $factory->submitSessionForm($data);
		} catch(RuntimeException $e) {
			return self::badSessionResponse($res, $factory->getErrors());
		}

		$stat = new Status($user);
		$stat = $stat->message('Session successfully created.');
		return $res->withStatus(201)->withJson($stat); // Created
	}





	protected static function badSessionResponse(Response $res, array $errorStrings): Response {
        $stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
        $stat = $stat->error('badSessionResponse')->message('There was an error in creating the session.');

        return $res->withStatus(400)->withJson($stat); // Bad Request
    }



?>
