'use strick'

const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Wechat = require('./wechat');

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
      console.log(data.toString);
    }
  }
}
