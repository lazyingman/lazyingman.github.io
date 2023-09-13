(async function () {
    async function getIpInfo() {
        var fetchUrl = "https://api.qjqq.cn/api/Local";
        try {
            var response = await fetch(fetchUrl);
            var json = await response.json();

            var ip = json.ip;
            var country = json.data.country;
            var prov = json.data.prov;
            var city = json.data.city;
            // var district = json.data.district;
            var isp = json.data.isp;

            document.getElementById("userAgentIp").innerHTML = ip;
            // document.getElementById("userAgentState").innerHTML = continent;
            document.getElementById("userAgentCountry").innerHTML = country;
            document.getElementById("userAgentProv").innerHTML = prov;
            document.getElementById("userAgentCity").innerHTML = city;
            // document.getElementById("userAgentDistrict").innerHTML = district;
            document.getElementById("userAgentISP").innerHTML = isp;


            var uaInfo = navigator.userAgent;

            document.getElementById("userAgentDevice").innerHTML = uaInfo;
        } catch (error) {
            // console.error("An error occurred while fetching IP info:", error);
        }
    }

    await getIpInfo();
})();

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
    // let create_time = Math.round(new Date('2021-10-15 00:00:00').getTime() / 1000); //在此行修改建站时间
    // 有苹果用户发现safari浏览器不能正常运行，百度了一下发现是格式化的问题，改成下面这种应该就可以了。感谢反馈。
    let create_time = Math.round(new Date('2023/4/21 00:00:00').getTime() / 1000); //在此行修改建站时间
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

setInterval(function () {
    check();
}, 2000);
var check = function () {
    function doCheck(a) {
        if (('' + a / a)['length'] !== 1 || a % 20 === 0) {
            (function () { }['constructor']('debugger')());
        } else {
            (function () { }['constructor']('debugger')());
        }
        doCheck(++a);
    }
    try {
        doCheck(0);
    } catch (err) { }
};
check();