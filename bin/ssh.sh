#!/usr/bin/env bash
sudo docker-compose -f $COMPOSE_FILE -p $DOCKER_NAME exec web /bin/ash
