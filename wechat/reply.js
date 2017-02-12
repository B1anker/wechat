class Template {
  constructor(info) {
    this.compiled = '';
    this.tpl = '';
    this.info = info || {};
  }

  _text() {
    this.tpl =
    `<Content><![CDATA[${this.info.content}]]></Content>`;
  }

  _image() {
    this.tpl =
    `<Image>
      <MediaId><![CDATA[${ this.info.content.mediaId }]]></MediaId>
    </Image>`
  }

  _voice() {
    this.tpl =
    `<Voice>
      <MediaId><![CDATA[${ this.info.content.mediaId }]]></MediaId>
    </Voice>`;
  }

  _video() {
    this.tpl =
      `<Video>
        <MediaId><![CDATA[${ this.info.content.mediaId }]]></MediaId>
        <Title><![CDATA[${ this.info.content.title }]]></Title>
        <Description><![CDATA[${ this.info.content.description }]]></Description>
      </Video> `;
  }

  _music() {
    this.tpl =
      `<Music>
        <Title><![CDATA[${ this.info.content.title }]]></Title>
        <Description><![CDATA[${ this.info.content.description }]]></Description>
        <MusicUrl><![CDATA[${ this.info.content.musicUrl }]]></MusicUrl>
        <HQMusicUrl><![CDATA[${ this.info.content.hqMediaUrl }]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${ this.info.content.thumbMediaId }]]></ThumbMediaId>
      </Music>`;
  }

  _news() {
    let content = [];
    this.info.content.map((item) => {
      content.push(`<item>
        <Title><![CDATA[${ item.title }]]></Title>
        <Description><![CDATA[${ item.description }]]></Description>
        <PicUrl><![CDATA[${ item.picUrl }]]></PicUrl>
        <Url><![CDATA[${ item.url }]]></Url>
      </item>`);
    });
    this.tpl =
      `<ArticleCount>${ this.info.content.length }</ArticleCount>
      <Articles>
        ${ content }
      </Articles>`;
  }

  _judgeType(MsgType) {
    switch (MsgType) {
      case 'text':
        this._text();
        break;
      case 'image':
        this._image();
        break;
      case 'voice':
        this._image();
        break;
      case 'video':
        this._video();
        break;
      case 'music':
        this._music();
        break;
      case 'news':
        this._news();
        break;
      default:
        break;
    }
  }

  compile() {
    this._judgeType(this.info.msgType);
    this.compiled = `<xml>
  <ToUserName><![CDATA[${ this.info.toUserName }]]></ToUserName>
  <FromUserName><![CDATA[${ this.info.fromUserName }]]></FromUserName>
  <CreateTime>${ this.info.createTime }</CreateTime>
  <MsgType><![CDATA[${ this.info.msgType }]]></MsgType>
  ${ this.tpl }
</xml>`;
    return this.compiled;
  }
}

module.exports = Template;
