#!/usr/bin/env bash
sudo docker-compose -f ./config/dev/docker-compose.yml -p "uomi_${GULP_TARGET}" exec web /bin/ash
