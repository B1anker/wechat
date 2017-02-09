'use strict'

const Koa = require('koa');
const path = require('path');
const wechat = require('./wechat/generator');
const util = require('./libs/util');
const config = require('./config');
const weixin = require('./weixin');
const wechat_file = path.join(__dirname, './config/wechat.txt');


const app = new Koa();

app.use(wechat(config.wechat, weixin.reply));

const port = 1234;

console.log(`listening in ${port}`);
app.listen(port);
