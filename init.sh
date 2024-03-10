#!/bin/bash
npx prisma generate
yarn migrate:deploy
yarn seed
yarn start
