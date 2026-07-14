// 通用的「跟目標區塊進不進入視窗連動」淡入/淡出邏輯——用
// data-reveal-on 屬性指定要觀察的目標區塊(CSS selector),元素進入
// 該區塊可視範圍時顯示、離開時隱藏;加上 data-reveal-invert 可以反過來
// (進入目標區塊時反而隱藏,適合「捲到下一個區塊就該收起來」的提示
// 元件,例如 hero 的往下滑動提示)。加 data-reveal-translate 會一併
// 切換 translate-y-0/translate-y-2 做輕微位移;加 data-reveal-pointer-events
// 會一併切換 pointer-events-auto/none,避免隱藏狀態下still可以被點到。
// 跟任何頁面專屬的動畫邏輯(例如 hero-glitch.js)完全獨立,不管是底部
// 浮動 nav 還是任何提示 icon,只要加上這組 data 屬性就能重複使用同一套
// IntersectionObserver,不需要各自另外寫一份。
(function () {
  function initRevealOnScroll(el) {
    const targetSelector = el.dataset.revealOn;
    const targetEl = targetSelector ? document.querySelector(targetSelector) : null;
    if (!targetEl) return;

    const invert = el.dataset.revealInvert !== undefined;
    const hasTranslate = el.dataset.revealTranslate !== undefined;
    const hasPointerEvents = el.dataset.revealPointerEvents !== undefined;

    const setVisible = (intersecting) => {
      const show = invert ? !intersecting : intersecting;
      el.classList.toggle('opacity-100', show);
      el.classList.toggle('opacity-0', !show);
      if (hasTranslate) {
        el.classList.toggle('translate-y-0', show);
        el.classList.toggle('translate-y-2', !show);
      }
      if (hasPointerEvents) {
        el.classList.toggle('pointer-events-auto', show);
        el.classList.toggle('pointer-events-none', !show);
      }
    };

    // threshold 用一個極小的正值(不是預設的 0)——hero 目前是
    // min-h-screen(剛好 100vh),Work 區塊緊接在 hero 正下方,兩者的
    // 邊界在頁面剛載入、還沒捲動時會「剛好」貼齊視窗底部邊緣(零重疊
    // 的 touching 狀態)。threshold=0 在這種零重疊但邊緣貼齊的邊界情況
    // 下,Chromium 仍可能回報 isIntersecting=true(已用 Playwright 實測
    // 到:頁面一載入、完全還沒捲動,Work 就被判定成「已進入視窗」,
    // 導致 scroll-hint 一開始就被誤判成該淡出)。要求至少 0.1% 的實際
    // 重疊面積才算「進入」,才能正確排除這種邊緣貼齊但沒有真正重疊的
    // 情況。
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setVisible(entry.isIntersecting));
      },
      { threshold: 0.001 }
    );
    observer.observe(targetEl);
  }

  document.querySelectorAll('[data-reveal-on]').forEach(initRevealOnScroll);
})();
