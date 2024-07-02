(async function () {
  async function getIpInfo() {
    var fetchUrl = "https://api.qjqq.cn/api/Local";
    if (!document.getElementById("userAgentIp")) return
    try {
      var response = await fetch(fetchUrl);
      var json = await response.json();

      var ip = json.ip;
      var country = json.data.country;
      var prov = json.data.prov;
      var city = json.data.city;
      var isp = json.data.isp;

      document.getElementById("userAgentIp").innerHTML = ip;
      document.getElementById("userAgentCountry").innerHTML = country;
      document.getElementById("userAgentProv").innerHTML = prov;
      document.getElementById("userAgentCity").innerHTML = city;
      document.getElementById("userAgentISP").innerHTML = isp;

      var uaInfo = navigator.userAgent;

      document.getElementById("userAgentDevice").innerHTML = uaInfo;
    } catch (error) {
      console.error("获取信息失败");
    }
  }

  await getIpInfo();

  //检查是否开启FPS
  if (localStorage.getItem('FPSToggle') == 'true') {
    bieyinan_FPS = true;
    document.querySelector("#fps-group").classList.add("show");
    document.querySelector("#consoleFPS").classList.add("on");
  } else {
    bieyinan_FPS = false;
    document.querySelector("#fps-group").classList.remove("show");
    document.querySelector("#consoleFPS").classList.remove("on");
  }

  // FPS
  var showFPS = (function () {
    var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    var e, pe, pid, fps, last, offset, step, appendFps;

    fps = 0;
    last = Date.now();
    step = function () {
      offset = Date.now() - last;
      fps += 1;
      if (offset >= 1000) {
        last += offset;
        appendFps(fps);
        fps = 0;
      }
      requestAnimationFrame(step);
    };
    appendFps = function (fps) {
      document.querySelector("#fps").innerHTML = fps
    };
    step();
  })();

  /**
       * 拖动模型
       * */
  class DragMoveModel {
    startX = 0
    startY = 0
    moveInsX = 0
    moveInsY = 0
    isMousedown = false
    targetEl = null
    targetElTx = 0
    targetElTy = 0
    initTargetElTop = 0
    initTargetElLeft = 0
    limitMoveBorder = false
    moveMode = 'transform'
    callback = null
    h5 = false
    rootDom = document

    constructor(config = {}, callback = () => { }) {
      this._initConfig(config)
      this._initEvent()
      this._initTragetElInfo()
      this.callback = callback
    }

    _initConfig(config) {
      this.targetEl = config.targetEl || document.body
      this.limitMoveBorder = !!config.limitMoveBorder
      this.moveMode = config.moveMode || 'transform'
      this.h5 = !!config.h5
      this.rootDom = config.rootDom || this.rootDom
    }

    _initTragetElInfo() {
      if (this.targetEl) {
        const { top, left } = this.targetEl.getBoundingClientRect()
        this.initTargetElTop = top
        this.initTargetElLeft = left
        this.targetEl.style['will-change'] = this.moveMode === 'transform' ? 'transform' : 'left, top'
      }
    }

    _getStyleTransformProp(transform = '', prop = 'scale') {
      transform = transform.replaceAll(', ', ',').trim()
      let strArr = transform.split(' ')
      let res = ''
      strArr.forEach(str => {
        if (str.includes(prop)) {
          res = str
        }
      })
      return res
    }

    _calcTargetTranlate = () => {
      if (this.targetEl) {
        let translate = this._getStyleTransformProp(this.targetEl.style.transform, 'translate3d')
        if (translate.includes('translate3d')) {
          let reg = /\((.*)\)/g
          let res = reg.exec(translate)
          if (res) {
            translate = res[1].replaceAll(', ', ',')
          }
          let translateArr = translate.replace('(', '').replace(')', '').split(',')
          this.targetElTx = +translateArr[0].replace('px', '') || 0
          // this.targetElTy = +translateArr[1].replace('px', '') || 0
        }
      }
    }

    _setTransformProp(transform = '', prop = '', value = '') {
      let reg = new RegExp(`${prop}\((.*)\)`, 'g')
      if (transform.includes(prop)) {
        let propList = transform.replaceAll(', ', ',').trim().split(' ')
        let newPropList = propList.map(item => item.replaceAll(reg, `${prop}(${value})`))
        transform = newPropList.join(' ')
      } else {
        transform = `${prop}(${value}) ` + transform
      }
      return transform
    }

    _translateMoveEl() {
      if (this.targetEl) {
        let tx = this.targetElTx + this.moveInsX
        let ty = this.targetElTy + this.moveInsY

        const limitBorder = () => {
          const { width, height } = this.targetEl.getBoundingClientRect()
          if (tx + width + this.initTargetElLeft > window.innerWidth) {
            tx = window.innerWidth - width - this.initTargetElLeft
          }
          if (tx < -this.initTargetElLeft) {
            tx = -this.initTargetElLeft
          }
          if (ty + height + this.initTargetElTop > window.innerHeight) {
            ty = window.innerHeight - height - this.initTargetElTop
          }
          if (ty < -this.initTargetElTop) {
            ty = -this.initTargetElTop
          }
        }

        if (this.limitMoveBorder) {
          limitBorder()
        }

        let transform = this.targetEl.style.transform
        transform = transform ? this._setTransformProp(transform, 'translate3d', `${tx}px, ${ty}px, 0px`) : `translate3d(${tx}px, ${ty}px, 0px)`
        this.targetEl.style.transform = transform
      }
    }

    _topLeftMoveTargetEl = () => {
      let left = this.moveInsX + this.initTargetElLeft
      //   let top = this.moveInsY + this.initTargetElTop

      const limitBorder = () => {
        const { width, height } = this.targetEl.getBoundingClientRect()

        if (top < 0) {
          top = 0
        }
        if (top > (window.innerHeight - height)) {
          top = window.innerHeight - height
        }
        if (left < 0) {
          left = 0
        }
        if (left > (1370 - width)) {
          left = 1370 - width

        }
      }
      if (this.limitMoveBorder) {
        limitBorder()
      }
      this.targetEl.style.left = left + 'px'
      this.targetEl.style.top = top + 'px'
    }

    _mousemoveHandler = (e) => {
      const pageX = this.h5 ? e.changedTouches[0].pageX : e.pageX
      const pageY = this.h5 ? e.changedTouches[0].pageY : e.pageY
      if (this.isMousedown) {
        if (pageX < this.startX) {
          this.moveInsX = pageX - this.startX
        }
        if (pageX > this.startX) {
          this.moveInsX = pageX - this.startX
        }
        if (pageY < this.startY) {
          this.moveInsY = this.startY
        }
        if (pageY > this.startY) {
          this.moveInsY = this.startY
        }
        if (this.moveMode === 'position') {
          this._topLeftMoveTargetEl()
        } else {
          this._translateMoveEl()
        }
        let c = Math.round(Math.pow((this.moveInsX * this.moveInsX + this.moveInsY * this.moveInsY), 0.5))
        this.callback(this.moveInsX, this.moveInsY, c)
      }
    }

    // 鼠标按下事件
    _mousedownHandler = (e) => {
      const pageX = this.h5 ? e.changedTouches[0].pageX : e.pageX
      const pageY = this.h5 ? e.changedTouches[0].pageY : e.pageY
      this.startX = pageX
      // this.startY = pageY // 记录鼠标起始位置y
      this.moveInsX = 0
      this.moveInsY = 0
      this.isMousedown = true

      this._calcTargetTranlate()

      if (this.moveMode === 'position') {
        this._initTragetElInfo()
      }
    }

    _mouseupHandler = (e) => {
      this.isMousedown = false
      this.startX = 0
      this.startY = 0
    }

    _initEvent() {
      const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
      const downEvent = this.h5 ? 'touchstart' : 'mousedown'
      const upEvent = this.h5 ? 'touchend' : 'mouseup'
      this.rootDom.addEventListener(moveEvent, this._mousemoveHandler)
      this.targetEl && this.targetEl.addEventListener(downEvent, this._mousedownHandler)
      this.rootDom.addEventListener(upEvent, this._mouseupHandler)
    }

    destroy() {
      const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
      const downEvent = this.h5 ? 'touchstart' : 'mousedown'
      const upEvent = this.h5 ? 'touchend' : 'mouseup'
      this.targetEl && this.targetEl.removeEventListener(moveEvent, this._mousedownHandler)
      this.rootDom.removeEventListener(downEvent, this._mousemoveHandler)
      this.rootDom.removeEventListener(upEvent, this._mouseupHandler)
    }
  }

  const targetEl = document.getElementById('con-animals')
  var urlinfo = window.location.pathname;
  const pattern = /\/page\/.*?\//;
  const patbool = pattern.test(urlinfo);
  if (urlinfo === "/" || patbool) {
    const moveModel = new DragMoveModel({ targetEl: targetEl, moveMode: 'position', limitMoveBorder: true })
  }

})();


