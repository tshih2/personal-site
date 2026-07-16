// 全站共用「大塊內容隨捲動位置淡入/淡出」的 GSAP ScrollTrigger +
// scrub 機制,目前有兩處套用,邏輯是同一套(pin 住 + scrub 綁定一個
// timeline)、只是 timeline 內容不同,不是各自寫一份:
//
// 1. Hero 大字(#heroText,TIM SHIH / 文案輪播)——使用者往下捲動、
//    離開 Hero 視窗範圍時用 opacity 漸層淡出,不是直接被捲出畫面
//    消失不見。用 ScrollTrigger 把整個 <header> 在額外一段捲動距離內
//    pin 住(固定在畫面上),期間對 #heroText 做 opacity 1→0 的 scrub
//    動畫,同一條 timeline 裡跟 #worksPreviewLayer(All Works 進場
//    預覽,見下方說明)的淡入做時間重疊的交叉淡出淡入——跟 About 區塊
//    wordmark→resume 是同一個 pattern。上方 utility bar、左下角版本號
//    跟右下角日期時鐘、背景跑馬燈,全部是 header 的其他子元素,跟著
//    整個 header 一起被 pin 住、原地不動,不受這個 opacity 動畫影響,
//    不需要額外用 position:fixed/sticky 或自己計算釋放時機——
//    ScrollTrigger 的 pin 機制本身就會處理好版面空間的保留(用
//    pin-spacer 佔位)跟結束後的釋放。
//
//    `end` 這個額外捲動距離不能照抄「一個視窗高度」——GSAP 的
//    pin-spacer 保留的總高度是「pinned 元素自己的自然高度」加上
//    「這段額外的 end 距離」兩者相加,不是只算 end 本身。header 自己
//    已經是 min-h-screen(一個視窗高度),這代表一個數學上無法繞過的
//    限制:不管 end 抓多短,pin 解除的那個捲動位置,跟 #works 在文件流
//    裡真正的自然位置之間,永遠會差開「header 自己的高度」這麼多——
//    這個差值是常數,不受 end 影響。原本 `+=100%` 讓這個常數之外又
//    多疊加了一個視窗高度的純空白 padding-bottom(用 Playwright 量過
//    `.pin-spacer` 的 padding-bottom 精確等於 end 設的值),這是 Tim
//    反映「Hero 淡出後還要多捲一段才看到 All Works」的根本原因,先
//    收緊到 `+=20%` 消除了這一層多餘的疊加,但 header 自身高度那個
//    數學常數本身消不掉。
//
//    真正解掉「兩段式切換」觀感的做法,是不去跟這個數學常數對抗,而是
//    在 pin 住的這段時間內,讓 #worksPreviewLayer(All Works 的輕量
//    預覽——標籤 + 兩張複用 #works 本尊內容的卡片,不是全部 14 個
//    作品的完整複製品)跟 #heroText 疊在同一個舞台上做交叉淡出淡入,
//    讓使用者在 pin 住、頁面還沒真的捲動出新內容的這段時間,就已經
//    「看到」All Works 進場。
//
//    這裡踩過一個坑,值得記錄:第一版只做了「淡入」沒有做「淡出」——
//    worksPreviewLayer 淡入到 autoAlpha:1 之後,timeline 剩下的部分
//    什麼都不對它做,以為反正 pin 解除後 header 會滑走、預覽自然就
//    看不到了。但 scrub 動畫只在 ScrollTrigger 的 [start,end] 範圍內
//    生效,捲動位置一旦超過 end,animation 的進度永遠停在 1、不會
//    自動歸零。worksPreviewLayer 是 position:absolute 疊在 header
//    「舞台」裡的子元素,pin 解除後 header 恢復正常文件流、開始隨
//    捲動正常往上滑走時,worksPreviewLayer 會跟著 header 一起正常
//    滑走,但因為 autoAlpha 停在 1,它是完全不透明地滑走——使用者
//    體感上等於「多了一個要捲過去的區塊」,標籤/卡片內容看起來出現
//    了兩次(一次是滑走中的預覽、一次是後面真正的 #works)。修法是
//    在 timeline 尾段(0.75–1.0)明確把 worksPreviewLayer 淡出回
//    autoAlpha:0,確保 progress 到 1(也就是 pin 解除)的那一刻,它
//    已經完全不可見,pin 解除後 header 滑走時不會帶著任何殘影。
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
//       元素的位置,不是寫死的數字。
//
//       這組元素(#aboutTopRow)本身不能是 #resumeContent 的真實子
//       節點——試過這個方向,結果撞上一道無法繞過的牆:#resumeContent
//       是 overflow-y-auto(它的祖先「舞台」容器還多一層
//       overflow-hidden),任何被 transform 移到這兩層裁切範圍「外面」
//       (也就是 #aboutTopRow 原本的位置)的子元素,一律會被裁掉、完全
//       看不見——「本尊活在 resumeContent 裡、從外面飛進來」這個方向
//       在技術上走不通。所以本尊只能繼續活在 resumeContent 外面、
//       疊在上面,但這樣一來本尊跟 resumeContent 是兩個獨立的捲動
//       座標系:手機螢幕矮,resumeContent 內容常態性超出可視高度,
//       使用者滑動時瀏覽器 nested scroll chaining 會優先捲動
//       resumeContent 自己的內容(把 [ RESUME ] 標籤、EXPERIENCE 往上
//       推),但本尊的位置是另一個獨立算出來的 transform,不會跟著
//       一起動,兩個座標系一旦不同步,姓名/電話/email 就會浮在
//       [ RESUME ] / EXPERIENCE 上面蓋住它們——這是實際踩到的手機版
//       重疊 bug。修法不是硬把本尊塞進 resumeContent(會被裁切),而是
//       額外監聽 #resumeContent 的 scroll 事件,resumeContent 每捲動
//       多少,就同步把 #aboutTopRow 往反方向位移多少(見下面
//       `syncTopRowToResumeScroll`),讓兩個獨立的座標系保持視覺同步,
//       不需要真的共用同一個 DOM 節點。
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
  const worksPreviewLayer = document.getElementById('worksPreviewLayer');
  const aboutSection = document.getElementById('about');
  const aboutWordmarkLayer = document.getElementById('aboutWordmarkLayer');
  const resumeContent = document.getElementById('resumeContent');
  const aboutFooterLayer = document.getElementById('aboutFooterLayer');
  const aboutMarqueeField = document.getElementById('aboutMarqueeField');
  const aboutTopRow = document.getElementById('aboutTopRow');
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

  // About pin 的 ScrollTrigger 實例——建立時機在下面
  // matchMedia('(prefers-reduced-motion: no-preference)') 分支裡,提升
  //到這個外層作用域是為了讓 scrollToAboutLanded()(給底部 nav ABOUT
  // 連結用)可以讀到它的 `.end`(pin 結束、也就是 scrub 進度 100% 那個
  // scroll 位置的像素值)。matchMedia 停止匹配(例如切換
  // prefers-reduced-motion)時會歸零,避免拿到已經 kill 掉的殘留實例。
  let aboutSt = null;

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
      if (worksPreviewLayer) gsap.set(worksPreviewLayer, { autoAlpha: 0 });

      // 四段式 timeline,全部發生在同一個 pin 住、畫面不動的區間內:
      // 0–0.45:heroText 淡出
      // 0.30–0.50:worksPreviewLayer 淡入,故意跟 heroText 尾段重疊
      //           (0.30–0.45),製造「Hero 還沒完全消失、All Works 已經
      //           開始浮現」的交疊感,不是淡完才開始淡入的生硬切換。
      // 0.50–0.75:worksPreviewLayer 維持完全顯示(沒有 tween,自然
      //           停在 autoAlpha:1),讓使用者有足夠時間看清楚這個
      //           預覽,不是一閃而過。
      // 0.75–1.0:worksPreviewLayer 淡出,回到 autoAlpha:0——這一段是
      //           修正版新增的關鍵段落。之前的版本沒有這段,
      //           worksPreviewLayer 淡入到 1 之後就再也沒有任何 tween
      //           把它變回 0,而 scrub 動畫只在 [start,end] 範圍內
      //           生效,一旦捲動位置超過 end,它的 autoAlpha 就永遠
      //           停在最後算出來的值(1)不會自動歸零。這個 pin 解除
      //           後,header 恢復正常文件流、開始隨捲動正常往上滑走,
      //           但 worksPreviewLayer 是 header 內部 absolute
      //           定位的子元素,會跟著 header 一起正常滑走,卻仍然是
      //           完全不透明的——使用者體感上就是「多了一個要捲過去
      //           的區塊」,跟真正的 #works 重複出現同樣的標籤/卡片。
      //           在 pin 解除前(progress 到 1 之前)就先淡出歸零,
      //           確保 pin 一解除、header 開始正常滑走時,
      //           worksPreviewLayer 已經是 autoAlpha:0(opacity:0 +
      //           visibility:hidden),不會有任何殘影跟著滑走。
      const heroTl = gsap
        .timeline()
        .to(heroText, { opacity: 0, ease: 'none', duration: 0.45 }, 0);

      if (worksPreviewLayer) {
        heroTl
          .to(worksPreviewLayer, { autoAlpha: 1, ease: 'none', duration: 0.2 }, 0.3)
          .to(worksPreviewLayer, { autoAlpha: 0, ease: 'none', duration: 0.25 }, 0.75);
      }

      // pin 區間(+=45%)維持跟前一版一樣的長度——四段式 timeline 需要
      // 的總距離跟三段式(淡入沒有淡出)差不多,新增的「淡出」段只是
      // 把原本「淡入後什麼都不做」的尾段換成有動作的淡出,不需要額外
      // 拉長。
      const heroSt = ScrollTrigger.create({
        trigger: header,
        start: 'top top',
        end: '+=45%',
        pin: true,
        scrub: true,
        animation: heroTl,
      });
      cleanups.push(() => {
        heroSt.kill();
        gsap.set(heroText, { opacity: 1 });
        if (worksPreviewLayer) gsap.set(worksPreviewLayer, { autoAlpha: 0 });
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
      aboutSt = ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        animation: aboutTl,
        invalidateOnRefresh: true,
        // resumeContent.scrollTop 是瀏覽器原生狀態,不會因為這個區塊
        // 暫時離開可視範圍就自動歸零——使用者如果在上一次進入 pin 時
        // 把 resumeContent 內部捲動過(手機上很容易發生),離開再重新
        // 進入 pin 時,如果不主動歸零,#aboutTopRow 一開始就會帶著
        // 上一輪殘留的位移量,在 wordmark 都還沒開始淡出時就顯得莫名
        // 位移過。onLeave/onLeaveBack 涵蓋「往下捲出 pin」跟「往上捲
        // 出 pin」兩個方向,確保下一次重新進入永遠是乾淨的初始狀態。
        onLeave: () => { resumeContent.scrollTop = 0; },
        onLeaveBack: () => { resumeContent.scrollTop = 0; },
      });

      // 修正手機版重疊 bug 的關鍵一段:#aboutTopRow(姓名/電話/email
      // 本尊的容器)技術上不能真的活在 #resumeContent 裡面(見上面檔案
      // 開頭註解的完整說明——會被 overflow-y-auto/overflow-hidden 裁
      // 掉),只能繼續疊在它上面,靠這段監聽 #resumeContent 自己的原生
      // scroll 事件,把 resumeContent 目前捲動的距離,同步反向套用在
      // #aboutTopRow 這個容器上——resumeContent 往上捲 N px([ RESUME ]/
      // EXPERIENCE 跟著往上移 N px),#aboutTopRow 就額外往上位移
      // 同樣的 N px,兩個獨立的捲動座標系因此永遠保持視覺對齊,不會再
      // 出現姓名/電話/email 浮在 [ RESUME ]/EXPERIENCE 上面的重疊。
      // 這個 y 值套在容器本身(#aboutTopRow),跟套在姓名/電話/email
      // 各自身上的 scrub 位移 tween(上面的 travelPairs)是兩個不同的
      // 元素、互不衝突,不需要合併計算——容器的 y 平常是 0,只有
      // resumeContent 內部捲動時才會被這裡改動。用 `scrollTop` 直接
      // 算絕對值(不是累加相對值),每次都重新算一次目前的正確位移量,
      // 不會有累加誤差越飄越偏的風險。
      function syncTopRowToResumeScroll() {
        if (!aboutTopRow) return;
        gsap.set(aboutTopRow, { y: -resumeContent.scrollTop });
      }
      resumeContent.addEventListener('scroll', syncTopRowToResumeScroll);

      cleanups.push(() => {
        aboutSt.kill();
        aboutSt = null;
        resumeContent.removeEventListener('scroll', syncTopRowToResumeScroll);
        if (aboutTopRow) gsap.set(aboutTopRow, { y: 0 });
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
  // 兩邊都看不到。改成把 wordmark/resume 兩層轉回正常
  // 文件流(position: relative,不再疊在同一塊區域),footer 層直接設回
  // 完全顯示,三塊內容依序排列,使用者用一般捲動依序看到,不需要任何
  // pin 或 opacity 動畫。用 gsap.set 而不是直接改 classList,是因為
  // matchMedia 只會自動 revert 用 GSAP 設過的 inline style,這樣切換
  // 動態偏好設定時才不會留下沒清乾淨的殘留樣式。
  mm.add('(prefers-reduced-motion: reduce)', () => {
    // worksPreviewLayer 只是給有動畫的那個分支用的過場預覽,預設 CSS
    // 就是 opacity-0(見 index.html),這裡再明確 set 一次是保險——
    // 避免使用者中途切換 prefers-reduced-motion 設定時,殘留上一輪
    // no-preference 分支已經淡入到可見的狀態。reduced-motion 版面裡
    // #works 本尊本來就會用一般捲動自然顯示,不需要這層預覽。
    if (worksPreviewLayer) gsap.set(worksPreviewLayer, { autoAlpha: 0 });

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

  // 底部 nav 列的 ABOUT 連結——點擊直接跳到這個 pin 住區塊的「完成態」
  // (TIM SHIH 已淡出、Resume 內容可見),不是跳到 pin 剛開始的那個
  // 瞬間。做法不是「先跳到 pin 起點、再手動把 timeline 設成
  // progress:1」——這個 scrub:true 的 ScrollTrigger 每次捲動都會根據
  // 目前實際的捲動位置重新算 timeline 進度,如果只是手動設進度、捲動
  // 位置卻還停在 pin 起點,使用者只要再滑一點點,scrub 就會立刻把
  // 進度打回接近 0,完成態瞬間消失。真正要的是讓「捲動位置」本身就
  // 落在 pin 結束的那個像素值(aboutSt.end),這樣 scrub 算出來的進度
  // 自然就是 1,之後使用者從這裡正常往回捲,也會跟著 scrub 自然反向
  // 播放,不會有上面說的那種「瞬間跳回」問題。
  // reduced-motion 模式下沒有 pin/scrub(aboutSt 是 null),退回單純
  // scrollIntoView——那個模式的 Resume 內容本來就已經在正常文件流裡
  // 完整顯示,捲過去就是完成態,不需要額外處理。
  window.scrollToAboutLanded = function scrollToAboutLanded() {
    if (aboutSt) {
      window.scrollTo({ top: aboutSt.end, behavior: 'smooth' });
    } else if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navAboutLink = document.getElementById('navAboutLink');
  if (navAboutLink) {
    navAboutLink.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollToAboutLanded();
    });
  }
})();
