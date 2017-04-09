<?php

// use Illuminate\Database\Eloquent\ModelNotFoundException;
use Slim\Http\Request;
use Slim\Http\Response;

$app->group('/api', function() {
	require 'lib/UserController.php';
});
