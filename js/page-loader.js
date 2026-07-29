/*
 * 全站共用的頁面載入動畫——「圓點網格脈動」,呼應 css/style.css 的
 * .dot-grid 裝飾背景視覺語言,但技術上是不同做法:.dot-grid 是純 CSS
 * background-image(不能逐點控制),這裡的每一顆圓點都是獨立生成的
 * DOM 節點,GSAP 才能對每一顆做位移/縮放的 stagger 動畫做出「脈動」
 * 效果。間距故意比裝飾用的 24px 更疏(見下面 DOT_SPACING),避免生成
 * 節點數量太多拖慢效能,視覺上仍讀作同一套語言,只是密度不同。
 *
 * 用法(三個共用殼——index.html / case-study.html / blog-post.html——
 * 都是同一套模式):
 *   1. <body> 最上面放一份固定的 overlay 標記:
 *        <div id="pageLoader" class="fixed inset-0 z-[9999] bg-cream
 *             flex items-center justify-center" aria-hidden="true">
 *          <div class="loader-dots"></div>
 *        </div>
 *   2. 載入 GSAP 之後、其他頁面邏輯之前呼叫:
 *        window.__pageLoader = initPageLoader();
 *      這會立刻鎖住捲動、生成圓點、開始脈動循環。
 *   3. 頁面自己的內容真正渲染完成後呼叫:
 *        window.__pageLoader.markReady();
 *      （index.html 是等 window load + 字型就緒;case-study.html /
 *      blog-post.html 是資料渲染完成 + 字型就緒——見各自檔案裡的呼叫。）
 *
 * markReady() 呼叫的時機不代表立刻隱藏——會再取「最短顯示時間」跟
 * 「內容真的就緒」兩者較晚的那個,避免載入太快時動畫一閃而過看起來像
 * 故障;同時有一個「最長等待時間」的保險,不管 markReady() 有沒有被
 * 呼叫到(例如某個資源意外卡住),到時間一定會強制隱藏,不會讓使用者
 * 卡在載入畫面出不去。
 *
 * prefers-reduced-motion:reduce 時跳過脈動循環跟位移類動畫,只保留
 * 最基本的淡入淡出,呼應全站其他動畫元件(見 CLAUDE.md「動態/響應式
 * 文字的溢出安全檢查」一節旁邊的 reduced-motion 慣例)。
 */
function initPageLoader(options = {}) {
  const overlay = document.getElementById('pageLoader');
  const dotsContainer = overlay ? overlay.querySelector('.loader-dots') : null;

  if (!overlay || !dotsContainer || typeof gsap === 'undefined') {
    return { markReady() {} };
  }

  const minDisplay = options.minDisplay ?? 500;
  const maxWait = options.maxWait ?? 4000;
  const DOT_SPACING = 48;

  document.documentElement.classList.add('loading-lock');

  const cols = Math.ceil(window.innerWidth / DOT_SPACING) + 1;
  const rows = Math.ceil(window.innerHeight / DOT_SPACING) + 1;
  dotsContainer.style.gridTemplateColumns = `repeat(${cols}, ${DOT_SPACING}px)`;
  dotsContainer.style.gridTemplateRows = `repeat(${rows}, ${DOT_SPACING}px)`;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < cols * rows; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'loader-dot';
    frag.appendChild(dot);
  }
  dotsContainer.appendChild(frag);
  const dots = dotsContainer.children;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let loopTween = null;

  if (reduceMotion) {
    gsap.set(dots, { opacity: 0.5, scale: 1 });
  } else {
    gsap.set(dots, { scale: 0.35, opacity: 0.25, transformOrigin: '50% 50%' });
    loopTween = gsap.to(dots, {
      scale: 1,
      opacity: 1,
      duration: 0.7,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.018, from: 'center', grid: [rows, cols] },
    });
  }

  let readyResolve;
  const readyPromise = new Promise((resolve) => { readyResolve = resolve; });
  const minDisplayPromise = new Promise((resolve) => setTimeout(resolve, minDisplay));
  const maxWaitPromise = new Promise((resolve) => setTimeout(resolve, maxWait));

  let hidden = false;
  function runHide() {
    if (hidden) return;
    hidden = true;
    document.documentElement.classList.remove('loading-lock');

    if (reduceMotion) {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power1.out',
        onComplete: () => { overlay.style.display = 'none'; },
      });
      return;
    }

    if (loopTween) loopTween.kill();
    gsap.timeline({ onComplete: () => { overlay.style.display = 'none'; } })
      .to(dots, {
        scale: 0.3,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        stagger: { each: 0.008, from: 'center', grid: [rows, cols] },
      })
      .to(overlay, { autoAlpha: 0, duration: 0.35, ease: 'power1.out' }, '-=0.2');
  }

  Promise.race([
    Promise.all([readyPromise, minDisplayPromise]),
    maxWaitPromise,
  ]).then(runHide);

  return {
    markReady() { readyResolve(); },
  };
}

window.initPageLoader = initPageLoader;
