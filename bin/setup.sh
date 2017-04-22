#!/usr/bin/env bash

# Constants

NODE_MINIMUM_VERSION="7.7.0"
NPM_MINIMUM_VERSION="4.1.1"
PHP_MINIMUM_VERSION="7.0.0"
COMPOSER_MINIMUM_VERSION="1.4.0"
GULP_CLI_MINIMUM_VERSION="1.2.0"
GULP_MINIMUM_VERSION="3.9.9"
DOCKER_MINIMUM_VERSION="17.0.0"
DOCKER_COMPOSE_MINIMUM_VERSION="1.11.0"

################################################################################

# Functions

strip_colors () {
    read data
    echo "$data" | sed 's%'"$(echo -en "\033")"'\[33m%%g'
}

command_exists () {
    type "$1" &> /dev/null ;
}

check_command_exists () {
    if command_exists $1
    then
        : #echo "[O]  '$1' is installed"
    else
        echo "[X]  '$1' is not installed"
        exit 1
    fi
}

version_greater_than () {
    local given_version
    local minimum_version
    local greatest
    given_version=$1
    minimum_version=$2
    greatest=`printf "${given_version}\n${minimum_version}_BAD" | sort -t '.' -k 1,1 -k 2,2 -k 3,3 | tail -1`
    if [ "$greatest" == "${given_version}_BAD" ]
    then
        return 1 # false
    elif [ "$greatest" == "${given_version}" ]
    then
        return 0 # true
    else
        echo "Version comparison error" 1>&2
    fi
}

check_version_greater_than () {
    local program=$1
    local given_version=$2
    local minimum_version=$3
    if version_greater_than $given_version $minimum_version;
    then
        echo "[O]  '$program' is running version $given_version"
    else
        echo "[X]  '$program' is running version $given_version"
        exit 1
    fi
}

################################################################################

# Checks

# NODE
check_command_exists "node"
NODE_VERSION="$(node -v)"
NODE_VERSION=${NODE_VERSION:1} # node -v prints `vX.X.X`
check_version_greater_than "node" "$NODE_VERSION" "$NODE_MINIMUM_VERSION"

# NPM
check_command_exists "npm"
NPM_VERSION="$(npm -v)"
check_version_greater_than "npm" "$NPM_VERSION" "$NPM_MINIMUM_VERSION"

# PHP
check_command_exists "php"
PHP_VERSION=`php -v | head -n 1 | cut -d ' ' -f 2`
check_version_greater_than "php" "$PHP_VERSION" "$PHP_MINIMUM_VERSION"

# COMPOSER
check_command_exists "composer"
COMPOSER_VERSION=`composer --version | head -n 1 | cut -d ' ' -f 3 | strip_colors`
check_version_greater_than "composer" "$COMPOSER_VERSION" "$COMPOSER_MINIMUM_VERSION"

# GULP
check_command_exists "gulp"
GULP_CLI_VERSION=`gulp -v | head -n 1 | cut -d ' ' -f 4`
GULP_VERSION=`gulp -v | head -n 2 | tail -n 1 | cut -d ' ' -f 4 | cut -d '-' -f 1`
check_version_greater_than "gulp-cli" "$GULP_CLI_VERSION" "$GULP_CLI_MINIMUM_VERSION"
check_version_greater_than "gulp" "$GULP_VERSION" "$GULP_MINIMUM_VERSION"

# DOCKER
check_command_exists "docker"
DOCKER_VERSION=`docker -v | cut -d ' ' -f 3 | cut -d '-' -f 1`
check_version_greater_than "docker" "$DOCKER_VERSION" "$DOCKER_MINIMUM_VERSION"

check_command_exists "docker-compose"
DOCKER_COMPOSE_VERSION=`docker-compose -v | cut -d ' ' -f 3 | cut -d '-' -f 1 | sed 's/,$//'`
check_version_greater_than "docker-compose" "$DOCKER_COMPOSE_VERSION" "$DOCKER_COMPOSE_MINIMUM_VERSION"
