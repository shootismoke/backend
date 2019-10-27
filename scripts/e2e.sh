#!/usr/bin/env bash

# This scripts runs e2e tests. It assumes there's a mongod instance running on
# 127.0.0.1:27017

# Backup .env temporarily (if it exists)
mv .env .env.bak

# Set up Zeit now
cp .env.test .env # Copy env variables
now dev --listen 3001 & # Run now dev in background
NOW_PID=$!

# Run tests
jest
JEST_ERROR_CODE=$?

# Restore .env (if it exists)
mv .env.bak .env

kill $NOW_PID

exit $JEST_ERROR_CODE