// 创建窗口
var winbox = ''

function createWinbox() {
  let div = document.createElement('div')
  document.body.appendChild(div)
  winbox = WinBox({
    id: 'changeBgBox',
    index: 999,
    title: "切换背景",
    x: "center",
    y: "center",
    minwidth: '300px',
    height: "60%",
    background: `var(--bieyinan-main)`,
    onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}</style>` },
    onrestore: () => { div.innerHTML = '' }
  });
  winResize();
  window.addEventListener('resize', winResize)

  // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\进行转义
  winbox.body.innerHTML = `
    <div id="article-container" style="padding:10px;">
    
    <button onclick="localStorage.removeItem('blogbg');location.reload();" style="    background: var(--bieyinan-main);float: right;width: 20%;padding: 10px 0;border-radius: 6px;color: white;margin-top: 1.5rem;line-height: 1px;"><i class="fa-solid fa-arrows-rotate"></i> 恢复默认背景</button>

    <h2 id="纯色"><a href="#纯色" class="headerlink" title="纯色"></a>纯色</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #ffffff;border: 1px solid rgb(239, 244, 248);" onclick="changeBg('#ffffff')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #f0fcff" onclick="changeBg('#f0fcff')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #e3f9fd" onclick="changeBg('#e3f9fd')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #70f3ff" onclick="changeBg('#70f3ff')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #a4e2c6" onclick="changeBg('#a4e2c6')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #a1afc9" onclick="changeBg('#a1afc9')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #4c8dae" onclick="changeBg('#4c8dae')"></a> 
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #edd1d8" onclick="changeBg('#edd1d8')"></a> 
    </div>

    <h2 id="渐变色"><a href="#渐变色" class="headerlink" title="渐变色"></a>渐变色</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)" onclick="changeBg('linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)" onclick="changeBg('linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #b2fefa, #0ed2f7)" onclick="changeBg('linear-gradient(to right, #b2fefa, #0ed2f7)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #00c9ff, #92fe9d)" onclick="changeBg('linear-gradient(to right, #00c9ff, #92fe9d)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #74ebd5, #acb6e5)" onclick="changeBg('linear-gradient(to right, #74ebd5, #acb6e5)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #ffafbd, #ffc3a0)" onclick="changeBg('linear-gradient(to right, #ffafbd, #ffc3a0)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)" onclick="changeBg('linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(90deg,rgba(247,149,51,.1),rgba(243,112,85,.1) 15%,rgba(239,78,123,.1) 30%,rgba(161,102,171,.1) 44%,rgba(80,115,184,.1) 58%,rgba(16,152,173,.1) 72%,rgba(7,179,155,.1) 86%,rgba(109,186,130,.1))" onclick="changeBg('linear-gradient(90deg,rgba(247,149,51,.1),rgba(243,112,85,.1) 15%,rgba(239,78,123,.1) 30%,rgba(161,102,171,.1) 44%,rgba(80,115,184,.1) 58%,rgba(16,152,173,.1) 72%,rgba(7,179,155,.1) 86%,rgba(109,186,130,.1))')"></a>
    </div>

    <h2 id="图片（电脑）"><a href="#图片（电脑）" class="headerlink" title="图片（电脑）"></a>图片（电脑）</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a1d0eb7.webp)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a1d0eb7.webp)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a20721b.webp)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a20721b.webp)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a20d1e0.webp)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a20d1e0.webp)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a254133.webp)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a254133.webp)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a32d3c5.jpg)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a32d3c5.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a59bf18.jpg)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a59bf18.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a73a8ba.jpg)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a73a8ba.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658430a7bde11.jpg)" class="imgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658430a7bde11.jpg)')"></a>
    </div>

    <h2 id="图片（手机）"><a href="#图片（手机）" class="headerlink" title="图片（手机）"></a>图片（手机）</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/6584342db4abf.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/6584342db4abf.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/6584342e4fef9.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/6584342e4fef9.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/65843430e0808.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/65843430e0808.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658434312734d.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658434312734d.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658434331a33c.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658434331a33c.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658434341a738.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658434341a738.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658443c919a64.webp)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658443c919a64.webp)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2023/12/21/658443ca09eae.jpg)" class="pimgbox" onclick="changeBg('url(https\://bu.dusays.com/2023/12/21/658443ca09eae.jpg)')"></a>
    </div>
