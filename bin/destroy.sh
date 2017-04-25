#!/usr/bin/env bash
echo "Taking down 'uomi_${GULP_TARGET}'"
docker-compose -f ./config/dev/docker-compose.yml -p "uomi_${GULP_TARGET}" down --rmi local
