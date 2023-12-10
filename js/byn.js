(async function () {
    async function getIpInfo() {
        var fetchUrl = "https://api.qjqq.cn/api/Local";
        if(!document.getElementById("userAgentIp")) return
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

// 页脚计时器
setInterval(() => {
    let create_time = Math.round(new Date('2023/4/21 00:00:00').getTime() / 1000);
    let timestamp = Math.round((new Date().getTime()) / 1000);
    let second = timestamp - create_time;
    let time = new Array(0, 0, 0, 0, 0);

    var nol = function (h) {
        return h > 9 ? h : '0' + h;
    }
    if (second >= 365 * 24 * 3600) {
        time[0] = parseInt(second / (365 * 24 * 3600));
        second %= 365 * 24 * 3600;
    }
    if (second >= 24 * 3600) {
        time[1] = parseInt(second / (24 * 3600));
        second %= 24 * 3600;
    }
    if (second >= 3600) {
        time[2] = nol(parseInt(second / 3600));
        second %= 3600;
    }
    if (second >= 60) {
        time[3] = nol(parseInt(second / 60));
        second %= 60;
    }
    if (second >= 0) {
        time[4] = nol(second);
    }
    let currentTimeHtml = "本站已运行："
    if (time[0] != 0) {
        currentTimeHtml += time[0] + ' 年 '
    }
    currentTimeHtml += time[1] + ' 天 ' + time[2] + ' 时 ' + time[3] + ' 分 ' + time[4] + ' 秒 ';
    if (!document.getElementById("runtime")) return;
    document.getElementById("runtime").innerHTML = currentTimeHtml;
}, 1000);


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
  
    constructor(config = {}, callback = () => {}) {
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
      if(transform.includes(prop)) {
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
          left = 1370 -  width
          
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
        if(this.moveMode === 'position') {
          this._topLeftMoveTargetEl()
        }else {
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
      const downEvent = this.h5 ?  'touchstart' : 'mousedown'
      const upEvent = this.h5 ? 'touchend' : 'mouseup'
      this.rootDom.addEventListener(moveEvent, this._mousemoveHandler)
      this.targetEl && this.targetEl.addEventListener(downEvent, this._mousedownHandler)
      this.rootDom.addEventListener(upEvent, this._mouseupHandler)
    }
  
    destroy() {
      const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
      const downEvent = this.h5 ?  'touchstart' : 'mousedown'
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
  if(urlinfo === "/" || patbool) {
    const moveModel = new DragMoveModel({ targetEl: targetEl,moveMode: 'position', limitMoveBorder: true })
  }
  


})();



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

