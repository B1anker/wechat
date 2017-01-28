'use strict'

const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Wechat = require('./wechat');
const util = require('./util');

module.exports = function(opts) {
  const wechat = new Wechat(opts);
  return function * (next) {
    const token = opts.token;
    const signature = this.query.signature;
    const nonce = this.query.nonce;
    const timestamp = this.query.timestamp;
    const echostr = this.query.echostr;

    const str = [token, timestamp, nonce].sort().join('');

    const sha = sha1(str);
    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + '';
      } else {
        this.body = 'wrong';
      }
    } else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong';
        return false;
      }

      let data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      });

      let content = yield util.parseXMLAsync(data);

      let message = util.formatMessage(content.xml);
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          const now = new Date().getTime();
          this.status = 200;
          this.type = 'application/xml';
          let reply = `<xml>
  <ToUserName><![CDATA[${ message.FromUserName }]]></ToUserName>
  <FromUserName><![CDATA[${ message.ToUserName }]]></FromUserName>
  <CreateTime>${ now }</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[你是我的小君君吗？]]></Content>
  <MsgId>${ message.MsgId }</MsgId>
</xml>`;
          this.body = reply;
          return;
        }
      }

      /*if (message.MsgType === 'text') {
        const now = new Date().getTime();
        this.status = 200;
        this.type = 'application/xml';
        let reply = `<xml>
  <ToUserName><![CDATA[${ message.FromUserName }]]></ToUserName>
  <FromUserName><![CDATA[${ message.ToUserName }]]></FromUserName>
  <CreateTime>${now}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[你是我的小君君吗？]]></Content>
  <MsgId>${ message.MsgId }</MsgId>
</xml>`;
        this.body = reply;
        console.log(reply);
        return;
      }*/
    }
  }
}
