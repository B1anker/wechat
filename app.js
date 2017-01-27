'use strick'

const Koa = require('koa');
const sha1 = require('sha1');
const config = {
  wechat: {
    appID: 'wxd3c68484a605a2de',
    appSecret: 'd5e1eed619569a8f20b66d4403313387',
    token: 'b1ankerWechat'
  }
};

const app = new Koa();

app.use(function*(next) {
  console.log(this.query);

  const token = config.wechat.token;
  const signature = this.query.signature;
  const nonce = this.query.nonce;
  const timestamp = this.query.timestamp;
  const echostr = this.query.echostr;

  const str = [token, timestamp, nonce].sort().join('');

  let sha = sha1(str);
  console.log(sha);
  if (sha === signature) {
    this.body = echostr + '';
  } else {
    this.body = 'wrong';
  }
});

console.log('listen in 1234');
app.listen(1234);
