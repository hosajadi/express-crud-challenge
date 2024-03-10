FROM node:18.18.0

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN yarn install
RUN npx prisma generate
COPY . .
RUN yarn build
CMD [ "sh", "init.sh"]
