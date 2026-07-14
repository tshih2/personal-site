// 全站共用「大塊內容隨捲動位置淡入/淡出」的 GSAP ScrollTrigger +
// scrub 機制,目前有兩處套用,邏輯是同一套(pin 住 + scrub 綁定一個
// timeline)、只是 timeline 內容不同,不是各自寫一份:
//
// 1. Hero 大字(#heroText,TIM SHIH / 文案輪播)——使用者往下捲動、
//    離開 Hero 視窗範圍時用 opacity 漸層淡出,不是直接被捲出畫面
//    消失不見。用 ScrollTrigger 把整個 <header> 在額外一個視窗高度的
//    捲動距離內 pin 住(固定在畫面上),期間只對 #heroText 做
//    opacity 1→0 的 scrub 動畫。上方 utility bar、左下角版本號跟
//    右下角日期時鐘、背景跑馬燈,全部是 header 的其他子元素,跟著
//    整個 header 一起被 pin 住、原地不動,不受這個 opacity 動畫影響,
//    不需要額外用 position:fixed/sticky 或自己計算釋放時機——
//    ScrollTrigger 的 pin 機制本身就會處理好版面空間的保留(用
//    pin-spacer 佔位)跟結束後的釋放。
//
// 2. About 區塊(#about)——跟 Hero 同一套 pin 機制,但這裡是三段式
//    交叉淡出淡入 + 一段版面位移/重新編排,不是單純淡出:
//    a. #aboutWordmarkLayer(TIM SHIH)淡出,同一段時間姓名/電話/email
//       三個元素(#aboutTopRowName/Phone/Email)各自用自己的 x/y tween
//       移動到 #aboutSocialLinks(社群按鈕列)正上方——這不是整排一起
//       搬過去,而是排版邏輯本身跟著重新編排:Hero 那種橫向三欄(姓名
//       靠左、電話置中、email 靠右分散在兩端)在落地時變成「姓名一行、
//       電話+email 緊鄰同一行、整體靠左堆疊」(Figma 稿的版面邏輯),
//       所以電話要從畫面中間往左移、email 要從畫面右側往左移,姓名
//       只需要往下移,三者的位移量都不一樣,不能共用同一個 tween。
//       落點座標是量測 #aboutTopRowTarget(resumeContent 裡一個永遠
//       opacity:0、純粹用來占版面 + 提供落點座標的隱藏範本)裡對應
//       元素的位置,不是寫死的數字。整體效果是讓 About 讀起來像
//       「姓名/聯絡資訊 → 社群按鈕 → Resume 手風琴」一個完整有層次的
//       版面,不是「頂部資訊列固定、下面內容各自淡入」兩層互不相干的
//       感覺。
//    b. #resumeContent(Experience / Creative Experience 手風琴本尊,
//       不是預覽複製品)淡入、取代 TIM SHIH 原本佔據的視覺區域
//    c. #aboutFooterLayer(版權列)緊接著淡入——這一層版面位置本來就
//       固定在 #about 的 flex-col 最下面(不是疊在 wordmark/resume
//       同一塊區域,是正常文件流的最後一行),一開始 autoAlpha:0,
//       不需要額外捲動就「已經在畫面上」,只是透明度從 0 到 1。
//    淡出淡入的部分都用 autoAlpha(而不是單純 opacity)——GSAP 官方
//    建議用 autoAlpha 做淡出淡入,opacity 到 0 時會自動加上
//    visibility:hidden,避免 resumeContent 手風琴按鈕/footer 連結
//    淡出後「看不到但還點得到/還能被 tab 到」。整段淡出淡入 + 位移
//    都發生在同一個 pin 住、頁面沒有真的在捲動的區間內,pin 結束的
//    瞬間全部都已經定格(不會有「捲完 Resume 後又要再捲一段才看到
//    Footer」的位移感)——這個區塊是全站最後一個區塊,pin 解除後就是
//    頁面底部,不需要接到任何後續內容,也因此不需要再另外處理
//    「Resume 進出視窗淡入淡出」或「跟下一個區塊背景銜接」這類問題,
//    通通在 pin 內一次做完。背景(圓點網格 + 跑馬燈)是這整個 pin 住的
//    #about 本身的其他子元素,原地不動、不參與這段交叉淡出淡入,
//    不需要額外處理。
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const header = document.querySelector('header');
  const heroText = document.getElementById('heroText');
  const aboutSection = document.getElementById('about');
  const aboutWordmarkLayer = document.getElementById('aboutWordmarkLayer');
  const resumeContent = document.getElementById('resumeContent');
  const aboutFooterLayer = document.getElementById('aboutFooterLayer');
  const aboutMarqueeField = document.getElementById('aboutMarqueeField');
  const aboutTopRow = document.getElementById('aboutTopRow');
  const aboutSocialLinks = document.getElementById('aboutSocialLinks');
  const aboutTopRowTarget = document.getElementById('aboutTopRowTarget');
  // 姓名/電話/email 三個「會移動」的來源元素,跟它們各自在
  // #aboutTopRowTarget 隱藏範本裡對應的落點元素——一一配對,不是共用
  // 同一組座標。
  const travelPairs = [
    { from: document.getElementById('aboutTopRowName'), to: document.getElementById('aboutTopRowTargetName') },
    { from: document.getElementById('aboutTopRowPhone'), to: document.getElementById('aboutTopRowTargetPhone') },
    { from: document.getElementById('aboutTopRowEmail'), to: document.getElementById('aboutTopRowTargetEmail') },
  ].filter((pair) => pair.from && pair.to);
  const aboutReady = aboutSection && aboutWordmarkLayer && resumeContent && aboutFooterLayer;
  if ((!header || !heroText) && !aboutReady) return;

  // 量測某個「來源元素」現在的位置,跟它要移動過去的「落點元素」
  // (#aboutTopRowTarget 隱藏範本裡的對應元素)之間差多少像素——用
  // 實際量測而不是猜一個固定數字,字級/斷點 clamp() 一變,寫死的 px
  // 值就會對不準。量測前先把來源元素的 x/y 重設回 0(記住量測當下
  // 原本的值,量完再還原),避免「量測當下剛好是動畫進行到一半、
  // 已經有位移」時,量出來的差值疊加了舊的位移量,越量越偏。
  function computeDelta(fromEl, toEl) {
    const prevX = gsap.getProperty(fromEl, 'x');
    const prevY = gsap.getProperty(fromEl, 'y');
    gsap.set(fromEl, { x: 0, y: 0 });
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    gsap.set(fromEl, { x: prevX, y: prevY });
    return { x: toRect.left - fromRect.left, y: toRect.top - fromRect.top };
  }

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];

    if (header && heroText) {
      const heroTween = gsap.to(heroText, { opacity: 0, ease: 'none' });
      const heroSt = ScrollTrigger.create({
        trigger: header,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: true,
        animation: heroTween,
      });
      cleanups.push(() => {
        heroSt.kill();
        gsap.set(heroText, { opacity: 1 });
      });
    }

    if (aboutReady) {
      // resumeContent 一開始就蓋在 wordmark 上面(absolute inset-0),
      // aboutFooterLayer 雖然不疊在同一塊區域,但也要在還沒捲到 pin
      // 區間時就先收起來——這兩個初始狀態必須用 gsap.set 立即套用,
      // 不能只靠 scrub timeline 的第一個影格(那要等 ScrollTrigger 真正
      // render 過一次才會生效,時機上會慢半拍)。
      gsap.set(resumeContent, { autoAlpha: 0 });
      gsap.set(aboutFooterLayer, { autoAlpha: 0 });

      // 三段式 timeline,scrub 直接對應到 pin 區間的捲動進度(不是時間):
      // 0%–38%:TIM SHIH 淡出
      // 27%–65%:Resume 淡入(從 27% 開始,刻意跟 wordmark 的淡出重疊
      //          11%,做出真正的交叉淡出淡入,不是「淡完才開始淡入」
      //          的生硬切換)——同一段時間內背景跑馬燈(#aboutMarqueeField)
      //          的容器 opacity 也跟著調降到 0.5,讓 Resume 文字範圍內的
      //          跑馬燈可讀性提升。這裡刻意animate「跑馬燈容器」的
      //          opacity,不是動 #about 本身的 .dot-grid-dark 圓點背景
      //          ——圓點背景是 CSS 直接畫在 #about 這個最外層 section
      //          上的背景圖,跟跑馬燈是兩個獨立圖層,不會被這個 tween
      //          影響到,整個 About 區塊(wordmark/resume/footer 三個
      //          階段)看到的圓點背景透明度全程一致。跑馬燈容器
      //          opacity 0.5 疊乘在每條軌道自己原本的 inline opacity
      //          (0.1–0.2)上,等於實際渲染出來大約是 0.05–0.1,對應
      //          先前討論過的「方案 b」範圍。
      // 55%–100%:Footer 淡入(從 55% 開始,同樣跟 Resume 的淡入重疊
      //          10%),結束剛好落在 timeline 終點。
      // 刻意不加任何「淡入完成後維持定格」的額外 hold 段——timeline
      // 總長度由最後一個 tween(footer 淡入,結束在 duration 座標
      // 0.55+0.45=1.0)決定,GSAP scrub 會把這個 1.0 對應到 pin 的 end
      // 那一個捲動位置,等於「footer 淡入完成」跟「pin 解除」是同一個
      // 時間點——這是先前 Resume↔Footer 之間出現「多餘捲動距離」問題
      // 的根本修法(拿掉多餘 hold),這次把 Footer 併進同一個 timeline
      // 沿用同一個做法,不要重蹈覆轍。
      const aboutTl = gsap
        .timeline()
        .to(aboutWordmarkLayer, { autoAlpha: 0, ease: 'none', duration: 0.38 }, 0)
        .to(resumeContent, { autoAlpha: 1, ease: 'none', duration: 0.38 }, 0.27)
        .to(aboutFooterLayer, { autoAlpha: 1, ease: 'none', duration: 0.45 }, 0.55);

      if (aboutMarqueeField) {
        aboutTl.to(aboutMarqueeField, { opacity: 0.5, ease: 'none', duration: 0.38 }, 0.27);
      }

      // 姓名/電話/email 跟 wordmark 淡出走同一段時間(0–38%),每個
      // 各自用自己的 x/y 移動到 #aboutTopRowTarget 裡對應元素的位置。
      // 用函式(而不是量一次寫死的數字)當 tween 的目標值,搭配下面
      // ScrollTrigger 的 invalidateOnRefresh,視窗尺寸改變、版面跟著
      // 變動時,GSAP 會在下一次 refresh 重新呼叫這個函式拿新的距離,
      // 不會停留在舊尺寸量出來的錯誤位移量。
      travelPairs.forEach(({ from, to }) => {
        aboutTl.to(
          from,
          {
            x: () => computeDelta(from, to).x,
            y: () => computeDelta(from, to).y,
            ease: 'none',
            duration: 0.38,
          },
          0
        );
      });

      // pin 區間抓 150vh——比原本兩段式的 110vh 更長,因為現在塞了
      // 三段交叉淡出淡入,要維持「跟之前一樣自然、不倉促」的節奏,
      // 區間要跟著多出來的內容量按比例拉長,不是照抄原本的數字。
      const aboutSt = ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        animation: aboutTl,
        invalidateOnRefresh: true,
      });

      cleanups.push(() => {
        aboutSt.kill();
        gsap.set(aboutWordmarkLayer, { autoAlpha: 1 });
        gsap.set(resumeContent, { autoAlpha: 1 });
        gsap.set(aboutFooterLayer, { autoAlpha: 1 });
        if (aboutMarqueeField) gsap.set(aboutMarqueeField, { opacity: 1 });
        travelPairs.forEach(({ from }) => gsap.set(from, { x: 0, y: 0 }));
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  });

  // 減少動態偏好時完全不 pin、不做交叉淡出淡入——但 resumeContent 預設
  // 就是 absolute inset-0 疊在 wordmark 上面,aboutFooterLayer 預設是
  // autoAlpha:0(見上面),如果什麼都不做,沒有動畫可以把它們「淡入
  // 顯示」,會變成 Resume 永遠疊在 wordmark 上擋住它、Footer 永遠隱形
  // 兩邊都看不到。改成把 wordmark/resume 兩層轉回正常文件流(position:
  // relative,不再疊在同一塊區域),footer 層直接設回完全顯示,三塊
  // 內容依序排列,使用者用一般捲動依序看到,不需要任何 pin 或 opacity
  // 動畫。用 gsap.set 而不是直接改 classList,是因為 matchMedia 只會
  // 自動 revert 用 GSAP 設過的 inline style,這樣切換動態偏好設定時
  // 才不會留下沒清乾淨的殘留樣式。
  mm.add('(prefers-reduced-motion: reduce)', () => {
    if (aboutReady) {
      gsap.set(aboutWordmarkLayer, { position: 'relative', inset: 'auto', minHeight: '100vh' });
      gsap.set(resumeContent, { position: 'relative', inset: 'auto', autoAlpha: 1 });
      gsap.set(aboutFooterLayer, { autoAlpha: 1 });
      // 姓名/電話/email 在這個 fallback 版面裡本來就該留在最上方原本
      // 的橫向三欄排版,不用位移過去疊在社群按鈕上——保險起見明確
      // 歸零,避免切換動態偏好設定時殘留上一輪的位移值。
      travelPairs.forEach(({ from }) => gsap.set(from, { x: 0, y: 0 }));
      // #aboutTopRowTarget 只是給動畫版本量落點座標 + 佔版面空間用的
      // 隱藏範本,這個 fallback 版面裡姓名/電話/email 根本不會搬過來,
      // 不需要它預留的那塊空間,收掉 margin/高度,不然 resumeContent
      // 裡會多出一段莫名其妙的空白,擠開下面的社群按鈕列。
      if (aboutTopRowTarget) gsap.set(aboutTopRowTarget, { marginBottom: 0, height: 0, overflow: 'hidden' });
    }
  });
})();
