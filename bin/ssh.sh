#!/usr/bin/env bash
docker-compose -f $COMPOSE_FILE -p $DOCKER_NAME exec web /bin/ash
