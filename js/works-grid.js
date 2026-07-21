/*
 * 首頁 [ ALL WORKS ] / [ BLOG ] 分頁切換。
 *
 * WORKS 跟 BLOG 是同一個 grid 容器的兩種資料來源,不是路由跳轉——點擊
 * 底部 nav 的 WORKS/BLOG 只是原地換資料 + 換標題文字 + 換網址 hash
 * (用 history.pushState,不會觸發真正的頁面導覽/reload),概念上比照
 * Instagram 個人主頁貼文/珍藏分頁切換的體驗,不是切到另一個 .html。
 *
 * 用法:
 *   <script src="data/data-works.js"></script>
 *   <script src="data/data-blog.js"></script>
 *   <script src="js/works-grid.js"></script>
 *   <script>
 *     initWorksGrid({
 *       gridSelector: '#worksGrid',
 *       headerSelector: '#worksHeader',
 *       defaultTab: 'works',
 *       tabs: {
 *         works: { label: 'ALL WORKS', items: WORKS_DATA },
 *         blog: { label: 'BLOG', items: BLOG_DATA },
 *       },
 *     });
 *   </script>
 *
 * 導覽列對應的連結加 data-tab-link="<tab key>"(見 index.html 的
 * WORKS/BLOG 連結),由這裡統一攔截 click、換內容,不需要在 HTML
 * 端另外寫邏輯。HOME/ABOUT 不屬於這套機制,維持各自原本的行為。
 */

// 單張卡片——樣式完全沿用既有 All Works 卡片慣例(bg-card 色塊、
// rounded-xl 容器 + rounded 縮圖、hover 微放大 + 圖片變暗疊層),
// WORKS/BLOG 兩種資料共用同一份卡片樣板,不是各自客製一份。沒有
// thumbnail 時就不渲染 <img>,色塊本身當佔位框,跟原本「還沒有素材」
// 的卡片視覺一致,不會報錯或留白。
function buildWorkCard(item) {
  const image = item.thumbnail
    ? `<img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-contain">`
    : '';
  return `
    <a href="${item.href || '#'}" class="group relative block cursor-pointer">
      <div class="bg-card rounded-xl p-[clamp(1rem,3vw,2.5rem)] transition-transform duration-300 ease-out group-hover:scale-[1.02]">
        <div class="relative aspect-[4/3] rounded overflow-hidden bg-card">
          ${image}
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300"></div>
        </div>
        <div class="mt-3 flex items-center justify-between font-geist text-xs">
          <span class="font-geistmono text-ink">${item.title}</span>
          <span class="text-muted">${item.category}</span>
        </div>
      </div>
    </a>
  `;
}

function initWorksGrid({ gridSelector, headerSelector, tabs, defaultTab }) {
  const grid = document.querySelector(gridSelector);
  const header = document.querySelector(headerSelector);
  if (!grid || !header) return;

  // 淡出淡入用 GSAP autoAlpha(全站淡出淡入一律用這個,不是單純
  // opacity),時長 300ms——沿用這個頁面卡片 hover(duration-300)、
  // 底部 nav 淡入淡出(transition duration-300)已經定案的節奏,不是
  // 另外挑一個新數字。
  const FADE_DURATION = 0.3;

  let currentTab = null;

  function applyTab(key) {
    const tab = tabs[key];
    header.textContent = `[ ${tab.label} ]`;
    grid.innerHTML = tab.items.map(buildWorkCard).join('\n');
    currentTab = key;
  }

  function setTab(key, { pushHistory = true } = {}) {
    if (!tabs[key]) key = defaultTab;
    if (key === currentTab) return;

    if (currentTab === null) {
      // 第一次渲染,還沒有舊內容可以淡出,直接淡入就好。
      applyTab(key);
      gsap.fromTo(grid, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE_DURATION });
    } else {
      gsap.to(grid, {
        autoAlpha: 0,
        duration: FADE_DURATION,
        onComplete: () => {
          applyTab(key);
          gsap.to(grid, { autoAlpha: 1, duration: FADE_DURATION });
        },
      });
    }

    if (pushHistory) {
      const url = key === defaultTab
        ? location.pathname + location.search
        : `${location.pathname}${location.search}#${key}`;
      history.pushState({ tab: key }, '', url);
    }
  }

  // 導覽列 WORKS/BLOG 連結——攔截預設的錨點跳轉,原地換資料,不觸發
  // 真正的頁面導覽/reload。點完順便捲回 #works 容器:使用者點了
  // WORKS/BLOG 是想看到對應內容,如果人還停留在頁面其他區塊(例如
  // About),內容換了但畫面沒捲過去,等於看不到剛剛切換的結果。
  document.querySelectorAll('[data-tab-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setTab(link.getAttribute('data-tab-link'));
      const worksSection = document.getElementById('works');
      if (worksSection) worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 瀏覽器上一頁/下一頁——網址 hash 既然代表分頁狀態,原生的上一頁/
  // 下一頁導覽也要跟著換資料,不然網址列顯示的分頁會跟畫面對不起來。
  window.addEventListener('popstate', () => {
    const key = (location.hash || '').replace('#', '') || defaultTab;
    setTab(key, { pushHistory: false });
  });

  // 初始載入:網址帶 #blog 這種分頁 hash 時,重新整理或分享連結進來
  // 要直接停在對應分頁,不是每次都重置回預設的 WORKS。
  const initialKey = (location.hash || '').replace('#', '') || defaultTab;
  setTab(initialKey, { pushHistory: false });
}
