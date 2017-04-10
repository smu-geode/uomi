<?php

use \Slim\Http\Request;
use \Slim\Http\Response;

$app->group('/api', function() {
	require 'lib/controller/SessionController.php';
	require 'lib/controller/UserController.php';
	require 'lib/controller/LoanController.php';
});

$app->any('/test', function(Request $req, Response $res) {
	echo "Test successful!";
});
