const bieyinan={debounce:(e,t=0,n=!1)=>{let o;return(...i)=>{const a=n&&!o;clearTimeout(o),o=setTimeout((()=>{o=null,n||e(...i)}),t),a&&e(...i)}},throttle:function(e,t,n){let o,i,a,s=0;n||(n={});const c=function(){s=!1===n.leading?0:(new Date).getTime(),o=null,e.apply(i,a),o||(i=a=null)};return function(){const l=(new Date).getTime();s||!1!==n.leading||(s=l);const r=t-(l-s);i=this,a=arguments,r<=0||r>t?(o&&(clearTimeout(o),o=null),s=l,e.apply(i,a),o||(i=a=null)):o||!1===n.trailing||(o=setTimeout(c,r))}},sidebarPaddingR:()=>{const e=window.innerWidth,t=document.body.clientWidth,n=e-t;e!==t&&(document.body.style.paddingRight=n+"px")},snackbarShow:(e,t=!1,n=2e3,o=!1)=>{const{position:i,bgLight:a,bgDark:s}=GLOBAL_CONFIG.Snackbar,c="light"===document.documentElement.getAttribute("data-theme")?a:s;document.querySelector(":root").style.setProperty("--bieyinan-snackbar-time",n+"ms"),Snackbar.show({text:e,backgroundColor:c,onActionClick:t,actionText:o,showAction:o,duration:n,pos:i,customClass:"snackbar-css"})},diffDate:(e,t=!1)=>{const n=new Date,o=new Date(e),i=n.getTime()-o.getTime(),a=36e5,s=24*a;let c;if(t){const e=i/(30*s),t=i/s,n=i/a,l=i/6e4;c=e>12?o.toLocaleDateString().replace(/\//g,"-"):e>=1?parseInt(e)+" "+GLOBAL_CONFIG.dateSuffix.month:t>=1?parseInt(t)+" "+GLOBAL_CONFIG.dateSuffix.day:n>=1?parseInt(n)+" "+GLOBAL_CONFIG.dateSuffix.hour:l>=1?parseInt(l)+" "+GLOBAL_CONFIG.dateSuffix.min:GLOBAL_CONFIG.dateSuffix.just}else c=parseInt(i/s);return c},loadComment:(e,t)=>{if("IntersectionObserver"in window){const n=new IntersectionObserver((e=>{e[0].isIntersecting&&(t(),n.disconnect())}),{threshold:[0]});n.observe(e)}else t()},scrollToDest:(e,t=500)=>{const n=window.pageYOffset;if(n>e&&(e-=70),"scrollBehavior"in document.documentElement.style)return void window.scrollTo({top:e,behavior:"smooth"});let o=null;e=+e,window.requestAnimationFrame((function i(a){o=o||a;const s=a-o;n<e?window.scrollTo(0,(e-n)*s/t+n):window.scrollTo(0,n-(n-e)*s/t),s<t?window.requestAnimationFrame(i):window.scrollTo(0,e)}))},animateIn:(e,t)=>{e.style.display="block",e.style.animation=t},animateOut:(e,t)=>{e.addEventListener("animationend",(function t(){e.style.display="",e.style.animation="",e.removeEventListener("animationend",t)})),e.style.animation=t},getParents:(e,t)=>{for(;e&&e!==document;e=e.parentNode)if(e.matches(t))return e;return null},siblings:(e,t)=>[...e.parentNode.children].filter((n=>t?n!==e&&n.matches(t):n!==e)),wrap:(e,t,n)=>{const o=document.createElement(t);for(const[e,t]of Object.entries(n))o.setAttribute(e,t);e.parentNode.insertBefore(o,e),o.appendChild(e)},unwrap:e=>{const t=e.parentNode;t!==document.body&&(t.parentNode.insertBefore(e,t),t.parentNode.removeChild(t))},isHidden:e=>0===e.offsetHeight&&0===e.offsetWidth,getEleTop:e=>{let t=e.offsetTop,n=e.offsetParent;for(;null!==n;)t+=n.offsetTop,n=n.offsetParent;return t},loadLightbox:e=>{const t=GLOBAL_CONFIG.lightbox;if("mediumZoom"===t){const t=mediumZoom(e);t.on("open",(e=>{const n="dark"===document.documentElement.getAttribute("data-theme")?"#121212":"#fff";t.update({background:n})}))}"fancybox"===t&&(Array.from(e).forEach((e=>{if("A"!==e.parentNode.tagName){const t=e.dataset.lazySrc||e.src,n=e.title||e.alt||"";bieyinan.wrap(e,"a",{href:t,"data-fancybox":"gallery","data-caption":n,"data-thumb":t})}})),window.fancyboxRun||(Fancybox.bind("[data-fancybox]",{Hash:!1,Thumbs:{autoStart:!1}}),window.fancyboxRun=!0))},initJustifiedGallery:function(e){const t=e=>{bieyinan.isHidden(e)||fjGallery(e,{itemSelector:".fj-gallery-item",rowHeight:e.getAttribute("data-rowHeight"),gutter:4,onJustify:function(){this.$container.style.opacity="1"}})};0===Array.from(e).length?t(e):e.forEach((e=>{t(e)}))},updateAnchor:e=>{if(e!==window.location.hash){e||(e=location.pathname);const t=GLOBAL_CONFIG_SITE.title;window.history.replaceState({url:location.href,title:t},t,e)}},changeThemeColor:function(e){null!==themeColorMeta&&themeColorMeta.setAttribute("content",e)},initThemeColor:function(){let e=getComputedStyle(document.documentElement).getPropertyValue("--bieyinan-bar-background").trim().replace('"',"").replace('"',"");if((window.scrollY||document.documentElement.scrollTop)>56){if(bieyinan.is_Post()&&(e=getComputedStyle(document.documentElement).getPropertyValue("--bieyinan-meta-theme-post-color").trim().replace('"',"").replace('"',"")),themeColorMeta.getAttribute("content")===e)return;this.changeThemeColor(e)}else{if(themeColorMeta.getAttribute("content")===e)return;this.changeThemeColor(e)}},switchDarkMode:()=>{const e="dark"===document.documentElement.getAttribute("data-theme")?"dark":"light",t=document.getElementById("rightMenu");"light"===e?(activateDarkMode(),saveToLocal.set("theme","dark",2),void 0!==GLOBAL_CONFIG.Snackbar&&bieyinan.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night),t.querySelector(".menu-darkmode-text").textContent="浅色模式"):(activateLightMode(),saveToLocal.set("theme","light",2),void 0!==GLOBAL_CONFIG.Snackbar&&bieyinan.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day),t.querySelector(".menu-darkmode-text").textContent="深色模式"),"function"==typeof runMermaid&&window.runMermaid(),rm&&rm.hideRightMenu(),bieyinan.darkModeStatus()},is_Post:function(){return window.location.href.indexOf("/posts/")>=0},addNavBackgroundInit:function(){var e=0,t=0;document.body&&(e=document.body.scrollTop),document.documentElement&&(t=document.documentElement.scrollTop),0!=(e-t>0?e:t)&&(pageHeaderEl.classList.add("nav-fixed"),pageHeaderEl.classList.add("nav-visible"))},downloadImage:function(e,t){rm.hideRightMenu(),0==rm.downloadimging?(rm.downloadimging=!0,bieyinan.snackbarShow("正在下载中，请稍后",!1,1e4),setTimeout((function(){let n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){let e=document.createElement("canvas");e.width=n.width,e.height=n.height,e.getContext("2d").drawImage(n,0,0,n.width,n.height);let o=e.toDataURL("image/png"),i=document.createElement("a"),a=new MouseEvent("click");i.download=t||"photo",i.href=o,i.dispatchEvent(a)},n.src=e,bieyinan.snackbarShow("图片已添加盲水印，请遵守版权协议"),rm.downloadimging=!1}),"10000")):bieyinan.snackbarShow("有正在进行中的下载，请稍后再试")},stopImgRightDrag:function(){for(var e=document.getElementsByTagName("img"),t=0;t<e.length;t++)e[t].addEventListener("dragstart",(function(){return!1}))},scrollTo:function(e){var t=document.querySelector(e).offsetTop;window.scrollTo(0,t-80)},hideAsideBtn:()=>{const e=document.documentElement.classList;e.contains("hide-aside")?saveToLocal.set("aside-status","show",2):saveToLocal.set("aside-status","hide",2),e.toggle("hide-aside"),e.contains("hide-aside")?document.querySelector("#consoleHideAside").classList.add("on"):document.querySelector("#consoleHideAside").classList.remove("on")},switchCommentBarrage:function(){let e=document.querySelector(".comment-barrage");e&&("flex"===window.getComputedStyle(e).display?(e.style.display="none",bieyinan.snackbarShow("✨ 已关闭评论弹幕"),document.querySelector(".menu-commentBarrage-text").textContent="显示热评",document.querySelector("#consoleCommentBarrage").classList.remove("on"),localStorage.setItem("commentBarrageSwitch","false")):(e.style.display="flex",document.querySelector(".menu-commentBarrage-text").textContent="关闭热评",document.querySelector("#consoleCommentBarrage").classList.add("on"),bieyinan.snackbarShow("✨ 已开启评论弹幕"),localStorage.removeItem("commentBarrageSwitch"))),rm.hideRightMenu()},initPaginationObserver:()=>{const e=document.getElementById("post-comment"),t=document.getElementById("pagination");e&&t&&new IntersectionObserver((e=>{const n=document.querySelector(".comment-barrage");e.forEach((e=>{e.isIntersecting?(t.classList.add("show-window"),n&&(n.style.bottom="-200px")):(t.classList.remove("show-window"),n&&(n.style.bottom="0px"))}))})).observe(e)},initIndexEssay:function(){document.querySelector("#bbTimeList")&&setTimeout((()=>{let e=new Swiper(".essay_bar_swiper_container",{passiveListeners:!0,direction:"vertical",loop:!0,autoplay:{disableOnInteraction:!0,delay:5e3},mousewheel:!0}),t=document.getElementById("bbtalk");null!==t&&(t.onmouseenter=function(){e.autoplay.stop()},t.onmouseleave=function(){e.autoplay.start()})}),100)},scrollByMouseWheel:function(e,t){e.addEventListener("mousewheel",(function(t){e.scrollLeft-=t.wheelDelta/2,t.preventDefault()}),{passive:!1}),t&&(t.classList.add("select"),t.style.order="-1",e.scrollLeft=t.offsetLeft-e.offsetLeft-(e.offsetWidth-t.offsetWidth)/2)},catalogActive:function(){const e=document.getElementById("catalog-list");if(e){const t=document.getElementById(decodeURIComponent(window.location.pathname));bieyinan.scrollByMouseWheel(e,t)}},tagsPageActive:function(){const e=document.getElementById("tag-page-tags");if(e){const t=document.getElementById(decodeURIComponent(window.location.pathname));bieyinan.scrollByMouseWheel(e,t)}},diffDate:function(e,t=!1){const n=new Date,o=new Date(e),i=n.getTime()-o.getTime(),a=36e5,s=24*a;let c;if(t){const e=i/s,t=i/a,n=i/6e4;c=i/(30*s)>=1?o.toLocaleDateString().replace(/\//g,"-"):e>=1?parseInt(e)+" "+GLOBAL_CONFIG.dateSuffix.day:t>=1?parseInt(t)+" "+GLOBAL_CONFIG.dateSuffix.hour:n>=1?parseInt(n)+" "+GLOBAL_CONFIG.dateSuffix.min:GLOBAL_CONFIG.dateSuffix.just}else c=parseInt(i/s);return c},changeTimeInEssay:function(){document.querySelector("#bber")&&document.querySelectorAll("#bber time").forEach((function(e){var t=e,n=t.getAttribute("datetime");t.innerText=bieyinan.diffDate(n,!0),t.style.display="inline"}))},changeTimeInAlbumDetail:function(){document.querySelector("#album_detail")&&document.querySelectorAll("#album_detail time").forEach((function(e){var t=e,n=t.getAttribute("datetime");t.innerText=bieyinan.diffDate(n,!0),t.style.display="inline"}))},reflashEssayWaterFall:function(){document.querySelector("#waterfall")&&setTimeout((function(){waterfall("#waterfall"),document.getElementById("waterfall").classList.add("show")}),800)},sayhi:function(){const e=document.getElementById("author-info__sayhi");"小伙伴"!=nick&&""!=nick&&(nick=JSON.parse(localStorage.getItem("twikoo")).nick);var t,n;e&&(e.innerHTML=(t=(new Date).getHours(),n="",0<=t&&t<=5?n="要早点休息哦，"+nick:5<t&&t<=10?n="好久不见，"+nick:10<t&&t<=14?n="欢迎再次回来，"+nick:14<t&&t<=18?n="下午好，"+nick:18<t&&t<=24&&(n="晚上好啊，"+nick),n))},addFriendLink(e){var t=document.getElementsByClassName("el-textarea__inner")[0];if(!t)return;let n=document.createEvent("HTMLEvents");n.initEvent("input",!0,!0),t.value=e?"```yml\n- name:\n  link: \n  avatar:\n  descr: \n  siteshot:\n```":"昵称（请勿包含博客等字样）：\n网站地址（要求博客地址，请勿提交个人主页）：\n头像图片url（请提供尽可能清晰的图片，我会上传到我自己的图床）：\n描述：\n站点截图（可选）：\n",t.dispatchEvent(n),t.focus(),t.setSelectionRange(-1,-1)},travelling(){var e=GLOBAL_CONFIG.friends_vue_info.apiurl+"randomfriend";fetch(e).then((e=>e.json())).then((e=>{var t=e.name,n=e.link;Snackbar.show({text:"点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「"+t+"」",duration:8e3,pos:"top-center",actionText:"前往",onActionClick:function(e){e.style.opacity=0,window.open(n,"_blank")}})}))},musicToggle:function(e=!0){bieyinan_musicFirst||(bieyinan.musicBindEvent(),bieyinan_musicFirst=!0);bieyinan_musicPlaying?(navMusicEl.classList.remove("playing"),document.getElementById("menu-music-toggle").innerHTML='<i class="bi bi-play-fill"></i><span>播放音乐</span>',document.getElementById("nav-music-hoverTips").innerHTML="音乐已暂停",document.querySelector("#consoleMusic").classList.remove("on"),bieyinan_musicPlaying=!1,navMusicEl.classList.remove("stretch")):(navMusicEl.classList.add("playing"),document.getElementById("menu-music-toggle").innerHTML='<i class="bi bi-pause-fill"></i><span>暂停音乐</span>',document.querySelector("#consoleMusic").classList.add("on"),bieyinan_musicPlaying=!0,navMusicEl.classList.add("stretch")),e&&document.querySelector("meting-js").aplayer.toggle(),rm.hideRightMenu()},musicTelescopic:function(){navMusicEl.classList.contains("stretch")?navMusicEl.classList.remove("stretch"):navMusicEl.classList.add("stretch")},musicSkipBack:function(){navMusicEl.querySelector("meting-js").aplayer.skipBack(),rm.hideRightMenu()},musicSkipForward:function(){navMusicEl.querySelector("meting-js").aplayer.skipForward(),navMusicEl.classList.add("playing"),rm.hideRightMenu()},musicGetName:function(){for(var e=$(".aplayer-title"),t=[],n=e.length-1;n>=0;n--)t[n]=e[n].innerText;return t[0]},darkModeStatus:function(){"light"==("dark"===document.documentElement.getAttribute("data-theme")?"dark":"light")?(document.getElementsByClassName("menu-darkmode-text").innerText="深色模式",document.querySelector("#selfie")&&(document.querySelector("#selfie").src="https://bu.dusays.com/2023/06/23/64959b78666b9.jpg")):(document.getElementsByClassName("menu-darkmode-text").innerText="浅色模式",document.querySelector("#selfie")&&(document.querySelector("#selfie").src="https://bu.dusays.com/2023/08/07/64d109ee3e865.webp"))},initConsoleState:function(){document.documentElement.classList.contains("hide-aside")?document.querySelector("#consoleHideAside").classList.add("on"):document.querySelector("#consoleHideAside").classList.remove("on")},rewardShowConsole:function(){consoleEl.classList.add("reward-show"),bieyinan.initConsoleState()},showConsole:function(){document.querySelector("#console").classList.add("show"),bieyinan.initConsoleState()},hideConsole:function(){consoleEl.classList.contains("show")?consoleEl.classList.remove("show"):consoleEl.classList.contains("reward-show")&&consoleEl.classList.remove("reward-show")},hideLoading:function(){document.getElementById("loading-box").classList.add("loaded")},cacheAndPlayMusic(){let e=localStorage.getItem("musicData");if(e){e=JSON.parse(e);if((new Date).getTime()-e.timestamp<864e5)return void bieyinan.playMusic(e.songs)}fetch("/json/music2.json").then((e=>e.json())).then((e=>{const t={timestamp:(new Date).getTime(),songs:e};localStorage.setItem("musicData",JSON.stringify(t)),bieyinan.playMusic(e)}))},playMusic(e){const t=document.getElementById("anMusic-page").querySelector("meting-js").aplayer,n=e[Math.floor(Math.random()*e.length)],o=t.list.audios;if(selectRandomSong.includes(n.name)){let i=!1;for(;!i;){const n=e[Math.floor(Math.random()*e.length)];if(selectRandomSong.includes(n.name)||(t.list.add([n]),t.list.switch(o.length),selectRandomSong.push(n.name),i=!0),selectRandomSong.length===e.length)break}if(!i){const e=o.findIndex((e=>e.name===n.name));-1!=e&&t.list.switch(e)}}else t.list.add([n]),t.list.switch(o.length),selectRandomSong.push(n.name);console.info("已随机歌曲：",selectRandomSong,"本次随机歌曲：",n.name)},changeMusicBg:function(e=!0){const t=document.getElementById("an_music_bg");if(e){const e=document.querySelector("#anMusic-page .aplayer-pic");t.style.backgroundImage=e.style.backgroundImage}else{let e=setInterval((()=>{document.querySelector("#anMusic-page .aplayer-pic")&&(clearInterval(e),bieyinan.addEventListenerMusic(),bieyinan.changeMusicBg(),document.querySelector("#nav-music meting-js").aplayer&&!document.querySelector("#nav-music meting-js").aplayer.audio.paused&&bieyinan.musicToggle())}),100)}},lrcUpdate(){const e=document.querySelector(".aplayer-lrc-contents"),t=e.querySelector("p.aplayer-lrc-current");if(t){const n=Array.from(e.children).indexOf(t);e.style.transform=`translateY(${40*-n}px)`}},getCustomPlayList:function(){if(!window.location.pathname.startsWith("/music/"))return;const e=new URLSearchParams(window.location.search),t=document.getElementById("anMusic-page-meting");if(e.get("id")&&e.get("server")){const n=e.get("id"),o=e.get("server");t.innerHTML=`<meting-js id="${n}" server=${o} type="playlist" type="playlist" mutex="true" preload="auto" theme="var(--bieyinan-main)" order="list" list-max-height="calc(100vh - 169px)!important"></meting-js>`}else t.innerHTML='<meting-js id="8106091931" server="netease" type="playlist" mutex="true" preload="auto" theme="var(--bieyinan-main)" order="list" list-max-height="calc(100vh - 169px)!important"></meting-js>';bieyinan.changeMusicBg(!1)},hideTodayCard:function(){if(document.getElementById("todayCard")){document.getElementById("todayCard").classList.add("hide");document.querySelector(".topGroup").querySelectorAll(".recent-post-item").forEach((e=>{e.style.display="flex"}))}},addEventListenerMusic:function(){const e=document.getElementById("anMusic-page"),t=e.querySelector(".aplayer-info .aplayer-time .aplayer-icon-menu"),n=e.querySelector("#anMusicBtnGetSong"),o=e.querySelector("#anMusicRefreshBtn"),i=e.querySelector("#anMusicSwitching"),a=e.querySelector("meting-js").aplayer;a.volume(.8,!0),a.on("loadeddata",(function(){bieyinan.changeMusicBg()})),a.on("timeupdate",(function(){bieyinan.lrcUpdate()})),t.addEventListener("click",(function(){document.getElementById("menu-mask").style.display="block",document.getElementById("menu-mask").style.animation="0.5s ease 0s 1 normal none running to_show",e.querySelector(".aplayer.aplayer-withlist .aplayer-list").style.opacity="1"})),document.getElementById("menu-mask").addEventListener("click",(function t(){"/music/"==window.location.pathname?e.querySelector(".aplayer-list").classList.remove("aplayer-list-hide"):document.getElementById("menu-mask").removeEventListener("click",t)})),n.addEventListener("click",(()=>{if(changeMusicListFlag){const e=document.getElementById("anMusic-page").querySelector("meting-js").aplayer,t=e.list.audios,n=Math.floor(Math.random()*t.length);e.list.switch(n)}else bieyinan.cacheAndPlayMusic()})),o.addEventListener("click",(()=>{localStorage.removeItem("musicData"),bieyinan.snackbarShow("已移除相关缓存歌曲")})),i.addEventListener("click",(()=>{bieyinan.changeMusicList()})),document.addEventListener("keydown",(function(e){"Space"===e.code&&(e.preventDefault(),a.toggle()),39===e.keyCode&&(e.preventDefault(),a.skipForward()),37===e.keyCode&&(e.preventDefault(),a.skipBack()),38===e.keyCode&&musicVolume<=1&&(musicVolume+=.1,a.volume(musicVolume,!0)),40===e.keyCode&&musicVolume>=0&&(musicVolume+=-.1,a.volume(musicVolume,!0))}))},changeMusicList:async function(){const e=document.getElementById("anMusic-page").querySelector("meting-js").aplayer,t=(new Date).getTime(),n=JSON.parse(localStorage.getItem("musicData"))||{timestamp:0};let o=[];if(changeMusicListFlag)o=defaultPlayMusicList;else if(defaultPlayMusicList=e.list.audios,t-n.timestamp<864e5)o=n.songs;else{const e=await fetch("/json/music2.json");o=await e.json(),n.timestamp=t,n.songs=o,localStorage.setItem("musicData",JSON.stringify(n))}e.list.clear(),e.list.add(o),changeMusicListFlag=!changeMusicListFlag},changeMusicList2:async function(e){const t=document.getElementById("nav-music").querySelector("meting-js").aplayer,n=(new Date).getTime(),o=JSON.parse(localStorage.getItem("musicData"))||{timestamp:0};var i=[];if(0==e){const e=await fetch("https://mtapibt.lazyingman.cn/?server=netease&type=playlist&id=8106091931");i=await e.json()}if(1==e){const e=await fetch("/json/music.json");i=await e.json()}if(2==e)if(n-o.timestamp<864e5)i=o.songs;else{const e=await fetch("/json/music2.json");i=await e.json(),o.timestamp=n,o.songs=i,localStorage.setItem("musicData",JSON.stringify(o))}if(3==e){const e=await fetch("/json/dz.json");i=await e.json()}navMusicEl.classList.add("stretch"),t.list.clear(),t.list.add(i),t.play(),changeMusicListFlag=!changeMusicListFlag},addEventListenerConsoleMusicList:function(){const e=document.getElementById("nav-music");e&&e.addEventListener("click",(t=>{const n=e.querySelector(".aplayer-list"),o=e.querySelector("div.aplayer-info > div.aplayer-controller > div.aplayer-time.aplayer-time-narrow > button.aplayer-icon.aplayer-icon-menu svg");t.target!=o&&n.classList.contains("aplayer-list-hide")&&n.classList.remove("aplayer-list-hide")}))},toPage:function(){var e=document.getElementById("toPageText"),t=document.getElementById("toPageButton"),n=document.querySelectorAll(".page-number"),o=Number(n[n.length-1].innerHTML),i=Number(e.value);if(!isNaN(i)&&i>=1&&Number.isInteger(i)){var a="/page/"+(i>o?o:i)+"/";t.href=1===i?"/":a}else t.href="javascript:void(0);"},removeBodyPaceClass:function(){document.body.className="pace-done"},setValueToBodyType:function(){const e=document.getElementById("page-type").value;document.body.dataset.type=e},addRandomCommentInfo:function(){const e=`${adjectives[Math.floor(Math.random()*adjectives.length)]}${vegetablesAndFruits[Math.floor(Math.random()*vegetablesAndFruits.length)]}`;!function(){for(var t=["#author","input[name='comname']","#inpName","input[name='author']","#ds-dialog-name","#name","input[name='nick']","#comment_author"],n=["#mail","#email","input[name='commail']","#inpEmail","input[name='email']","#ds-dialog-email","input[name='mail']","#comment_email"],o=0;o<t.length;o++){var i=document.querySelector(t[o]);if(null!=i){i.value=e,i.dispatchEvent(new Event("input")),i.dispatchEvent(new Event("change"));break}}for(var a=0;a<n.length;a++){var s=document.querySelector(n[a]);if(null!=s){s.dispatchEvent(new Event("input")),s.dispatchEvent(new Event("change"));break}}}();var t=document.getElementsByClassName("el-textarea__inner")[0];t.focus(),t.setSelectionRange(-1,-1)},totraveling:function(){bieyinan.snackbarShow("即将跳转到「开往」项目的成员博客，不保证跳转网站的安全性和可用性",(e=>{e.style.opacity=0,travellingsTimer&&clearTimeout(travellingsTimer)}),5e3,"取消"),travellingsTimer=setTimeout((function(){window.open("https://www.travellings.cn/go.html")}),"5000")},replaceAll:function(e,t,n){return e.split(t).join(n)},musicBindEvent:function(){document.querySelector("#nav-music .aplayer-music").addEventListener("click",(function(){bieyinan.musicTelescopic()})),document.querySelector("#nav-music .aplayer-button").addEventListener("click",(function(){bieyinan.musicToggle(!1)}))},hasMobile:function(){let e=!1;return(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)||document.body.clientWidth<800)&&(e=!0),e},qrcodeCreate:function(){if(document.getElementById("qrcode")){document.getElementById("qrcode").innerHTML="";new QRCode(document.getElementById("qrcode"),{text:window.location.href,width:250,height:250,colorDark:"#000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H})}},isInViewPortOfOne:function(e){if(!e)return;if("none"==window.getComputedStyle(e).getPropertyValue("display"))return;const t=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;return e.offsetTop-document.documentElement.scrollTop<=t},addRewardMask:function(){document.querySelector(".reward-main")&&(document.querySelector(".reward-main").style.display="flex",document.querySelector(".reward-main").style.zIndex="102",document.getElementById("quit-box").style.display="flex")},removeRewardMask:function(){document.querySelector(".reward-main")&&(document.querySelector(".reward-main").style.display="none",document.getElementById("quit-box").style.display="none")},keyboardToggle:function(){const e=bieyinan_keyboard;if(e){document.querySelector("#consoleKeyboard").classList.remove("on"),bieyinan_keyboard=!1}else{document.querySelector("#consoleKeyboard").classList.add("on"),bieyinan_keyboard=!0}localStorage.setItem("keyboardToggle",e?"false":"true")},rightMenuToggle:function(){window.oncontextmenu?window.oncontextmenu=null:!window.oncontextmenu&&oncontextmenuFunction&&(window.oncontextmenu=oncontextmenuFunction)},FPSToggle:function(){const e=bieyinan_FPS,t=document.querySelector("#fps-group"),n=document.querySelectorAll("#consoleFPS");e?(t.classList.remove("show"),n[0].classList.remove("on"),n[1].classList.remove("on"),bieyinan_FPS=!1,void 0!==GLOBAL_CONFIG.Snackbar&&bieyinan.snackbarShow("已为你关闭FPS")):(t.classList.add("show"),n[0].classList.add("on"),n[1].classList.add("on"),bieyinan_FPS=!0,void 0!==GLOBAL_CONFIG.Snackbar&&bieyinan.snackbarShow("已为你开启FPS")),localStorage.setItem("FPSToggle",e?"false":"true")},intersectionObserver:function(e,t){let n;return()=>(n?n.disconnect():n=new IntersectionObserver((n=>{n.forEach((n=>{n.intersectionRatio>0?e?.():t?.()}))})),n)},scrollCategoryBarToRight:function(){const e=document.getElementById("catalog-list"),t=document.getElementById("category-bar-next");if(e&&t){const n=e.clientWidth;e.scrollLeft+e.clientWidth+1>=e.scrollWidth?(e.scroll({left:0,behavior:"smooth"}),t.innerHTML='<i class="bieyinanfont bieyinan-icon-angle-double-right"></i>'):e.scrollBy({left:n,behavior:"smooth"})}else console.error("Element(s) not found: 'catalog-list' and/or 'category-bar-next'.")},categoriesBarActive:function(){const e=decodeURIComponent(window.location.pathname),t=document.getElementById("category-bar");if(t)if("/"===e)t.querySelector("#首页").classList.add("select");else{if(!/\/categories\/.*?\//.test(e))return;const n=e.split("/")[2];t.querySelector(`#${n}`).classList.add("select")}},topCategoriesBarScroll:function(){const e=document.getElementById("category-bar-items");e&&e.addEventListener("mousewheel",(function(e){const t=-e.wheelDelta/2;this.scrollLeft+=t,e.preventDefault()}))},switchRightClickMenuHotReview:function(){const e=document.getElementById("post-comment"),t=document.getElementById("menu-commentBarrage");t.style.display=e?"flex":"none"},enterFullscreen:function(e){e.requestFullscreen?e.requestFullscreen():e.msRequestFullscreen?e.msRequestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():shine.noFullscreenSupport(),shine.is_mobile()&&window.screen.orientation.lock("landscape-primary")},changeSayHelloText:function(){const e=GLOBAL_CONFIG.authorStatus.skills,t=document.getElementById("author-info__sayhi");let n=t.textContent,o=n;for(;o===n;)o=e[Math.floor(Math.random()*e.length)];t.textContent=o}},bieyinanPopupManager={queue:[],processing:!1,Jump:!1,enqueuePopup(e,t,n,o=3e3){this.queue.push({title:e,tip:t,url:n,duration:o}),this.processing||this.processQueue()},processQueue(){if(this.queue.length>0&&!this.processing){this.processing=!0;const{title:e,tip:t,url:n,duration:o}=this.queue.shift();this.popupShow(e,t,n,o)}},popupShow(e,t,n,o){const i=document.getElementById("popup-window");if(!i)return;const a=i.querySelector(".popup-window-title"),s=i.querySelector(".popup-window-content").querySelector(".popup-tip");i.classList.contains("show-popup-window")&&i.classList.add("popup-hide"),setTimeout((()=>{i.removeEventListener("click",this.clickEventHandler),n?(window.pjax?(this.clickEventHandler=e=>{e.preventDefault(),pjax.loadUrl(n),i.classList.remove("show-popup-window"),i.classList.remove("popup-hide"),this.Jump=!0,this.processing=!1,this.processQueue()},i.addEventListener("click",this.clickEventHandler)):(this.clickEventHandler=()=>{window.location.href=n},i.addEventListener("click",this.clickEventHandler)),i.classList.contains("no-url")&&i.classList.remove("no-url")):(i.classList.contains("no-url")||i.classList.add("no-url"),this.clickEventHandler=()=>{i.classList.add("popup-hide"),setTimeout((()=>{i.classList.remove("popup-hide"),i.classList.remove("show-popup-window")}),1e3)},i.addEventListener("click",this.clickEventHandler)),i.classList.contains("popup-hide")&&i.classList.remove("popup-hide"),i.classList.add("show-popup-window"),a.textContent=e,s.textContent=t}),800),setTimeout((()=>{n&&!this.Jump&&(this.Jump=!1),i.classList.contains("popup-hide")||""==i.className||i.classList.add("popup-hide"),this.processing=!1,this.processQueue()}),o)}};