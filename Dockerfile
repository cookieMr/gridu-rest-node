FROM node:16

COPY . /app
WORKDIR /app

RUN npm config set fund false && \
    npm install -g npm typescript && \
    npm install body-parser express knex mysql --save && \
    npm install @types/body-parser @types/express @types/mysql --save-dev && \
    tsc --build

EXPOSE 3000

CMD [ "node", "./build/Application.js" ]
