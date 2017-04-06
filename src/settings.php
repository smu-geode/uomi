<?php
$env = $_ENV;
return [
    'settings' => [
        'debug' => getenv('UOMI_DEBUG'),
        'logger' => [
            'name' => 'uomi',
            'path' => '/var/log/api/api.log',
        ],
        // Eloquent settings
        'eloquent' => [
            'driver' => 'mysql',
            'host' => getenv('UOMI_DB_HOST'),
            'database' => getenv('UOMI_DB_NAME'),
            'username' => getenv('UOMI_DB_USERNAME'),
            'password' => getenv('UOMI_DB_PASSWORD'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_general_ci',
            'prefix' => '',
        ]
    ],
];
