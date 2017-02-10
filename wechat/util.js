'use strict'

const xml2js = require('xml2js');
const Promise = require('bluebird');
const Reply = require('./reply');

exports.parseXMLAsync = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {
      trim: true
    }, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

exports.formatMessage = (result) => {
  let message = {};
  if (typeof result === 'object') {
    const keys = Object.keys(result);
    for (let key of Object.keys(result)) {
      let item = result[key];
      if (!(item instanceof Array) || item.length === 0) {
        continue;
      }
      if (item.length === 1) {
        let val = item[0];

        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        item.map((val) => {
          message[key].push(formatMessage(val));
        });
      }
    }
  }
  return message;
};

exports.template = (content, message) => {
  let type = 'text';
  if (Array.isArray(content)) {
    type = 'news';
  }
  type = content.type || type;
  let info = {
    content,
    createTime: new Date().getTime(),
    msgType: type,
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName
  };
  let reply = new Reply(info);
  return reply.compile();
}
