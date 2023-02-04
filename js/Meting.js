class MetingJSElement extends HTMLElement {
/**
   * 当自定义元素第一次被连接到文档 DOM 时被调用
   * connectedCallback
   * https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks
   */
  connectedCallback() {
    if (window.APlayer && window.fetch) {
      this._init()
      this._parse()
    }
  }
  // 与 connectedCallback 反
  disconnectedCallback() {
    if (!this.lock) {
      this.aplayer.destroy()
    }
  }

  /**
   * 驼峰化
   * @param { string } str
   * @returns { string } str
   */ 
  _camelize(str) {
    return str
      .replace(/^[_.\- ]+/, '')
      .toLowerCase()
      .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase())
  }

  // 初始化
  _init() {
    let config = {}
    for (let i = 0; i < this.attributes.length; i += 1) {
      config[this._camelize(this.attributes[i].name)] = this.attributes[i].value
    }
    let keys = [
      'server', 'type', 'id', 'api', 'auth',
      'auto', 'lock',
      'name', 'title', 'artist', 'author', 'url', 'cover', 'pic', 'lyric', 'lrc',
    ]
    this.meta = {}
    // 构建 meta
    // config 保留 keys 数组中没有的属性
    // keys 中有 config 中也有的属性给 meta 赋值，没有的先设为 undefined
    for (let key of keys) {
      this.meta[key] = config[key]
      delete config[key]
    }
    this.config = config

    this.api = this.meta.api || window.meting_api || 'https://meting.zhheo.com/?server=:server&type=:type&id=:id&r=:r'
    if (this.meta.auto) this._parse_link()
  }

   /**
   * 解析 auto 属性的值
   * 将解析后的结果赋值给 meta 对象的 server、type、id
   */
  _parse_link() {
    let rules = [
      ['music.163.com.*song.*id=(\\d+)', 'netease', 'song'],
      ['music.163.com.*album.*id=(\\d+)', 'netease', 'album'],
      ['music.163.com.*artist.*id=(\\d+)', 'netease', 'artist'],
      ['music.163.com.*playlist.*id=(\\d+)', 'netease', 'playlist'],
      ['music.163.com.*discover/toplist.*id=(\\d+)', 'netease', 'playlist'],
      ['y.qq.com.*song/(\\w+).html', 'tencent', 'song'],
      ['y.qq.com.*album/(\\w+).html', 'tencent', 'album'],
      ['y.qq.com.*singer/(\\w+).html', 'tencent', 'artist'],
      ['y.qq.com.*playsquare/(\\w+).html', 'tencent', 'playlist'],
      ['y.qq.com.*playlist/(\\w+).html', 'tencent', 'playlist'],
      ['xiami.com.*song/(\\w+)', 'xiami', 'song'],
      ['xiami.com.*album/(\\w+)', 'xiami', 'album'],
      ['xiami.com.*artist/(\\w+)', 'xiami', 'artist'],
      ['xiami.com.*collect/(\\w+)', 'xiami', 'playlist'],
    ]

    for (let rule of rules) {
       /**
       * 解析 auto 属性的值
       * 将解析后的结果赋值给 meta 对象的 server、type、id
       */
      let patt = new RegExp(rule[0])
      let res = patt.exec(this.meta.auto)
      if (res !== null) {
        this.meta.server = rule[1]
        this.meta.type = rule[2]
        this.meta.id = res[1]
        return
      }
    }
  }

   /**
   * 解析 auto 属性的值
   * 将解析后的结果赋值给 meta 对象的 server、type、id
   */
  _parse() {
    if (this.meta.url) {
      let result = {
        name: this.meta.name || this.meta.title || 'Audio name',
        artist: this.meta.artist || this.meta.author || 'Audio artist',
        url: this.meta.url,
        cover: this.meta.cover || this.meta.pic,
        lrc: this.meta.lrc || this.meta.lyric || '',
        type: this.meta.type || 'auto',
      }
      if (!result.lrc) {
        this.meta.lrcType = 0
      }
      if (this.innerText) {
        result.lrc = this.innerText
        this.meta.lrcType = 2
      }
      this._loadPlayer([result])
      return
    }

     /**
     * 解析 auto 属性的值
     * 将解析后的结果赋值给 meta 对象的 server、type、id
     */
    let url = this.api
      .replace(':server', this.meta.server)
      .replace(':type', this.meta.type)
      .replace(':id', this.meta.id)
      .replace(':auth', this.meta.auth)
      .replace(':r', Math.random())

    fetch(url)
      .then(res => res.json())
      .then(result => this._loadPlayer(result))
  }

  _loadPlayer(data) {

    let defaultOption = {
      audio: data,
      mutex: true,
      lrcType: this.meta.lrcType || 3,
      storageName: 'metingjs'
    }

    if (!data.length) return

    let options = {
      ...defaultOption,
      ...this.config,
    }
    for (let optkey in options) {
      if (options[optkey] === 'true' || options[optkey] === 'false') {
        options[optkey] = (options[optkey] === 'true')
      }
    }

    let div = document.createElement('div')
    options.container = div
    this.appendChild(div)

    this.aplayer = new APlayer(options)
  }

}

// console.log('\n %c MetingJS v2.0.1 %c https://github.com/metowolf/MetingJS \n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;')

// 创建标签
// customElements -> https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
if (window.customElements && !window.customElements.get('meting-js')) {
  window.MetingJSElement = MetingJSElement
  window.customElements.define('meting-js', MetingJSElement)
}
