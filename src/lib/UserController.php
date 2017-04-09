<?php

namespace Uomi;

use Slim\Http\Request;
use Slim\Http\Response;

use Illuminate\Database\Eloquent\ModelNotFoundException;

use Slim\Container;
use Slim\App;

// ROUTES
$this->group('/users', function() {
    $this->any('/{user_id}', '\Uomi\UserController:userHandler');
});

class UserController {

    private $container;

    function __construct(Container $c) {
        // $this->any('/{user_id}', '\Uomi\UserController:userHandler');
        $this->container = $c;
    }

    public function userHandler(Request $req, Response $res): Response {
        switch ($req->getMethod()) {
        case 'GET':
            return $this->getUserHandler($req,$res);
        default:
            return $res->withStatus(405); // Method Not Allowed
        }
    }

    public function getUserHandler(Request $req, Response $res): Response {
        try {
            $user = User::findOrFail( $req->getAttribute('user_id') );
        } catch(ModelNotFoundException $e) { // user not found
            $stat = new StatusContainer($users);
            $stat->error("InvalidUser");
            $stat->message("Please make sure user is valid");
            $res = $res->withStatus(404); // not found
            return $res->withJson($stat);
        }
        /* catch(RuntimeException $e) { // there is no authorized user
            $stat = new StatusContainer($users);
            $stat->error("InvalidUser");
            $stat->message("Please make sure user is valid");
            $res = $res->withStatus(401); // not found
            return $res->withJson($stat);
        } */

        $stat = new StatusContainer($user);
        $stat->success();
        $stat->message("Here is requested user");
        return $res->withJson($stat);
    }
}
