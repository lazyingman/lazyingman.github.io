import ColorThief from "./color-thief.mjs"

    var ap=null;
    Object.defineProperty(document.querySelector("meting-js"),"aplayer",{
        set:function(aplayer){
            ap=aplayer;
            setTheme(ap.list.index);
            ap.on('listswitch', (index) => {
                setTheme(index.index);
            });
        }
    })

    //根据封面颜色自适应主题颜色
    const colorThief = new ColorThief();
    const image = new Image();
    const xhr = new XMLHttpRequest();
    function setTheme(index) {
        if (!ap.options.audio[index].theme) {
            xhr.onload = function(){
                let coverUrl = URL.createObjectURL(this.response);
                image.onload = function(){
                    let color = colorThief.getColor(image);
                    ap.theme(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, index);
                    URL.revokeObjectURL(coverUrl)
                };
                image.src = coverUrl;
            }
            xhr.open('GET', ap.options.audio[index].cover, true);
            xhr.responseType = 'blob';
            xhr.send();
        }
    };

//添加播放事件
let heo_musicPlaying = false;

var heo={
  //切换音乐播放状态
  musicToggle: function() {
    let msgPlay = '<i class="bi bi-play-fill"></i></i><span>播放音乐</span>' // 此處可以更改為你想要顯示的文字
    let msgPause = '<i class="bi bi-pause-fill"></i></i><span>暂停音乐</span>' // 同上，但兩處均不建議更改
    if (heo_musicPlaying) {
      document.querySelector("#nav-music").classList.remove("playing");
      document.getElementById("menu-music-toggle").innerHTML = msgPlay;
    //   document.getElementById("nav-music-hoverTips").innerHTML = "音乐已暂停";
    //   document.querySelector("#nav-consoleMusic").classList.remove("on");
      heo_musicPlaying = false;
    }else {
      document.querySelector("#nav-music").classList.add("playing");
      document.getElementById("menu-music-toggle").innerHTML = msgPause;
    //   document.querySelector("#consoleMusic").classList.add("on");
      heo_musicPlaying = true;
    }
    ap.toggle();
  },
  //返回顶部
  scrollToDest: (pos, time) => {
    if (pos < 0 || time < 0) {
      return
    }

    const currentPos = window.scrollY || window.screenTop
    pos = pos - 70

    if ('CSS' in window && CSS.supports('scroll-behavior', 'smooth')) {
      window.scrollTo({
        top: pos,
        behavior: 'smooth'
      })
      return
    }

    let start = null
    time = time || 500
    window.requestAnimationFrame(function step (currentTime) {
      start = !start ? currentTime : start
      if (currentPos < pos) {
        const progress = currentTime - start
        window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos)
        if (progress < time) {
          window.requestAnimationFrame(step)
        } else {
          window.scrollTo(0, pos)
        }
      } else {
        const progress = currentTime - start
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time))
        if (progress < time) {
          window.requestAnimationFrame(step)
        } else {
          window.scrollTo(0, pos)
        }
      }
    })
  }
}

//jq
$(function(){
    //隐藏浏览器默认菜单
    $(document).contextmenu((e)=>{
        return false;
    })


    $(document).mousedown((event)=>{
        if(document.body.clientWidth > 768){
            // 尺寸
            let rmWidth = $('#rightMenu').width();
            let rmHeight = $('#rightMenu').height();

            // 重新定义尺寸
            var reloadrmSize = function(){
                rmWidth = $('#rightMenu').width();
                rmHeight = $('#rightMenu').height();
            }
            var key=event.which
            let pageX = event.clientX + 10;	//加10是为了防止显示时鼠标遮在菜单上
            let pageY = event.clientY;
            reloadrmSize()

            // 鼠标默认显示在鼠标右下方，当鼠标靠右或考下时，将菜单显示在鼠标左方\上方
            if(pageX + rmWidth > window.innerWidth){
                pageX -= rmWidth+20;
            }
            if(rmHeight*0.3 < pageY && pageY <window.innerHeight - rmHeight){
                pageY =pageY-40
            }
            if(pageY + rmHeight > window.innerHeight){
                // pageY -= pageY + rmHeight - window.innerHeight;
                pageY = window.innerHeight -rmHeight;
            }
            if(key==3){
                $("#rightMenu").show().css({left:pageX,top:pageY});
            } 
        }
    })

    //点击其他地方隐藏菜单
    $(document).click(()=>{
        $("#rightMenu").hide();
    })

    //后退页面
    $("#menu-backward").click(()=>{
        history.go(-1)
    })

    //前进页面
    $("#menu-forward").click(()=>{
        history.go(1)
    })

    // 刷新页面
    $("#menu-refresh").click(()=>{
        location.reload()
    })

    //置顶页面
    $("#menu-top").click(()=>{
        heo.scrollToDest(0,500)
    })

    //播放或暂停音乐
    $("#menu-music-toggle").click(()=>{
        heo.musicToggle();
    })

    $("#nav-music").click(()=>{
        heo.musicToggle();
    })

    //切换上一首音乐
    $("#menu-music-back").click(()=>{
        ap.skipBack();
    })
    
    //切换下一首音乐
    $("#menu-music-forward").click(()=>{
        ap.skipForward();
    })

    //复制歌名到剪切板
    $("#menu-music-copyMusicName").click(()=>{
        var x=$(".aplayer-title");
        var arr = []
		for (var i = x.length - 1; i >= 0; i--) {
			arr[i] = x[i].innerText
		}
        navigator.clipboard.writeText(arr[0])
    })
})




