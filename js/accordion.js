// 通用手風琴互動邏輯——GSAP 高度展開/收合 + 互斥展開(一次最多一個
// 開著,允許全部收合)。跟 js/case-study-template.js 的 initAccordions()
// 是同一套邏輯(DURATION/EASE/`.col-header`/`.toggle-icon` 慣例都
// 一致,不是另外發明一套展開/收合機制)——差別只在於
// case-study-template.js 的版本綁死在 case study 頁面自己的資料格式
// (data.sections)上,沒辦法直接套用在其他頁面的手風琴(例如首頁
// Resume 區塊)。這裡改成傳入一組 id 陣列,依照
// #accordionHeader-<id> / #accordionContent-<id> 的命名慣例去找對應
// 元素,新頁面只要遵循同樣的 id 命名慣例就能直接重複使用,不用各自
// 再寫一份。
function initAccordion(ids, options) {
  const DURATION = 0.5;
  const EASE = 'power2.inOut';
  const opts = options || {};

  const items = ids
    .map((id) => ({
      id,
      header: document.getElementById(`accordionHeader-${id}`),
      content: document.getElementById(`accordionContent-${id}`),
    }))
    .filter((item) => item.header && item.content);

  let openId = opts.defaultOpenId !== undefined ? opts.defaultOpenId : ids[0];

  // 手風琴展開/收合會改變 content 的實際高度,如果頁面上有
  // ScrollTrigger 綁在「隨捲動位置」的效果上(例如 Resume 區塊的
  // 淡入淡出,見 js/hero-scroll-fade.js),觸發範圍的 end 是算在
  // content 高度上的——GSAP 官方文件明確提醒:視窗 resize 會自動
  // 觸發 ScrollTrigger 重新計算,但「內容本身的版面變化」不會自動
  // 觸發,要手動呼叫 ScrollTrigger.refresh()。這裡用
  // typeof ScrollTrigger !== 'undefined' 判斷,沒載入 ScrollTrigger
  // 的頁面(例如 case study 頁)完全不受影響。
  function refreshScrollTriggerIfPresent() {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function setState(item, open) {
    const icon = item.header.querySelector('.toggle-icon');
    if (open) {
      gsap.to(item.content, { height: 'auto', duration: DURATION, ease: EASE, onComplete: refreshScrollTriggerIfPresent });
      if (icon) icon.textContent = '−';
    } else {
      gsap.to(item.content, { height: 0, duration: DURATION, ease: EASE, onComplete: refreshScrollTriggerIfPresent });
      if (icon) icon.textContent = '+';
    }
  }

  function open(id) {
    if (openId === id) {
      setState(items.find((i) => i.id === id), false);
      openId = null;
      return;
    }
    items.forEach((item) => {
      if (item.id === id) setState(item, true);
      else if (item.id === openId) setState(item, false);
    });
    openId = id;
  }

  items.forEach((item) => {
    item.header.addEventListener('click', () => open(item.id));
  });
}
