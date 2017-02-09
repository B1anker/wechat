'use strict'

const Koa = require('koa');
const path = require('path');
const generator = require('./wechat/generator');
const util = require('./libs/util');
const config = require('./config');
const wechat_file = path.join(__dirname, './config/wechat.txt');
const Wechat = require('./wechat');

const app = new Koa();

const wechat = new Wechat();

app.use(generator(config.wechat, wechat.handleAccept));

const port = 1234;

console.log(`listening in ${port}`);
app.listen(port);
