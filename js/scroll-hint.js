// 通用的「捲動提示箭頭」工廠函式——位移 + 閃爍兩層獨立 GSAP tween 疊加
// 在同一個箭頭 SVG 上:規律的透明度閃爍(提示但不搶眼)跟規律的輕微
// 位移(暗示捲動方向),duration 刻意錯開(1.4s vs 2s)避免完全同步顯得
// 太機械。方向用 `direction: 'down' | 'up'` 控制位移的正負(往下提示
// 箭頭往下偏移、往上提示箭頭往上偏移),不是另外寫一份鏡像邏輯。
// 點擊時呼叫 `onClick`(通常是 scrollIntoView 到目標區塊)。
// prefers-reduced-motion 時完全不跑位移/閃爍動畫,但點擊功能不受影響
// (捲動本身不是「動態效果」,是導覽功能)。
//
// 目前有兩處套用:
// 1. Hero 底部的往下箭頭(#scrollHint/#scrollHintArrow)——顯示/隱藏
//    邏輯委託給 js/scroll-reveal.js(離開 Hero 視窗範圍就淡出),這裡
//    只負責箭頭本身的位移/閃爍動畫跟點擊捲動。
// 2. About/Resume 區塊底部版權列的往上箭頭
//    (#aboutScrollTopHint/#aboutScrollTopHintArrow)——顯示/隱藏不需要
//    額外處理,直接繼承 #aboutFooterLayer 整列的 autoAlpha 淡入淡出
//    (見 js/hero-scroll-fade.js),不是自己另外接一個 IntersectionObserver。
function initScrollHint(buttonId, arrowId, options) {
  const button = document.getElementById(buttonId);
  const arrow = document.getElementById(arrowId);
  if (!button || !arrow) return;

  const opts = options || {};
  const direction = opts.direction || 'down';
  const bobDistance = direction === 'up' ? -5 : 5;

  if (typeof opts.onClick === 'function') {
    button.addEventListener('click', opts.onClick);
  }

  if (typeof gsap === 'undefined') return;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const bobTween = gsap.to(arrow, {
      y: bobDistance,
      duration: 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    const flickerTween = gsap.to(arrow, {
      opacity: 0.5,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      bobTween.kill();
      flickerTween.kill();
      gsap.set(arrow, { y: 0, opacity: 1 });
    };
  });
}
