# yandex-wallet

Install guide:

1. `npm i` install all deps
3. I am using mongodb on my local docker host with hostname like `docker`, you can change mongo server url by change a `NODE_MONGO` env var. default is `mongodb://docker/test_yandex_wallet`.
To pupulate db and run server tests you can start `npm run test:server`
4. to build client run `npm run build`
5. to start server `npm run start:server`
6. to start client for developing on localhost:3000 use `npm start`
