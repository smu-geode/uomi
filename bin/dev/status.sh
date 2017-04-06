#!/usr/bin/env bash
WEB_UP=false;
DB_UP=false;
if docker-compose -p uomi_dev exec web echo "Hello" >/dev/null 2>&1; then
    WEB_UP=true
fi
if docker-compose -p uomi_dev exec database echo "Hello" >/dev/null 2>&1; then
    DB_UP=true
fi
if $WEB_UP; then
    printf "🔴  Web";
else
    printf "⚫️  Web";
fi
printf "\n";
if $DB_UP; then
    printf "🔴  Database";
else
    printf "⚫️  Database";
fi
printf "\n";