`;
}

// 适应窗口大小
function winResize() {
  let box = document.querySelector('#changeBgBox')
  if (!box || box.classList.contains('min') || box.classList.contains('max')) return // 2023-02-10更新
  var offsetWid = document.documentElement.clientWidth;
  if (offsetWid <= 768) {
    winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
  } else {
    winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
  }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
  if (document.querySelector('#changeBgBox')) winbox.toggleClass('hide');
  else createWinbox();
}

// changeBG
// 存数据
// name：命名 data：数据
function saveData(name, data) {
  localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}

// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
  let d = JSON.parse(localStorage.getItem(name));
  // 过期或有错误返回 0 否则返回数据
  if (d) {
    let t = Date.now() - d.time
    if (t < (time * 60 * 1000) && t > -1) return d.data;
  }
  return 0;
}

// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用

// 读取背景
try {
  let data = loadData('blogbg', 1440)
  if (data) changeBg(data, 1)
  else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
  let bg = document.getElementById('web_bg')
  if (s.charAt(0) == '#') {
    bg.style.backgroundColor = s
    bg.style.backgroundImage = 'none'
  } else bg.style.backgroundImage = s
  if (!flag) { saveData('blogbg', s) }
  winbox.close()
}


// setInterval(function () {
//     check();
// }, 2000);
// var check = function () {
//     function doCheck(a) {
//         if (('' + a / a)['length'] !== 1 || a % 20 === 0) {
//             (function () { }['constructor']('debugger')());
//         } else {
//             (function () { }['constructor']('debugger')());
//         }
//         doCheck(++a);
//     }
//     try {
//         doCheck(0);
//     } catch (err) { }
// };
// check();