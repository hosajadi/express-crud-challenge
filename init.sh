#!/bin/bash
npx prisma generate
npx prisma migrate deploy
yarn seed
yarn run start
