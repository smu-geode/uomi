<?php

require '../vendor/autoload.php';
//require 'lib/autoload.php';

$settings = require 'settings.php';
$app = new \Slim\App($settings);

require 'dependencies.php';
require 'middleware.php';
require 'errors.php';

$c = $app->getContainer();
\Uomi\registerErrorHandlers($c);

echo('API goes here');

?>
