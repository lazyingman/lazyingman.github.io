const bieyinan = {
  // 防抖
  debounce: (func, wait = 0, immediate = false) => {
    let timeout;
    return (...args) => {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },
  // 节流
  throttle: function (func, wait, options) {
    let timeout, context, args;
    let previous = 0;
    if (!options) options = {};

    const later = function () {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      func.apply(context, args);
      if (!timeout) context = args = null;
    };

    const throttled = function () {
      const now = new Date().getTime();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
    };

    return throttled;
  },

  sidebarPaddingR: () => {
    const innerWidth = window.innerWidth;
    const clientWidth = document.body.clientWidth;
    const paddingRight = innerWidth - clientWidth;
    if (innerWidth !== clientWidth) {
      document.body.style.paddingRight = paddingRight + "px";
    }
  },

  snackbarShow: (text, showActionFunction = false, duration = 2000, actionText = false) => {
    const { position, bgLight, bgDark } = GLOBAL_CONFIG.Snackbar;
    const bg = document.documentElement.getAttribute("data-theme") === "light" ? bgLight : bgDark;

    Snackbar.show({
      text: text,
      backgroundColor: bg,
      onActionClick: showActionFunction,
      actionText: actionText,
      showAction: actionText,
      duration: duration,
      pos: position,
      customClass: "snackbar-css",
    });
    // Snackbar.show 同步创建 current，仅更新当前提示，避免根变量影响整页。
    Snackbar.current?.style.setProperty("--bieyinan-snackbar-time", duration + "ms");
  },

  diffDate: (d, more = false) => {
    const dateNow = new Date();
    const datePost = new Date(d);
    const dateDiff = dateNow.getTime() - datePost.getTime();
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    let result;
    if (more) {
      const monthCount = dateDiff / month;
      const dayCount = dateDiff / day;
      const hourCount = dateDiff / hour;
      const minuteCount = dateDiff / minute;

      if (monthCount > 12) {
        result = datePost.toLocaleDateString().replace(/\//g, "-");
      } else if (monthCount >= 1) {
        result = parseInt(monthCount) + " " + GLOBAL_CONFIG.dateSuffix.month;
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + " " + GLOBAL_CONFIG.dateSuffix.day;
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + " " + GLOBAL_CONFIG.dateSuffix.hour;
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.dateSuffix.min;
      } else {
        result = GLOBAL_CONFIG.dateSuffix.just;
      }
    } else {
      result = parseInt(dateDiff / day);
    }
    return result;
  },

  loadComment: (dom, callback) => {
    if ("IntersectionObserver" in window) {
      const observerItem = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            callback();
            observerItem.disconnect();
          }
        },
        { threshold: [0] }
      );
      observerItem.observe(dom);
    } else {
      callback();
    }
  },

  scrollToDest: (pos, time = 500) => {
    const currentPos = window.pageYOffset;
    if (currentPos > pos) pos = pos - 70

    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: pos,
        behavior: "smooth",
      });
      return;
    }

    let start = null;
    pos = +pos;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      const progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time);
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  },

  animateIn: (ele, text) => {
    ele.style.display = "block";
    ele.style.animation = text;
  },

  animateOut: (ele, text) => {
    ele.addEventListener("animationend", function f() {
      ele.style.display = "";
      ele.style.animation = "";
      ele.removeEventListener("animationend", f);
    });
    ele.style.animation = text;
  },

  getParents: (elem, selector) => {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  },

  siblings: (ele, selector) => {
    return [...ele.parentNode.children].filter(child => {
      if (selector) {
        return child !== ele && child.matches(selector);
      }
      return child !== ele;
    });
  },

  /**
   * @param {*} selector
   * @param {*} eleType the type of create element
   * @param {*} options object key: value
   */
  wrap: (selector, eleType, options) => {
    const creatEle = document.createElement(eleType);
    for (const [key, value] of Object.entries(options)) {
      creatEle.setAttribute(key, value);
    }
    selector.parentNode.insertBefore(creatEle, selector);
    creatEle.appendChild(selector);
  },

  unwrap: el => {
    const elParentNode = el.parentNode;
    if (elParentNode !== document.body) {
      elParentNode.parentNode.insertBefore(el, elParentNode);
      elParentNode.parentNode.removeChild(elParentNode);
    }
  },

  isHidden: ele => ele.offsetHeight === 0 && ele.offsetWidth === 0,

  getEleTop: ele => {
    let actualTop = ele.offsetTop;
    let current = ele.offsetParent;

    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }

    return actualTop;
  },
  // 加载图片懒加载
  loadLightbox: ele => {
    const service = GLOBAL_CONFIG.lightbox;

    if (service === "mediumZoom") {
      const zoom = mediumZoom(ele);
      zoom.on("open", e => {
        const photoBg = document.documentElement.getAttribute("data-theme") === "dark" ? "#121212" : "#fff";
        zoom.update({
          background: photoBg,
        });
      });
    }

    if (service === "fancybox") {
      Array.from(ele).forEach(i => {
        if (i.parentNode.tagName !== "A") {
          const dataSrc = i.dataset.lazySrc || i.src;
          const dataCaption = i.title || i.alt || "";
          bieyinan.wrap(i, "a", {
            href: dataSrc,
            "data-fancybox": "gallery",
            "data-caption": dataCaption,
            "data-thumb": dataSrc,
          });
        }
      });

      if (!window.fancyboxRun) {
        Fancybox.bind("[data-fancybox]", {
          Hash: false,
          Thumbs: {
            autoStart: false,
          },
        });
        window.fancyboxRun = true;
      }
    }
  },
  // 初始化 justifiedGallery
  initJustifiedGallery: function (selector) {
    const runJustifiedGallery = i => {
      if (!bieyinan.isHidden(i)) {
        fjGallery(i, {
          itemSelector: ".fj-gallery-item",
          rowHeight: i.getAttribute("data-rowHeight"),
          gutter: 4,
          onJustify: function () {
            this.$container.style.opacity = "1";
          },
        });
      }
    };

    if (Array.from(selector).length === 0) runJustifiedGallery(selector);
    else
      selector.forEach(i => {
        runJustifiedGallery(i);
      });
  },
  //更新锚点
  updateAnchor: anchor => {
    if (anchor !== window.location.hash) {
      if (!anchor) anchor = location.pathname;
      const title = GLOBAL_CONFIG_SITE.title;
      window.history.replaceState(
        {
          url: location.href,
          title,
        },
        title,
        anchor
      );
    }
  },

  //更改主题色
  changeThemeColor: function (color) {
    // console.info(`%c ${color}`, `font-size:36px;color:${color};`);
    if (themeColorMeta !== null) {
      themeColorMeta.setAttribute("content", color);
    }
  },

  //顶栏自适应主题色
  initThemeColor: function () {
    let themeColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--bieyinan-bar-background")
      .trim()
      .replace('"', "")
      .replace('"', "");
    const currentTop = window.scrollY || document.documentElement.scrollTop;
    if (currentTop > 56) {
      if (bieyinan.is_Post()) {
        themeColor = getComputedStyle(document.documentElement)
          .getPropertyValue("--bieyinan-meta-theme-post-color")
          .trim()
          .replace('"', "")
          .replace('"', "");
      }
      if (themeColorMeta.getAttribute("content") === themeColor) return;
      this.changeThemeColor(themeColor);
    } else {
      if (themeColorMeta.getAttribute("content") === themeColor) return;
      this.changeThemeColor(themeColor);
    }
  },
  //切换主题色
  switchDarkMode: () => {
    // Switch Between Light And Dark Mode
    const nowMode = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const rightMenu = document.getElementById("rightMenu");
    if (nowMode === "light") {
      activateDarkMode();
      saveToLocal.set("theme", "dark", 2);
      GLOBAL_CONFIG.Snackbar !== undefined && bieyinan.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
      rightMenu.querySelector(".menu-darkmode-text").textContent = "浅色模式";
    } else {
      activateLightMode();
      saveToLocal.set("theme", "light", 2);
      GLOBAL_CONFIG.Snackbar !== undefined && bieyinan.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day);
      rightMenu.querySelector(".menu-darkmode-text").textContent = "深色模式";
    }
    // handle some cases
    typeof runMermaid === "function" && window.runMermaid();
    rm && rm.hideRightMenu();
    bieyinan.darkModeStatus();
  },
  //是否是文章页
  is_Post: function () {
    var url = window.location.href; //获取url
    if (url.indexOf("/posts/") >= 0) {
      //判断url地址中是否包含code字符串
      return true;
    } else {
      return false;
    }
  },
  //监测是否在页面开头
  addNavBackgroundInit: function () {
    var scrollTop = 0,
      bodyScrollTop = 0,
      documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;

    if (scrollTop != 0) {
      pageHeaderEl.classList.add("nav-fixed");
      pageHeaderEl.classList.add("nav-visible");
    }
  },
  // 下载图片
  downloadImage: function (imgsrc, name) {
    //下载图片地址和图片名
    rm.hideRightMenu();
    if (rm.downloadimging == false) {
      rm.downloadimging = true;
      bieyinan.snackbarShow("正在下载中，请稍后", false, 10000);
      setTimeout(function () {
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
          let a = document.createElement("a"); // 生成一个a元素
          let event = new MouseEvent("click"); // 创建一个单击事件
          a.download = name || "photo"; // 设置图片名称
          a.href = url; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = imgsrc;
        bieyinan.snackbarShow("图片已添加盲水印，请遵守版权协议");
        rm.downloadimging = false;
      }, "10000");
    } else {
      bieyinan.snackbarShow("有正在进行中的下载，请稍后再试");
    }
  },
  //禁止图片右键单击
  stopImgRightDrag: function () {
    var img = document.getElementsByTagName("img");
    for (var i = 0; i < img.length; i++) {
      img[i].addEventListener("dragstart", function () {
        return false;
      });
    }
  },
  //滚动到指定id
  scrollTo: function (id) {
    var domTop = document.querySelector(id).offsetTop;
    window.scrollTo(0, domTop - 80);
  },
  //隐藏侧边栏
  hideAsideBtn: () => {
    // Hide aside
    const $htmlDom = document.documentElement.classList;
    $htmlDom.contains("hide-aside")
      ? saveToLocal.set("aside-status", "show", 2)
      : saveToLocal.set("aside-status", "hide", 2);
    $htmlDom.toggle("hide-aside");
    $htmlDom.contains("hide-aside")
      ? document.querySelector("#consoleHideAside").classList.add("on")
      : document.querySelector("#consoleHideAside").classList.remove("on");
  },
  // 热评切换
  switchCommentBarrage: function () {
    let commentBarrage = document.querySelector(".comment-barrage");
    if (commentBarrage) {
      if (window.getComputedStyle(commentBarrage).display === "flex") {
        commentBarrage.style.display = "none";
        bieyinan.snackbarShow("✨ 已关闭评论弹幕");
        document.querySelector(".menu-commentBarrage-text").textContent = "显示热评";
        document.querySelector("#consoleCommentBarrage").classList.remove("on");
        localStorage.setItem("commentBarrageSwitch", "false");
      } else {
        commentBarrage.style.display = "flex";
        document.querySelector(".menu-commentBarrage-text").textContent = "关闭热评";
        document.querySelector("#consoleCommentBarrage").classList.add("on");
        bieyinan.snackbarShow("✨ 已开启评论弹幕");
        localStorage.removeItem("commentBarrageSwitch");
      }
    }
    rm.hideRightMenu();
  },
  // 初始化评论分页
  initPaginationObserver: () => {
    const commentElement = document.getElementById("post-comment");
    const paginationElement = document.getElementById("pagination");

    if (commentElement && paginationElement) {
      new IntersectionObserver(entries => {
        const commentBarrage = document.querySelector(".comment-barrage");

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            paginationElement.classList.add("show-window");
            if (commentBarrage) {
              commentBarrage.style.bottom = "-200px";
            }
          } else {
            paginationElement.classList.remove("show-window");
            if (commentBarrage) {
              commentBarrage.style.bottom = "0px";
            }
          }
        });
      }).observe(commentElement);
    }
  },
  // 初始化即刻
  initIndexEssay: function () {
    if (!document.querySelector("#bbTimeList")) return;
    setTimeout(() => {
      let essay_bar_swiper = new Swiper(".essay_bar_swiper_container", {
        passiveListeners: true,
        direction: "vertical",
        loop: true,
        autoplay: {
          disableOnInteraction: true,
          delay: 5000,
        },
        mousewheel: true,
      });

      let essay_bar_comtainer = document.getElementById("bbtalk");
      if (essay_bar_comtainer !== null) {
        essay_bar_comtainer.onmouseenter = function () {
          essay_bar_swiper.autoplay.stop();
        };
        essay_bar_comtainer.onmouseleave = function () {
          essay_bar_swiper.autoplay.start();
        };
      }
    }, 100);
  },
  scrollByMouseWheel: function ($list, $target) {
    const scrollHandler = function (e) {
      $list.scrollLeft -= e.wheelDelta / 2;
      e.preventDefault();
    };
    $list.addEventListener("mousewheel", scrollHandler, { passive: false });
    if ($target) {
      $target.classList.add("select");
      $target.style.order = "-1"
      $list.scrollLeft = $target.offsetLeft - $list.offsetLeft - ($list.offsetWidth - $target.offsetWidth) / 2;
    }
  },
  // catalog激活
  catalogActive: function () {
    const $list = document.getElementById("catalog-list");
    if ($list) {
      const $catalog = document.getElementById(decodeURIComponent(window.location.pathname));
      bieyinan.scrollByMouseWheel($list, $catalog);
    }
  },
  // Page Tag 激活
  tagsPageActive: function () {
    const $list = document.getElementById("tag-page-tags");
    if ($list) {
      const $tagPageTags = document.getElementById(decodeURIComponent(window.location.pathname));
      bieyinan.scrollByMouseWheel($list, $tagPageTags);
    }
  },
  // 修改时间显示"最近"
  diffDate: function (d, more = false) {
    const dateNow = new Date();
    const datePost = new Date(d);
    const dateDiff = dateNow.getTime() - datePost.getTime();
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    let result;
    if (more) {
      const monthCount = dateDiff / month;
      const dayCount = dateDiff / day;
      const hourCount = dateDiff / hour;
      const minuteCount = dateDiff / minute;
      if (monthCount >= 1) {
        result = datePost.toLocaleDateString().replace(/\//g, "-");
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + " " + GLOBAL_CONFIG.dateSuffix.day;
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + " " + GLOBAL_CONFIG.dateSuffix.hour;
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.dateSuffix.min;
      } else {
        result = GLOBAL_CONFIG.dateSuffix.just;
      }
    } else {
      result = parseInt(dateDiff / day);
    }
    return result;
  },
  // 修改即刻中的时间显示
  changeTimeInEssay: function () {
    document.querySelector("#bber") &&
      document.querySelectorAll("#bber time").forEach(function (e) {
        var t = e,
          datetime = t.getAttribute("datetime");
        (t.innerText = bieyinan.diffDate(datetime, true)), (t.style.display = "inline");
      });
  },
  // 修改相册集中的时间
  changeTimeInAlbumDetail: function () {
    document.querySelector("#album_detail") &&
      document.querySelectorAll("#album_detail time").forEach(function (e) {
        var t = e,
          datetime = t.getAttribute("datetime");
        (t.innerText = bieyinan.diffDate(datetime, true)), (t.style.display = "inline");
      });
  },
  // 刷新瀑布流
  reflashEssayWaterFall: function () {
    document.querySelector("#waterfall") && setTimeout((function () {
      waterfall("#waterfall"),
        document.getElementById("waterfall").classList.add("show")
    }
    ), 800)
  },
  sayhi: function () {
    const $sayhiEl = document.getElementById("author-info__sayhi");
    if (nick != "小伙伴" && nick != "") {
      nick = JSON.parse(localStorage.getItem("twikoo")).nick;
    }
    const getTimeState = function () {
      var e = new Date().getHours(),
        t = "";
      return (
        0 <= e && e <= 5
          ? (t = "要早点休息哦，" + nick)
          : 5 < e && e <= 10
            ? (t = "好久不见，" + nick)
            : 10 < e && e <= 14
              ? (t = "欢迎再次回来，" + nick)
              : 14 < e && e <= 18
                ? (t = "下午好，" + nick)
                : 18 < e && e <= 24 && (t = "晚上好啊，" + nick),
        t
      );
    };
    $sayhiEl && ($sayhiEl.innerHTML = getTimeState());
  },
  // 友链注入预设评论
  addFriendLink(value) {
    var input = document.getElementsByClassName("el-textarea__inner")[0];
    if (!input) return;
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("input", true, true);
    if (!value) {
      input.value =
        "昵称（请勿包含博客等字样）：\n网站地址（要求博客地址，请勿提交个人主页）：\n头像图片url（请提供尽可能清晰的图片，我会上传到我自己的图床）：\n描述：\n站点截图（可选）：\n";
    } else {
      input.value =
        "```yml\n- name:\n  link: \n  avatar:\n  descr: \n  siteshot:\n```";
    }

    input.dispatchEvent(evt);
    input.focus();
    input.setSelectionRange(-1, -1);
  },
  //友链随机传送
  travelling() {
    var fetchUrl = GLOBAL_CONFIG.friends_vue_info.apiurl + "randomfriend";
    fetch(fetchUrl)
      .then(res => res.json())
      .then(json => {
        var name = json.name;
        var link = json.link;
        Snackbar.show({
          text:
            "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
          duration: 8000,
          pos: "top-center",
          actionText: "前往",
          onActionClick: function (element) {
            element.style.opacity = 0;
            window.open(link, "_blank");
          },
        });
      });
  },
  //切换音乐播放状态
  musicToggle: function (changePaly = true) {
    if (!bieyinan_musicFirst) {
      bieyinan.musicBindEvent();
      bieyinan_musicFirst = true;
    }
    let msgPlay = '<i class="bi bi-play-fill"></i><span>播放音乐</span>'; // 此處可以更改為你想要顯示的文字
    let msgPause = '<i class="bi bi-pause-fill"></i><span>暂停音乐</span>'; // 同上，但兩處均不建議更改
    if (bieyinan_musicPlaying) {
      navMusicEl.classList.remove("playing");
      document.getElementById("menu-music-toggle").innerHTML = msgPlay;
      document.getElementById("nav-music-hoverTips").innerHTML = "音乐已暂停";
      document.querySelector("#consoleMusic").classList.remove("on");
      bieyinan_musicPlaying = false;
      navMusicEl.classList.remove("stretch");
    } else {
      navMusicEl.classList.add("playing");
      document.getElementById("menu-music-toggle").innerHTML = msgPause;
      document.querySelector("#consoleMusic").classList.add("on");
      bieyinan_musicPlaying = true;
      navMusicEl.classList.add("stretch");
    }

    if (changePaly) document.querySelector("meting-js").aplayer.toggle();
    rm.hideRightMenu();
  },
  // 音乐伸缩
  musicTelescopic: function () {
    if (navMusicEl.classList.contains("stretch")) {
      navMusicEl.classList.remove("stretch");
    } else {
      navMusicEl.classList.add("stretch");
    }
  },

  //音乐上一曲
  musicSkipBack: function () {
    navMusicEl.querySelector("meting-js").aplayer.skipBack();
    rm.hideRightMenu();
  },

  //音乐下一曲
  musicSkipForward: function () {
    navMusicEl.querySelector("meting-js").aplayer.skipForward();
    navMusicEl.classList.add("playing");
    rm.hideRightMenu();
  },

  //获取音乐中的名称
  musicGetName: function () {
    var x = $(".aplayer-title");
    var arr = [];
    for (var i = x.length - 1; i >= 0; i--) {
      arr[i] = x[i].innerText;
    }
    return arr[0];
  },

  // 检测显示模式
  darkModeStatus: function () {
    let theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    if (theme == "light") {
      document.getElementsByClassName("menu-darkmode-text").innerText = "深色模式";
      if (document.querySelector("#selfie"))
        document.querySelector("#selfie").src = "https://bu.dusays.com/2023/06/23/64959b78666b9.jpg"
      if (document.querySelector(".loading-img"))
        document.querySelector(".loading-img").src="https://btf.lazyingman.cn/animal%2Floading.gif";

    } else {
      document.getElementsByClassName("menu-darkmode-text").innerText = "浅色模式";
      if (document.querySelector("#selfie"))
        document.querySelector("#selfie").src = "https://bu.dusays.com/2023/08/07/64d109ee3e865.webp"
      if (document.querySelector(".loading-img"))
        document.querySelector(".loading-img").src="https://btf.lazyingman.cn/animal%2Floading2.gif";
    }
  },

  //初始化console图标
  initConsoleState: function () {
    //初始化隐藏边栏
    const $htmlDomClassList = document.documentElement.classList;
    $htmlDomClassList.contains("hide-aside")
      ? document.querySelector("#consoleHideAside").classList.add("on")
      : document.querySelector("#consoleHideAside").classList.remove("on");
  },

  // 显示打赏中控台
  rewardShowConsole: function () {
    // 判断是否为赞赏打开控制台
    consoleEl.classList.add("reward-show");
    bieyinan.initConsoleState();
  },
  // 显示中控台
  showConsole: function () {
    document.querySelector("#console").classList.add("show");
    bieyinan.initConsoleState();
  },

  //隐藏中控台
  hideConsole: function () {
    if (consoleEl.classList.contains("show")) {
      // 如果是一般控制台，就关闭一般控制台
      consoleEl.classList.remove("show");
    } else if (consoleEl.classList.contains("reward-show")) {
      // 如果是打赏控制台，就关闭打赏控制台
      consoleEl.classList.remove("reward-show");
    }
  },
  // 取消加载动画
  hideLoading: function () {
    document.getElementById("loading-box").classList.add("loaded");
  },
  // 将音乐缓存播放
  cacheAndPlayMusic() {
    let data = localStorage.getItem("musicData");
    if (data) {
      data = JSON.parse(data);
      const currentTime = new Date().getTime();
      if (currentTime - data.timestamp < 24 * 60 * 60 * 1000) {
        // 如果缓存的数据没有过期，直接使用
        bieyinan.playMusic(data.songs);
        return;
      }
    }

    // 否则重新从服务器获取数据
    fetch("/json/music2.json")
      .then(response => response.json())
      .then(songs => {
        const cacheData = {
          timestamp: new Date().getTime(),
          songs: songs,
        };
        localStorage.setItem("musicData", JSON.stringify(cacheData));
        bieyinan.playMusic(songs);
      });
  },
  // 播放音乐
  playMusic(songs) {
    const anMusicPage = document.getElementById("anMusic-page");
    const metingAplayer = anMusicPage.querySelector("meting-js").aplayer;
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    const allAudios = metingAplayer.list.audios;
    if (!selectRandomSong.includes(randomSong.name)) {
      // 如果随机到的歌曲已经未被随机到过，就添加进metingAplayer.list
      metingAplayer.list.add([randomSong]);
      // 播放最后一首(因为是添加到了最后)
      metingAplayer.list.switch(allAudios.length);
      // 添加到已被随机的歌曲列表
      selectRandomSong.push(randomSong.name);
    } else {
      // 随机到的歌曲已经在播放列表中了
      // 直接继续随机直到随机到没有随机过的歌曲，如果全部随机过了就切换到对应的歌曲播放即可
      let songFound = false;
      while (!songFound) {
        const newRandomIndex = Math.floor(Math.random() * songs.length);
        const newRandomSong = songs[newRandomIndex];
        if (!selectRandomSong.includes(newRandomSong.name)) {
          metingAplayer.list.add([newRandomSong]);
          metingAplayer.list.switch(allAudios.length);
          selectRandomSong.push(newRandomSong.name);
          songFound = true;
        }
        // 如果全部歌曲都已被随机过，跳出循环
        if (selectRandomSong.length === songs.length) {
          break;
        }
      }
      if (!songFound) {
        // 如果全部歌曲都已被随机过，切换到对应的歌曲播放
        const palyMusicIndex = allAudios.findIndex(song => song.name === randomSong.name);
        if (palyMusicIndex != -1) metingAplayer.list.switch(palyMusicIndex);
      }
    }
  },
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    const anMusicBg = document.getElementById("an_music_bg");
    if (isChangeBg) {
      const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
      anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(() => {
        const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
        // 确保player加载完成
        if (musiccover) {
          clearInterval(timer);
          // 绑定事件
          bieyinan.addEventListenerMusic();
          // 确保第一次能够正确替换背景
          bieyinan.changeMusicBg();

          // 暂停nav的音乐
          if (
            document.querySelector("#nav-music meting-js").aplayer &&
            !document.querySelector("#nav-music meting-js").aplayer.audio.paused
          ) {
            bieyinan.musicToggle();
          }
        }
      }, 100);
    }
  },
  lrcUpdate() {
    const aplayerLrcContents = document.querySelector('.aplayer-lrc-contents');
    const currentLrc = aplayerLrcContents.querySelector('p.aplayer-lrc-current');
    if (currentLrc) {
      const currentIndex = Array.from(aplayerLrcContents.children).indexOf(currentLrc);
      aplayerLrcContents.style.transform = `translateY(${-currentIndex * 40}px)`;
    }
  },
  // 获取自定义播放列表
  getCustomPlayList: function () {
    if (!window.location.pathname.startsWith("/music/")) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const userId = "8106091931";
    const userServer = "netease";
    const anMusicPageMeting = document.getElementById("anMusic-page-meting");
    if (urlParams.get("id") && urlParams.get("server")) {
      const id = urlParams.get("id");
      const server = urlParams.get("server");
      anMusicPageMeting.innerHTML = `<meting-js id="${id}" server=${server} type="playlist" type="playlist" mutex="true" preload="auto" theme="var(--bieyinan-main)" order="list" list-max-height="calc(100vh - 169px)!important"></meting-js>`;
    } else {
      anMusicPageMeting.innerHTML = `<meting-js id="${userId}" server="${userServer}" type="playlist" mutex="true" preload="auto" theme="var(--bieyinan-main)" order="list" list-max-height="calc(100vh - 169px)!important"></meting-js>`;
    }
    bieyinan.changeMusicBg(false);
  },
  /** @brief 同步侧边栏歌单；兼容原有无参数及 false 参数调用。 */
  getAsidePlayList: function () {
    let State = bieyinan.AsideMusicState;
    if (!State) {
      State = bieyinan.AsideMusicState = { Timer: null, Deadline: 0, Players: new WeakSet(), Navigating: false, Queued: false };
      const Cancel = () => {
        clearTimeout(State.Timer);
        State.Timer = null;
        State.Deadline = 0;
        State.Navigating = true;
      };
      const Resume = () => { State.Navigating = false; bieyinan.getAsidePlayList(); };
      document.addEventListener('pjax:send', Cancel);
      document.addEventListener('pjax:complete', Resume);
      window.addEventListener('pagehide', Cancel);
      window.addEventListener('pageshow', Resume);
    }
    clearTimeout(State.Timer);
    State.Timer = null;
    if (State.Navigating) return;
    const List = document.querySelector('#contain-list ol');
    const Meting = document.querySelector('#nav-music meting-js');
    if (!List || !Meting) { State.Deadline = 0; return; }
    const Player = Meting.aplayer;
    // Meting 没有就绪事件，只保留一个最长 10 秒的等待任务。
    if (!Player?.list || !Array.isArray(Player.list.audios)) {
      if (!State.Deadline) State.Deadline = Date.now() + 10000;
      if (Date.now() < State.Deadline) {
        State.Timer = setTimeout(() => bieyinan.getAsidePlayList(), 200);
      } else State.Deadline = 0;
      return;
    }
    State.Deadline = 0;
    const Songs = Player.list.audios;
    const Signature = JSON.stringify(Songs.map(Song => [Song.name, Song.artist]));
    if (List.AsideMusicSignature !== Signature || List.children.length !== Songs.length) {
      const Fragment = document.createDocumentFragment();
      Songs.forEach((Song, Index) => {
        const Item = document.createElement('li');
        Item.dataset.index = String(Index);
        for (const [ClassName, Text] of [['list-index', (Index + 1) + '.'], ['list-title', Song.name], ['list-author', Song.artist]]) {
          const Span = document.createElement('span');
          Span.className = ClassName;
          Span.textContent = Text ?? '';
          Item.appendChild(Span);
        }
        Fragment.appendChild(Item);
      });
      List.replaceChildren(Fragment);
      List.AsideMusicSignature = Signature;
    }
    bieyinan.addEventListenerAsideMusic();
    bieyinan.asideMusiclistPageLight();
    bieyinan.MusiclistLight();
  },
  /** @brief 每个列表节点只绑定一次点击事件，并使用当前播放器。 */
  addEventListenerAsideMusic: function () {
    const List = document.querySelector('#contain-list ol');
    if (!List || List.AsideMusicClickBound) return;
    List.AsideMusicClickBound = true;
    List.addEventListener('click', Event => {
      const Item = Event.target.closest?.('li[data-index]');
      const Player = document.querySelector('#nav-music meting-js')?.aplayer;
      if (!Item || !List.contains(Item) || !Player?.list) return;
      const Index = Number(Item.dataset.index);
      if (!Number.isInteger(Index) || Index < 0 || Index >= Player.list.audios.length) return;
      if (Index !== Player.list.index) {
        Player.list.switch(Index);
        Player.play();
        document.getElementById('nav-music')?.classList.add('stretch');
      } else bieyinan.musicToggle();
      bieyinan.MusiclistLight();
    });
  },
  /** @brief 每个播放器只监听一次；APlayer 事件早于数据更新，延迟到微任务同步。 */
  asideMusiclistPageLight: function () {
    const Player = document.querySelector('#nav-music meting-js')?.aplayer;
    const State = bieyinan.AsideMusicState;
    if (!Player || !State || State.Players.has(Player)) return;
    State.Players.add(Player);
    const Refresh = () => {
      if (State.Navigating || State.Queued || document.querySelector('#nav-music meting-js')?.aplayer !== Player) return;
      State.Queued = true;
      queueMicrotask(() => {
        State.Queued = false;
        if (!State.Navigating) bieyinan.getAsidePlayList();
      });
    };
    for (const Type of ['play', 'listswitch', 'listadd', 'listremove', 'listclear']) Player.on(Type, Refresh);
  },
  /** @brief 只更新前后高亮项；超出可见区域时使用原生滚动，避免 JS 动画叠加。 */
  MusiclistLight: function () {
    const List = document.querySelector('#contain-list ol');
    const Player = document.querySelector('#nav-music meting-js')?.aplayer;
    if (!List || !Player?.list) return;
    const Previous = List.querySelector('.list-light');
    const Item = List.children[Player.list.index];
    if (Previous === Item) return;
    Previous?.classList.remove('list-light');
    if (!Item) return;
    Item.classList.add('list-light');
    if (!List.clientHeight) return;
    const View = List.getBoundingClientRect();
    const Row = Item.getBoundingClientRect();
    const Top = List.scrollTop + Row.top - View.top - List.clientTop;
    const Bottom = Top + Row.height;
    const Destination = Top < List.scrollTop ? Top : Bottom > List.scrollTop + List.clientHeight ? Bottom - List.clientHeight : null;
    if (Destination !== null) List.scrollTo({ top: Math.max(0, Destination), behavior: 'smooth' });
  },
  //隐藏今日推荐
  hideTodayCard: function () {
    if (document.getElementById("todayCard")) {
      document.getElementById("todayCard").classList.add("hide");
      const topGroup = document.querySelector(".topGroup");
      const recentPostItems = topGroup.querySelectorAll(".recent-post-item");
      recentPostItems.forEach(item => {
        item.style.display = "flex";
      });
    }
  },

  // 监听音乐背景改变
  addEventListenerMusic: function () {
    const anMusicPage = document.getElementById("anMusic-page");
    const aplayerIconMenu = anMusicPage.querySelector(".aplayer-info .aplayer-time .aplayer-icon-menu");
    const anMusicBtnGetSong = anMusicPage.querySelector("#anMusicBtnGetSong");
    const anMusicRefreshBtn = anMusicPage.querySelector("#anMusicRefreshBtn");
    const anMusicSwitchingBtn = anMusicPage.querySelector("#anMusicSwitching");
    const metingAplayer = anMusicPage.querySelector("meting-js").aplayer;
    //初始化音量
    metingAplayer.volume(0.8, true);
    metingAplayer.on("loadeddata", function () {
      bieyinan.changeMusicBg();
    });
    metingAplayer.on("timeupdate", function () {
      bieyinan.lrcUpdate();
    })
    aplayerIconMenu.addEventListener("click", function () {
      document.getElementById("menu-mask").style.display = "block";
      document.getElementById("menu-mask").style.animation = "0.5s ease 0s 1 normal none running to_show";
      anMusicPage.querySelector(".aplayer.aplayer-withlist .aplayer-list").style.opacity = "1";
    });

    // 监听遮罩层点击事件
    function anMusicPageMenuAask() {
      if (window.location.pathname != "/music/") {
        document.getElementById("menu-mask").removeEventListener("click", anMusicPageMenuAask);
        return;
      }

      anMusicPage.querySelector(".aplayer-list").classList.remove("aplayer-list-hide");
    }

    document.getElementById("menu-mask").addEventListener("click", anMusicPageMenuAask);

    // 监听增加单曲按钮
    anMusicBtnGetSong.addEventListener("click", () => {
      if (metingAplayer.BieyinanPlaylist?.Alternate) {
        const anMusicPage = document.getElementById("anMusic-page");
        const metingAplayer = anMusicPage.querySelector("meting-js").aplayer;
        const allAudios = metingAplayer.list.audios;
        const randomIndex = Math.floor(Math.random() * allAudios.length);
        // 随机播放一首
        metingAplayer.list.switch(randomIndex);
      } else {
        bieyinan.cacheAndPlayMusic();
      }
    });
    anMusicRefreshBtn.addEventListener("click", () => {
      localStorage.removeItem("musicData");
      bieyinan.snackbarShow("已移除相关缓存歌曲");
    });
    anMusicSwitchingBtn.addEventListener("click", () => {
      bieyinan.changeMusicList();
    });

    // 监听键盘事件
    //空格控制音乐
    document.addEventListener("keydown", function (event) {
      //暂停开启音乐
      if (event.code === "Space") {
        event.preventDefault();
        metingAplayer.toggle();
      }
      //切换下一曲
      if (event.keyCode === 39) {
        event.preventDefault();
        metingAplayer.skipForward();
      }
      //切换上一曲
      if (event.keyCode === 37) {
        event.preventDefault();
        metingAplayer.skipBack();
      }
      //增加音量
      if (event.keyCode === 38) {
        if (musicVolume <= 1) {
          musicVolume += 0.1;
          metingAplayer.volume(musicVolume, true);
        }
      }
      //减小音量
      if (event.keyCode === 40) {
        if (musicVolume >= 0) {
          musicVolume += -0.1;
          metingAplayer.volume(musicVolume, true);
        }
      }
    });
  },
  /** @brief 校验可交给 APlayer 的非空歌单，拒绝欢迎文本及错误对象。 */
  validMusicList: function (Songs) {
    return Array.isArray(Songs) && Songs.length > 0 && Songs.every(Song =>
      Song && typeof Song.url === 'string' && Song.url.trim().length > 0);
  },
  /** @brief 获取歌单；仅 music2 使用现有 24 小时缓存，损坏缓存自动失效。 */
  fetchMusicList: async function (Url, Signal) {
    const UseCache = Url === '/json/music2.json';
    if (UseCache) {
      try {
        const Cache = JSON.parse(localStorage.getItem('musicData'));
        const Age = Date.now() - Cache?.timestamp;
        if (Number.isFinite(Cache?.timestamp) && Age >= 0 && Age < 86400000 && bieyinan.validMusicList(Cache.songs)) {
          return Cache.songs;
        }
        localStorage.removeItem('musicData');
      } catch (_) {
        try { localStorage.removeItem('musicData'); } catch (_) {}
      }
    }
    const Response = await fetch(Url, { signal: Signal });
    if (!Response.ok) throw new Error('歌单请求失败：HTTP ' + Response.status);
    let Songs;
    try { Songs = await Response.json(); }
    catch (_) { throw new Error('歌单接口返回的内容不是有效 JSON'); }
    if (!bieyinan.validMusicList(Songs)) throw new Error('歌单为空或歌曲数据格式不正确');
    if (Signal?.aborted) throw new Error('歌单请求已取消');
    if (UseCache) {
      try { localStorage.setItem('musicData', JSON.stringify({ timestamp: Date.now(), songs: Songs })); }
      catch (_) { /* 存储不可用不影响已获取歌单的播放。 */ }
    }
    return Songs;
  },
  /** @brief 统一报告加载失败，不把异常接口正文作为 HTML 显示。 */
  musicListError: function (Error) {
    console.warn('切换歌单失败：', Error.message);
    if (GLOBAL_CONFIG.Snackbar && typeof Snackbar !== 'undefined') {
      bieyinan.snackbarShow('歌单切换失败，请稍后重试');
    }
  },
  /** @brief 按播放器隔离请求与切换状态；最新点击生效，失败保留原歌单。 */
  switchMusicPlaylist: async function (ContainerId, Index) {
    const Container = document.getElementById(ContainerId);
    const Player = Container?.querySelector('meting-js')?.aplayer;
    const IsPage = ContainerId === 'anMusic-page';
    const Sources = [
      'https://mtapi.lazyingman.cn/api?server=netease&type=playlist&id=8106091931',
      '/json/music.json', '/json/music2.json', '/json/dz.json',
    ];
    if (!Player?.list || !Array.isArray(Player.list.audios)) {
      bieyinan.musicListError(new Error('播放器尚未加载完成'));
      return false;
    }
    if (!IsPage && (!Number.isInteger(Index) || Index < 0 || Index >= Sources.length)) {
      bieyinan.musicListError(new Error('无效的歌单编号'));
      return false;
    }
    const State = Player.BieyinanPlaylist ||= { Alternate: false, DefaultSongs: null, Request: null };
    State.Request?.abort();
    const Controller = new AbortController();
    State.Request = Controller;
    const UseAlternate = IsPage && !State.Alternate;
    const DefaultSongs = UseAlternate ? Player.list.audios.map(Song => ({ ...Song })) : State.DefaultSongs;
    let TimedOut = false;
    const Timer = setTimeout(() => { TimedOut = true; Controller.abort(); }, 10000);
    const Cancel = () => Controller.abort();
    document.addEventListener('pjax:send', Cancel, { once: true });
    window.addEventListener('pagehide', Cancel, { once: true });
    try {
      const Songs = IsPage && !UseAlternate ? DefaultSongs :
        await bieyinan.fetchMusicList(IsPage ? '/json/music2.json' : Sources[Index], Controller.signal);
      // 即使服务忽略取消信号，迟到响应也不能覆盖最新选择或新页面。
      if (State.Request !== Controller || Controller.signal.aborted || !Container.isConnected ||
          document.getElementById(ContainerId)?.querySelector('meting-js')?.aplayer !== Player) return false;
      if (!bieyinan.validMusicList(Songs)) throw new Error('歌单为空或歌曲数据格式不正确');
      if (IsPage && UseAlternate && !bieyinan.validMusicList(DefaultSongs)) {
        throw new Error('原歌单尚未就绪，暂时不能切换');
      }
      // 数据准备完成才替换；复制歌曲对象，避免播放器改动用于恢复的快照。
      const NextSongs = Songs.map(Song => ({ ...Song }));
      Player.list.clear();
      Player.list.add(NextSongs);
      if (IsPage) {
        State.DefaultSongs = UseAlternate ? DefaultSongs : null;
        State.Alternate = UseAlternate;
      } else {
        Container.classList.add('stretch');
        Player.play();
        bieyinan.getAsidePlayList();
      }
      return true;
    } catch (Failure) {
      if (State.Request === Controller && (!Controller.signal.aborted || TimedOut)) {
        bieyinan.musicListError(TimedOut ? new Error('歌单请求超时') : Failure);
      }
      return false;
    } finally {
      clearTimeout(Timer);
      document.removeEventListener('pjax:send', Cancel);
      window.removeEventListener('pagehide', Cancel);
      if (State.Request === Controller) State.Request = null;
    }
  },
  // 音乐页在原歌单和周杰伦歌单之间切换，沿用原来的不自动播放行为。
  changeMusicList: function () {
    return bieyinan.switchMusicPlaylist('anMusic-page');
  },
  // 主页选择指定歌单并播放，不改变音乐页的切换状态。
  changeMusicList2: function (Index) {
    return bieyinan.switchMusicPlaylist('nav-music', Index);
  },
  // 控制台音乐列表监听
  addEventListenerConsoleMusicList: function () {
    const navMusic = document.getElementById("nav-music");
    if (!navMusic) return;
    navMusic.addEventListener("click", e => {
      const aplayerList = navMusic.querySelector(".aplayer-list");
      const listBtn = navMusic.querySelector(
        "div.aplayer-info > div.aplayer-controller > div.aplayer-time.aplayer-time-narrow > button.aplayer-icon.aplayer-icon-menu svg"
      );
      if (e.target != listBtn && aplayerList.classList.contains("aplayer-list-hide")) {
        aplayerList.classList.remove("aplayer-list-hide");
      }
    });
  },
  // 监听按键
  toPage: function () {
    var toPageText = document.getElementById("toPageText"),
      toPageButton = document.getElementById("toPageButton"),
      pageNumbers = document.querySelectorAll(".page-number"),
      lastPageNumber = Number(pageNumbers[pageNumbers.length - 1].innerHTML),
      pageNumber = Number(toPageText.value);

    if (!isNaN(pageNumber) && pageNumber >= 1 && Number.isInteger(pageNumber)) {
      var url = "/page/" + (pageNumber > lastPageNumber ? lastPageNumber : pageNumber) + "/";
      toPageButton.href = pageNumber === 1 ? "/" : url;
    } else {
      toPageButton.href = "javascript:void(0);";
    }
  },

  //删除多余的class
  removeBodyPaceClass: function () {
    document.body.className = "pace-done";
  },
  // 修改body的type类型以适配css
  setValueToBodyType: function () {
    const input = document.getElementById("page-type"); // 获取input元素
    const value = input.value; // 获取input的value值
    document.body.dataset.type = value; // 将value值赋值到body的type属性上
  },
  //匿名评论
  addRandomCommentInfo: function () {
    // 从形容词数组中随机取一个值
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    // 从蔬菜水果动物名字数组中随机取一个值
    const randomName = vegetablesAndFruits[Math.floor(Math.random() * vegetablesAndFruits.length)];

    // 将两个值组合成一个字符串
    const name = `${randomAdjective}${randomName}`;

    function dr_js_autofill_commentinfos() {
      var lauthor = [
        "#author",
        "input[name='comname']",
        "#inpName",
        "input[name='author']",
        "#ds-dialog-name",
        "#name",
        "input[name='nick']",
        "#comment_author",
      ],
        lmail = [
          "#mail",
          "#email",
          "input[name='commail']",
          "#inpEmail",
          "input[name='email']",
          "#ds-dialog-email",
          "input[name='mail']",
          "#comment_email",
        ],
        lurl = [
          "#url",
          "input[name='comurl']",
          "#inpHomePage",
          "#ds-dialog-url",
          "input[name='url']",
          "input[name='website']",
          "#website",
          "input[name='link']",
          "#comment_url",
        ];
      for (var i = 0; i < lauthor.length; i++) {
        var author = document.querySelector(lauthor[i]);
        if (author != null) {
          author.value = name;
          author.dispatchEvent(new Event("input"));
          author.dispatchEvent(new Event("change"));
          break;
        }
      }
      for (var j = 0; j < lmail.length; j++) {
        var mail = document.querySelector(lmail[j]);
        if (mail != null) {
          // mail.value = visitorMail;
          mail.dispatchEvent(new Event("input"));
          mail.dispatchEvent(new Event("change"));
          break;
        }
      }
      return !1;
    }

    dr_js_autofill_commentinfos();
    var input = document.getElementsByClassName("el-textarea__inner")[0];
    input.focus();
    input.setSelectionRange(-1, -1);
  },

  // 跳转开往
  totraveling: function () {
    bieyinan.snackbarShow("即将跳转到「开往」项目的成员博客，不保证跳转网站的安全性和可用性", element => {
      element.style.opacity = 0;
      travellingsTimer && clearTimeout(travellingsTimer);
    },
      5000,
      "取消");
    travellingsTimer = setTimeout(function () {
      window.open("https://www.travellings.cn/go.html");
    }, "5000");
  },

  // 工具函数替换字符串
  replaceAll: function (e, n, t) {
    return e.split(n).join(t);
  },

  // 音乐绑定事件
  musicBindEvent: function () {
    document.querySelector("#nav-music .aplayer-music").addEventListener("click", function () {
      bieyinan.musicTelescopic();
    });
    document.querySelector("#nav-music .aplayer-button").addEventListener("click", function () {
      bieyinan.musicToggle(false);
    });
  },

  // 判断是否是移动端
  hasMobile: function () {
    let isMobile = false;
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      ) ||
      document.body.clientWidth < 800
    ) {
      // 移动端
      isMobile = true;
    }
    return isMobile;
  },

  // 创建二维码
  qrcodeCreate: function () {
    if (document.getElementById("qrcode")) {
      document.getElementById("qrcode").innerHTML = "";
      var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: window.location.href,
        width: 250,
        height: 250,
        colorDark: "#000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  },

  // 判断是否在视口内
  isInViewPortOfOne: function (el) {
    if (!el) return;
    const elDisplay = window.getComputedStyle(el).getPropertyValue("display");
    if (elDisplay == "none") {
      return;
    }
    const viewPortHeight =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const offsetTop = el.offsetTop;
    const scrollTop = document.documentElement.scrollTop;
    const top = offsetTop - scrollTop;
    return top <= viewPortHeight;
  },
  //添加赞赏蒙版
  addRewardMask: function () {
    if (!document.querySelector(".reward-main")) return;
    document.querySelector(".reward-main").style.display = "flex";
    document.querySelector(".reward-main").style.zIndex = "102";
    document.getElementById("quit-box").style.display = "flex";
  },
  // 移除赞赏蒙版
  removeRewardMask: function () {
    if (!document.querySelector(".reward-main")) return;
    document.querySelector(".reward-main").style.display = "none";
    document.getElementById("quit-box").style.display = "none";
  },
  // 键盘开关
  keyboardToggle: function () {
    const isKeyboardOn = bieyinan_keyboard;

    if (isKeyboardOn) {
      const consoleKeyboard = document.querySelector("#consoleKeyboard");
      consoleKeyboard.classList.remove("on");
      bieyinan_keyboard = false;
    } else {
      const consoleKeyboard = document.querySelector("#consoleKeyboard");
      consoleKeyboard.classList.add("on");
      bieyinan_keyboard = true;
    }

    localStorage.setItem("keyboardToggle", isKeyboardOn ? "false" : "true");
  },
  // 右键菜单开关
  rightMenuToggle: function () {
    if (window.oncontextmenu) {
      window.oncontextmenu = null;
    } else if (!window.oncontextmenu && oncontextmenuFunction) {
      window.oncontextmenu = oncontextmenuFunction;
    }
  },
  // 同步所有 FPS 按钮和计数器，初始化与 PJAX 共用同一状态。
  SyncFPS: function () {
    document.getElementById('fps-group')?.classList.toggle('show', bieyinan_FPS);
    document.querySelectorAll('[id="consoleFPS"]').forEach(Button => {
      Button.classList.toggle('on', bieyinan_FPS);
    });
    window.BieyinanFPS?.Refresh();
  },
  // FPS开关
  FPSToggle: function () {
    bieyinan_FPS = !bieyinan_FPS;
    try {
      localStorage.setItem('FPSToggle', String(bieyinan_FPS));
    } catch (_) { /* 存储不可用时仍允许本页切换。 */ }
    bieyinan.SyncFPS();
    GLOBAL_CONFIG.Snackbar !== undefined && bieyinan.snackbarShow(bieyinan_FPS ? '已为你开启FPS' : '已为你关闭FPS');
  },
  // 复制链接
  intersectionObserver: function (enterCallback, leaveCallback) {
    let observer;
    return () => {
      if (!observer) {
        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
              enterCallback?.();
            } else {
              leaveCallback?.();
            }
          });
        });
      } else {
        // 如果 observer 对象已经存在，则先取消对之前元素的观察
        observer.disconnect();
      }
      return observer;
    };
  },
  // CategoryBar滚动
  scrollCategoryBarToRight: function () {
    // 获取需要操作的元素
    const items = document.getElementById("catalog-list");
    const nextButton = document.getElementById("category-bar-next");

    // 检查元素是否存在
    if (items && nextButton) {
      const itemsWidth = items.clientWidth;

      // 判断是否已经滚动到最右侧
      if (items.scrollLeft + items.clientWidth + 1 >= items.scrollWidth) {
        // 滚动到初始位置并更新按钮内容
        items.scroll({
          left: 0,
          behavior: "smooth",
        });
        nextButton.innerHTML = '<i class="bieyinanfont bieyinan-icon-angle-double-right"></i>';
      } else {
        // 滚动到下一个视图
        items.scrollBy({
          left: itemsWidth,
          behavior: "smooth",
        });
      }
    } else {
      console.error("Element(s) not found: 'catalog-list' and/or 'category-bar-next'.");
    }
  },
  // 分类条
  categoriesBarActive: function () {
    const urlinfo = decodeURIComponent(window.location.pathname);
    const $categoryBar = document.getElementById("category-bar");
    if (!$categoryBar) return;

    if (urlinfo === "/") {
      $categoryBar.querySelector("#首页").classList.add("select");
    } else {
      const pattern = /\/categories\/.*?\//;
      const patbool = pattern.test(urlinfo);
      if (!patbool) return;

      const nowCategorie = urlinfo.split("/")[2];
      $categoryBar.querySelector(`#${nowCategorie}`).classList.add("select");
    }
  },
  // 顶部分类条滚动
  topCategoriesBarScroll: function () {
    const $categoryBarItems = document.getElementById("category-bar-items");
    if (!$categoryBarItems) return;

    $categoryBarItems.addEventListener("mousewheel", function (e) {
      const v = -e.wheelDelta / 2;
      this.scrollLeft += v;
      e.preventDefault();
    });
  },
  // 切换菜单显示热评
  switchRightClickMenuHotReview: function () {
    const postComment = document.getElementById("post-comment")
    const menuCommentBarrageDom = document.getElementById("menu-commentBarrage")
    if (postComment) {
      menuCommentBarrageDom.style.display = "flex"
    } else {
      menuCommentBarrageDom.style.display = "none"
    }
  },
  // 切换菜单显示二维码
  enterFullscreen: function (e) {
    e.requestFullscreen ? e.requestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : shine.noFullscreenSupport(),
      shine.is_mobile() && window.screen.orientation.lock("landscape-primary")
  },
  // 切换作者卡片状态文字
  changeSayHelloText: function () {
    const greetings = GLOBAL_CONFIG.authorStatus.skills;

    const authorInfoSayHiElement = document.getElementById("author-info__sayhi");

    let lastSayHello = authorInfoSayHiElement.textContent;

    let randomGreeting = lastSayHello;
    while (randomGreeting === lastSayHello) {
      randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    }
    authorInfoSayHiElement.textContent = randomGreeting;
  },


};

