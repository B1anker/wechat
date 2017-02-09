'use strict'
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const util = require('./util');
const prefix = 'https://api.weixin.qq.com/cgi-bin/'

let api = {
  accessToken: `${prefix}token?grant_type=client_credential`
}

class Wechat {
  constructor(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.getAccessToken().then((data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return this.updateAccessToken();
      }

      if (this.isValidAccessToken(data)) {
        return Promise.resolve(data);
      } else {
        return this.updateAccessToken();
      }
    }).then((data) => {
      this.access_token = data.access_token;
      this.expires_in = data.expires_in;
      this.saveAccessToken(data);
    })
  }

  isValidAccessToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false;
    }
    const access_token = data.access_token;
    const expires_in = data.expires_in;
    const now = (new Date().getTime());

    if (now < expires_in) {
      return true;
    }
    return false;
  }

  updateAccessToken() {
    const appID = this.appID;
    const appSecret = this.appSecret;
    let url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`;

    return new Promise((resolve, reject) => {
      request({url: url, json: true}).then((res) => {
        let data = res.body;
        const now = (new Date().getTime());
        const expires_in = now + (data.expires_in - 20) * 1000;

        data.expires_in = expires_in;

        resolve(data);
      });
    });
  }

  reply() {
    let content = this.body;
    let message = this.weixin;
    let xml = util.template(content, message);
    this.status = 200;
    this.type = 'application/xml';
    console.log(xml);
    this.body = xml;
  }
}

module.exports = Wechat;
