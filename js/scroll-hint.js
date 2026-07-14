// Hero 區塊的「往下滑動」提示 icon(拿掉圓圈外框後,只剩箭頭本身)——
// 兩層獨立動畫同時疊加在同一個 #scrollHintArrow 元素上:規律的透明度
// 閃爍(提示但不搶眼)跟規律的上下輕微位移(暗示往下的方向感),duration
// 刻意錯開(1.4s vs 2s)避免完全同步顯得太機械。GSAP 分別用兩個獨立
// tween 控制 y/opacity 這兩個不同屬性,不會互相覆蓋;外層 #scrollHint
// 按鈕本身「進入 Work 區域後淡出」用的是 Tailwind opacity class(見
// js/scroll-reveal.js),套在不同元素上,也不會跟這裡的 GSAP opacity
// tween 衝突。
// 點擊時平滑捲動到「Hero 的下一個區塊」(Work)頂端——滾動敘事順序是
// Hero → All Works → About → Resume → Footer,提示往下捲動理當先帶到
// 緊接著的下一個區塊,不是跳過中間的區塊。這個行為不受
// prefers-reduced-motion 影響,一律正常運作。
(function () {
  const button = document.getElementById('scrollHint');
  const arrow = document.getElementById('scrollHintArrow');
  const target = document.getElementById('works');
  if (!button || !arrow || !target) return;

  button.addEventListener('click', () => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (typeof gsap === 'undefined') return;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const bobTween = gsap.to(arrow, {
      y: 5,
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
})();
