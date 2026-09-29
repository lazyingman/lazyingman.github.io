(function () {
  /** @brief 按需查询访问者 IP；请求独立执行，离开页面时取消。 */
  async function getIpInfo() {
    window.AbortIpInfo?.();
    const Names = ['Ip', 'Country', 'Prov', 'City', 'ISP'];
    const Nodes = Names.map(Name => document.getElementById('userAgent' + Name));
    const Device = document.getElementById('userAgentDevice');
    if (Device) Device.textContent = navigator.userAgent;
    if (!Nodes[0]) return;
    const Controller = new AbortController();
    let Cancelled = false;
    const Cancel = () => { Cancelled = true; Controller.abort(); };
    window.AbortIpInfo = Cancel;
    document.addEventListener('pjax:send', Cancel, { once: true });
    window.addEventListener('pagehide', Cancel, { once: true });
    const Timer = setTimeout(() => Controller.abort(), 8000);
    const Display = Values => Nodes.forEach((Node, Index) => {
      if (Node?.isConnected) Node.textContent = Values[Index] || '暂无数据';
    });
    Display(Names.map(() => '正在获取…'));
    try {
      const Response = await fetch('https://ipwho.is/', { signal: Controller.signal });
      if (!Response.ok) throw new Error('HTTP ' + Response.status);
      const Data = await Response.json();
      if (Data.success !== true || typeof Data.ip !== 'string' || !Data.ip) {
        throw new Error('IP 接口返回无效数据');
      }
      if (!Cancelled) Display([Data.ip, Data.country, Data.region, Data.city, Data.connection?.isp]);
    } catch (Error) {
      if (!Cancelled) {
        Display(Names.map(() => '暂时无法获取'));
        console.warn('IP 信息获取失败：', Error.message);
      }
    } finally {
      clearTimeout(Timer);
      document.removeEventListener('pjax:send', Cancel);
      window.removeEventListener('pagehide', Cancel);
      if (window.AbortIpInfo === Cancel) delete window.AbortIpInfo;
    }
  }

  /** @brief 创建唯一 FPS 计数器；关闭、隐藏或 PJAX 切换期间停止采样。 */
  function InitFPS() {
    if (!window.BieyinanFPS) {
      let Frame = null, Last = null, Count = 0, Node = null, Navigating = false;
      const Stop = () => {
        if (Frame !== null) cancelAnimationFrame(Frame);
        Frame = null;
        Last = null;
        Count = 0;
        Node = null;
      };
      const Tick = Time => {
        Frame = null;
        if (!bieyinan_FPS || document.hidden || Navigating || !Node?.isConnected) {
          Stop();
          return;
        }
        if (Last === null) Last = Time;
        else {
          Count++;
          const Elapsed = Time - Last;
          if (Elapsed >= 1000) {
            Node.textContent = String(Math.round(Count * 1000 / Elapsed));
            Last = Time;
            Count = 0;
          }
        }
        Frame = requestAnimationFrame(Tick);
      };
      const Refresh = () => {
        const Current = document.getElementById('fps');
        if (!bieyinan_FPS || document.hidden || Navigating || !Current) {
          Stop();
          return;
        }
        if (Frame !== null && Current === Node) return;
        Stop();
        Node = Current;
        Node.textContent = '—';
        Frame = requestAnimationFrame(Tick);
      };
      window.BieyinanFPS = { Refresh, Stop };
      document.addEventListener('visibilitychange', Refresh);
      document.addEventListener('pjax:send', () => { Navigating = true; Stop(); });
      document.addEventListener('pjax:complete', () => { Navigating = false; bieyinan.SyncFPS(); });
      window.addEventListener('pagehide', Stop);
      window.addEventListener('pageshow', () => { Navigating = false; bieyinan.SyncFPS(); });
    }
    bieyinan.SyncFPS();
  }

  void getIpInfo();
  InitFPS();

  /**
   * @brief 绑定首页图片水平拖动，防止重复绑定并在 PJAX 离开时清理。
   * @param {HTMLElement|null} Target 图片元素。
   */
  function InitImageDrag(Target) {
    if (!Target || Target.HorizontalDragBound) return;
    const Parent = Target.offsetParent || Target.parentElement;
    if (!Parent) return;
    Target.HorizontalDragBound = true;
    const Controller = new AbortController();
    const Options = { signal: Controller.signal };
    let PointerId = null, StartX = 0, StartOffset = 0;
    let Offset = 0, Minimum = 0, Maximum = 0, Frame = 0;
    const StorageKey = 'con-animals-position';
    let Position = null;
    try {
      const Saved = localStorage.getItem(StorageKey);
      const Value = Saved === null || Saved.trim() === '' ? NaN : Number(Saved);
      if (Number.isFinite(Value) && Value >= 0 && Value <= 1) Position = Value;
    } catch (_) { /* 存储被禁用时仍允许正常拖动。 */ }

    // 移动过程中仅写 transform，一帧只提交一次，不读取布局。
    const Render = () => {
      Frame = 0;
      if (Target.isConnected) Target.style.transform = 'translate3d(' + Offset + 'px, 0, 0)';
    };
    const Move = Event => {
      if (Event.pointerId !== PointerId) return;
      Offset = Math.max(Minimum, Math.min(Maximum, StartOffset + Event.clientX - StartX));
      if (!Frame) Frame = requestAnimationFrame(Render);
    };
    const Finish = () => {
      const PreviousId = PointerId;
      PointerId = null;
      // 仅结束拖动时写存储，保存可移动范围内的比例，适应不同窗口宽度。
      if (PreviousId !== null && Maximum > Minimum && Target.offsetParent) {
        Position = (Offset - Minimum) / (Maximum - Minimum);
        try {
          localStorage.setItem(StorageKey, String(Position));
        } catch (_) { /* 存储不可用时保留本次页面中的位置。 */ }
      }
      cancelAnimationFrame(Frame);
      Render();
      Target.style.willChange = '';
      if (PreviousId !== null && Target.hasPointerCapture(PreviousId)) {
        Target.releasePointerCapture(PreviousId);
      }
    };
    // offsetLeft 与 offsetParent.clientWidth 使用相同坐标系。
    const Measure = () => {
      if (!Target.offsetParent) return;
      Minimum = -Target.offsetLeft;
      Maximum = Math.max(Minimum, Parent.clientWidth - Target.offsetWidth - Target.offsetLeft);
      if (Position !== null) Offset = Minimum + Position * (Maximum - Minimum);
      Offset = Math.max(Minimum, Math.min(Maximum, Offset));
    };
    Target.addEventListener('pointerdown', Event => {
      if (!Event.isPrimary || Event.button !== 0 || PointerId !== null) return;
      Measure();
      PointerId = Event.pointerId;
      StartX = Event.clientX;
      StartOffset = Offset;
      Target.setPointerCapture(PointerId);
      Target.style.willChange = 'transform';
      Event.preventDefault();
    }, Options);
    Target.addEventListener('pointermove', Move, Options);
    Target.addEventListener('pointerup', Event => {
      if (Event.pointerId !== PointerId) return;
      Move(Event); // 提交松手位置，避免最后一帧位移丢失。
      Finish();
    }, Options);
    for (const Type of ['pointercancel', 'lostpointercapture']) {
      Target.addEventListener(Type, Event => {
        if (Event.pointerId === PointerId) Finish();
      }, Options);
    }
    Target.addEventListener('dragstart', Event => Event.preventDefault(), Options);
    window.addEventListener('blur', Finish, Options);
    window.addEventListener('pagehide', Finish, Options);
    Measure();
    Render();
    // 容器缩放或图片加载完成后更新边界，不在 pointermove 中测量。
    const Observer = new ResizeObserver(() => {
      Finish();
      Measure();
      Render();
    });
    Observer.observe(Parent);
    Observer.observe(Target);
    document.addEventListener('pjax:send', () => {
      Finish();
      Observer.disconnect();
      Controller.abort();
      Target.HorizontalDragBound = false;
      Target.style.transform = '';
    }, { ...Options, once: true });
  }

  if (window.location.pathname === '/' || /^\/page\/[^/]+\/?$/.test(window.location.pathname)) {
    InitImageDrag(document.getElementById('con-animals'));
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
