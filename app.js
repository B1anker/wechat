'use strick'

const Koa = require('koa');
const path = require('path');
const wechat = require('./wechat/generator');
const util = require('./libs/util');
const wechat_file = path.join(__dirname, './config/wechat.txt');
const config = {
  wechat: {
    appID: 'wxd3c68484a605a2de',
    appSecret: 'd5e1eed619569a8f20b66d4403313387',
    token: 'b1ankerWechat',
    getAccessToken() {
      return util.readFileAsync(wechat_file);
    },
    saveAccessToken(data) {
      data = JSON.stringify(data);
      return util.writeFileAsync(wechat_file, data);
    }
  }
};

const app = new Koa();

app.use(wechat(config.wechat));

const port = 1234;

console.log(`listening in ${port}`);
app.listen(port);
