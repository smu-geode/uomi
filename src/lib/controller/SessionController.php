<?php

namespace Uomi\Controller;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \Slim\Container;

use \Illuminate\Database\Eloquent\ModelNotFoundException;

// ROUTES
$this->group('/sessions', function() {
	$this->post('/', '\Uomi\SessionController:postSessionCollectionHandler');
	$this->delete('/', '\Uomi\SessionController:deleteSessionCollectionHandler');
});

class SessionController {

    private $container;

    function __construct(Container $c) {
        $this->container = $c;
    }

	public function postSessionCollectionHandler(Request $req, Response $rep): Response{
		$data = $req->getParsedBody();

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

	public function deleteSessionCollectionHandler(Request $req, Response $rep): Response{

		try{
			//not sure if using proper way to get current session, but rest of delete should be fine
			$sessiontodelete = \Uomi\Model\Session::firstOrFail( $req->getAttribute('session') );
			$sessiontodelete->delete();
			$stat = new Status();
			$stat = $stat->message("Session deleted");
		} catch (ModelNotFoundException $e){
			$stat = new Status();
			$stat = $stat->error("ResourceNotFound")->message("Session with id: " . $session . " not found");
			return $res->withStatus(404)->withJson($stat);
		}
	}

	protected static function badSessionResponse(Response $res, array $errorStrings): Response {
        $stat = new \Uomi\Status([ 'errors' => $errorStrings ]);
        $stat = $stat->error('badSessionResponse')->message('There was an error in creating the session.');

        return $res->withStatus(400)->withJson($stat); // Bad Request
    }
}
