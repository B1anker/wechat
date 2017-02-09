'use strict'

const path = require('path');
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


module.exports = config;
