#!/usr/bin/env bash
WEB_UP=false;
DB_UP=false;

COMPOSE_FILE="./config/${GULP_TARGET}/docker-compose.yml"

if docker-compose -f $COMPOSE_FILE -p "uomi_${GULP_TARGET}" exec web echo "Hello" >/dev/null 2>&1; then
    WEB_UP=true
fi
if docker-compose -f $COMPOSE_FILE -p "uomi_${GULP_TARGET}" exec database echo "Hello" >/dev/null 2>&1; then
    DB_UP=true
fi
printf "[x] = running\n\n";
if $WEB_UP; then
    printf "[x]  Web";
else
    printf "[ ]  Web";
fi
printf "\n";
if $DB_UP; then
    printf "[x]  Database";
else
    printf "[ ]  Database";
fi
printf "\n";
exit;