// 弹出窗口管理
const bieyinanPopupManager = {
  queue: [],
  processing: false,
  Jump: false,

  enqueuePopup(title, tip, url, duration = 3000) {
    this.queue.push({ title, tip, url, duration });
    if (!this.processing) {
      this.processQueue();
    }
  },

  processQueue() {
    if (this.queue.length > 0 && !this.processing) {
      this.processing = true;
      const { title, tip, url, duration } = this.queue.shift();
      this.popupShow(title, tip, url, duration);
    }
  },

  popupShow(title, tip, url, duration) {
    const popupWindow = document.getElementById("popup-window");
    if (!popupWindow) return;
    const windowTitle = popupWindow.querySelector(".popup-window-title");
    const windowContent = popupWindow.querySelector(".popup-window-content");
    const cookiesTip = windowContent.querySelector(".popup-tip");
    if (popupWindow.classList.contains("show-popup-window")) {
      popupWindow.classList.add("popup-hide");
    }

    // 等待上一个弹窗完全消失
    setTimeout(() => {
      // 移除之前的点击事件处理程序
      popupWindow.removeEventListener("click", this.clickEventHandler);
      if (url) {
        if (window.pjax) {
          this.clickEventHandler = event => {
            event.preventDefault();
            pjax.loadUrl(url);
            popupWindow.classList.remove("show-popup-window");
            popupWindow.classList.remove("popup-hide");
            this.Jump = true;

            // 处理队列中的下一个弹出窗口
            this.processing = false;
            this.processQueue();
          };

          popupWindow.addEventListener("click", this.clickEventHandler);
        } else {
          this.clickEventHandler = () => {
            window.location.href = url;
          };
          popupWindow.addEventListener("click", this.clickEventHandler);
        }
        if (popupWindow.classList.contains("no-url")) {
          popupWindow.classList.remove("no-url");
        }
      } else {
        if (!popupWindow.classList.contains("no-url")) {
          popupWindow.classList.add("no-url");
        }

        this.clickEventHandler = () => {
          popupWindow.classList.add("popup-hide");
          setTimeout(() => {
            popupWindow.classList.remove("popup-hide");
            popupWindow.classList.remove("show-popup-window");
          }, 1000);
        };
        popupWindow.addEventListener("click", this.clickEventHandler);
      }

      if (popupWindow.classList.contains("popup-hide")) {
        popupWindow.classList.remove("popup-hide");
      }
      popupWindow.classList.add("show-popup-window");
      windowTitle.textContent = title;
      cookiesTip.textContent = tip;
    }, 800);

    setTimeout(() => {
      if (url && !this.Jump) {
        this.Jump = false;
      }
      if (!popupWindow.classList.contains("popup-hide") && popupWindow.className != "") {
        popupWindow.classList.add("popup-hide");
      }

      // 处理队列中的下一个弹出窗口
      this.processing = false;
      this.processQueue();
    }, duration);
  },
};

