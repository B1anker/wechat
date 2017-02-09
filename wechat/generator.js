'use strict'

const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Base = require('./base');
const util = require('./util');

module.exports = function(opts, handler) {
  const base = new Base(opts);
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

      this.weixin = message;

      yield handler.call(this, next);

      base.reply.call(this);

    }
  }
}
