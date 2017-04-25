#!/usr/bin/env bash
docker-compose -f $COMPOSE_FILE -p $DOCKER_NAME down --rmi local
