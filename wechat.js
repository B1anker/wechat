class Wechat{
  constructor() {

  }

  * handleAccept(next) {
    let message = this.weixin;

    if (message.MsgType === 'event') {
      if (message.Event === 'subscribe') {
        if (message.EventKey) {
          console.log(`扫二维码进来：${message.EventKey} ${message.ticket}`);
        }
        this.body = `哈哈，你订阅了\r\n消息ID：${message.MsgId}`
      } else if (message.Event === 'unsubscribe') {
        this.body = '';
        console.log('无情取关');
      } else if (message.Event === 'LOCATION') {
        this.body = `您上报的位置是：${message.Latitude}/${message.Longtitude}-${message.Precision}`;
      } else if (message.Event === 'CLICK') {
        this.body = `您点击了菜单：${message.EventKey}`;
      } else if (message.Event === 'SCAN') {
        console.log(`关注后扫描二维码${message.EventKey} ${message.Ticket}`);
        this.body = '看到你扫了一下哦';
      } else if (message.Event === 'VIEW') {
        this.body = `您点击了菜单中的链接：${message.EventKey}`;
      }
    } else if (message.MsgType === 'text') {
      let content = message.Content;
      let reply = `额，你说的"${ message.Content }"太复杂了`;
      if (content === '1') {
        reply = '天下第一吃大米';
      } else if (content === '2') {
        reply = '天下第二吃豆腐';
      } else if (content === '3') {
        reply = '天下第三吃仙丹';
      } else if (content === '世界上最美丽的女人' || content === '世界上最美的女人'){
        reply = [{
          title: '世界上最美丽的女人',
          description: '点击进来查看世界上最美丽的女人',
          picUrl: 'http://www.xn--2brw2cn2a748b971a.com/img/5.jpg',
          url: 'http://www.刘君最美啦.com'
        }];
      }
      this.body = reply;
    } else if (message.MsgType === 'image') {
      this.body = '你好！';
    } else {
      this.body = '。。。';
    }

    yield next;
  }
}

module.exports = Wechat;
