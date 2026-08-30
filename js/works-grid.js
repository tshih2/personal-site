/*
 * 首頁 [ ALL WORKS ] / [ BLOG ] / [ PLAY ] 分頁切換。
 *
 * WORKS/BLOG/PLAY 是同一個 grid 容器的三種資料來源,不是路由跳轉——
 * 點擊底部 nav 的 WORKS/BLOG/PLAY 只是原地換資料 + 換標題文字 + 換
 * 網址 hash(用 history.pushState,不會觸發真正的頁面導覽/reload),
 * 概念上比照 Instagram 個人主頁貼文/珍藏分頁切換的體驗,不是切到另一個
 * .html。
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
 *         blog: { label: 'BLOG', items: blogCards, numbered: true },
 *         play: { label: 'PLAY', items: PLAY_DATA },
 *       },
 *     });
 *   </script>
 *
 * tabs.<key>.items 是一個 { title, tags, href, thumbnail? } 陣列
 * ——跟 data-works.js 的 WORKS_DATA/PLAY_DATA 格式一樣,tags 是分類
 * 標籤陣列(至少一個)。Blog 卡片沿用舊的單一 category 欄位(借放日期),
 * buildWorkCard() 裡有 fallback,不強迫 Blog 也改成陣列。data-blog.js
 * 現在存的是完整文章內容(BLOG_POSTS,給 js/blog-post-template.js
 * 用),不是這種卡片形狀,所以 Blog 分頁的 items 是頁面自己(見
 * index.html)用 BLOG_POSTS.map() 現算出來的卡片清單,不是直接把
 * BLOG_POSTS 傳進來。
 *
 * tabs.<key>.numbered: true 時,卡片標題前面會加上兩位數流水號(01./
 * 02./...),編號直接對應 items 陣列目前的排列順序(index + 1 補零),
 * 不需要在資料裡手動寫死——目前只有 Blog 分頁在用。
 *
 * tabs.<key>.cropThumbnails: true 時,縮圖用 object-cover + object-center
 * 從中心點裁切填滿卡片容器(不管原圖是直式還是橫式,都裁成卡片的
 * aspect-[4/3]),不是 Works 卡片原本的 object-contain(完整顯示原圖
 * 比例,不裁切)。這是刻意的分歧,不是不一致:Works 縮圖通常是作品
 * 的截圖/Logo,裁切可能切掉重要內容,所以維持不裁切、可能留白;Blog
 * 封面是純攝影/情境照,裁切填滿才會有雜誌感的視覺效果,留白反而顯得
 * 廉價。目前只有 Blog 分頁在用。
 *
 * `item.thumbnail` 是 `.mp4`/`.mov`/`.webm` 副檔名時,卡片自動渲染
 * `<video muted loop playsinline>` 取代 `<img>`,不需要在資料裡另外
 * 宣告「這是影片」——副檔名已經夠明確,不用為了這個小功能把 thumbnail
 * 從字串改成 { type, src } 物件。互動邏輯依裝置有沒有 hover 能力分兩種
 * (wireHoverVideos()):有 hover 的裝置(滑鼠)是移進卡片播放、移開
 * 暫停;沒有 hover 的裝置(手機/平板觸控)改用 IntersectionObserver,
 * 卡片捲進視窗才播放、捲出視窗暫停——不能沿用桌面那套邏輯,因為
 * `mouseenter` 在觸控裝置上永遠不會觸發,縮圖會一直停在空白畫面。
 *
 * 導覽列對應的連結加 data-tab-link="<tab key>"(見 index.html 的
 * WORKS/BLOG 連結),由這裡統一攔截 click、換內容,不需要在 HTML
 * 端另外寫邏輯。HOME/ABOUT 不屬於這套機制,維持各自原本的行為。
 *
 * 點擊 WORKS/BLOG 時會把畫面精確捲動到 #works 頂部,搭配 index.html
 * 給 #works 的 min-h-screen(見該檔案),確保視窗不會同時看到上方
 * Hero 或下方 About 的殘留畫面——不管切到哪個分頁、卡片數量多寡。
 * 捲動時機刻意等內容真的換完才觸發(不是點擊當下立刻捲),理由見
 * setTab() 內的註解。內容切換也會連帶讓 #about 在文件裡的位置改變,
 * 所以每次 applyTab() 都會呼叫 ScrollTrigger.refresh(),讓
 * js/hero-scroll-fade.js 那個 pin 住 #about 的 ScrollTrigger 跟著更新。
 */

// thumbnail 路徑是不是影片檔——靠副檔名判斷,不需要在資料裡另外加
// 一個欄位宣告類型:thumbnail 目前刻意維持單純字串(不像 case study
// media 那樣是 { type, src } 物件),副檔名已經足夠明確分辨圖片跟
// 影片,不需要為了這個小功能改整個 schema。
function isVideoThumbnail(src) {
  return /\.(mp4|mov|webm)$/i.test(src);
}

// 單張卡片——樣式沿用既有 All Works 卡片慣例(bg-card 色塊、
// rounded-xl 容器 + rounded 縮圖、hover 微放大 + 圖片變暗疊層),
// WORKS/BLOG/PLAY 三種資料共用同一份卡片樣板,不是各自客製一份。沒有
// thumbnail 時就不渲染 <img>,色塊本身當佔位框,跟原本「還沒有素材」
// 的卡片視覺一致,不會報錯或留白。numberPrefix/cropThumbnail 只有
// tabs.numbered/cropThumbnails 開了的分頁才會傳(目前是 Blog),Works/
// Play 卡片維持原本沒有編號、object-contain 不裁切的樣子。
//
// thumbnail 是影片檔時,渲染 <video muted loop playsinline> 取代
// <img>,預設不播放(不加 autoplay)——hover 播放/移開暫停的互動由
// wireHoverVideos() 統一處理,不在這裡綁事件(這個函式只負責產生
// HTML 字串,還沒被插入 DOM,綁了也沒用)。muted 是瀏覽器允許 JS
// 呼叫 play() 的前提(未靜音的影片瀏覽器會擋自動播放,即使是使用者
// hover 觸發的);playsinline 避免手機版(主要是 iOS Safari)自動跳出
// 全螢幕播放器。
//
// item.tags 是陣列(WORKS/PLAY 用),item.category 是舊的單一分類字串
// (Blog 卡片用日期借放在這個欄位)——兩種資料格式並存,不強迫 Blog
// 也改成陣列,這裡統一 fallback 成單元素陣列處理,渲染邏輯只寫一份。
function buildWorkCard(item, numberPrefix, cropThumbnail) {
  const fitClass = cropThumbnail ? 'object-cover object-center' : 'object-contain';
  let media = '';
  if (item.thumbnail) {
    media = isVideoThumbnail(item.thumbnail)
      ? `<video src="${item.thumbnail}" class="w-full h-full ${fitClass}" muted loop playsinline data-hover-video></video>`
      : `<img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full ${fitClass}">`;
  }
  const titleText = numberPrefix ? `${numberPrefix} ${item.title}` : item.title;
  const tags = item.tags || (item.category ? [item.category] : []);
  const tagsHtml = tags
    .map((tag) => `<span class="font-geistmono text-[11px] sm:text-xs text-muted border border-black/15 rounded-full px-3 py-1">${tag}</span>`)
    .join('');
  // 卡片放大成大方展示版面(2026-08-26):標題自己獨立一行(line-clamp-2
  // 超過兩行截斷),標籤換到下面一整排、可以自然換行(flex-wrap)——
  // 不再是「標題+單一分類」同一排左右分佔的舊版面,因為現在每個作品
  // 有多個標籤,硬塞進同一排會把標題擠得更窄。
  //
  // 縮圖不再用內距把圖片跟卡片邊緣隔開(2026-08-26 拿掉原本
  // p-[clamp(1.25rem,3.5vw,3rem)] 那層「相框」留白)——Tim 要圖片滿版
  // 貼齊卡片邊緣,不要周圍那圈 bg-card 留白像裱框。原本外層「相框」
  // rounded-xl + 內層縮圖 rounded 兩層圓角,合併成單層容器直接套
  // rounded-xl,不再需要兩層 div。
  return `
    <a href="${item.href || '#'}" class="group relative block cursor-pointer">
      <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-card transition-transform duration-300 ease-out group-hover:scale-[1.01]">
        ${media}
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300"></div>
      </div>
      <div class="mt-4 sm:mt-5">
        <h3 class="font-geistmono text-sm sm:text-base text-ink line-clamp-2">${titleText}</h3>
        <div class="mt-3 flex flex-wrap gap-2">${tagsHtml}</div>
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
  let hoverVideoObserver = null;
  let cardRevealTriggers = [];
  const worksSection = document.getElementById('works');

  // 點擊 WORKS/BLOG 後把畫面精確捲動到 #works 頂部——#works 現在有
  // min-h-screen 保底(見 index.html),所以只要頂部對齊,不管切到哪個
  // 分頁,視窗都不會同時看到上方 Hero 或下方 About 的殘留背景。
  function scrollToWorksTop() {
    if (worksSection) worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 影片縮圖:滑鼠移進卡片播放、移開暫停(不重設回開頭,離開時停在
  // 哪就是哪,下次 hover 從那裡接著播)——每次 applyTab() 換內容後都要
  // 重新綁一次,因為卡片是整批用 innerHTML 重新產生的新 DOM 節點,
  // 舊的 event listener 不會留著。
  //
  // 觸控裝置(手機/平板)沒有 hover 這個概念,`mouseenter` 永遠不會被
  // 觸發——結果是縮圖在使用者點擊卡片離開頁面之前完全是空白的一片
  // (iOS Safari 對從沒播放過的 `<video>` 常常連第一影格都不解碼,不是
  // 單純「沒有動態效果」而已,是整個縮圖看不到)。用
  // `matchMedia('(hover: hover)')` 判斷裝置有沒有真正的 hover 能力,
  // 沒有的話改用 IntersectionObserver:卡片捲進視窗才播放、捲出視窗就
  // 暫停——不是一次把所有卡片的影片都自動播放,一次播放十支影片會浪費
  // 行動網路流量跟電量,而且大多數根本不在畫面上。`prefers-reduced-motion`
  // 時進一步收斂:只在捲進視窗的當下跳到一個極小的時間點解碼出單一
  // 影格讓縮圖不再空白,不自動循環播放。
  function wireHoverVideos() {
    const videos = grid.querySelectorAll('video[data-hover-video]');
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    if (hoverVideoObserver) {
      hoverVideoObserver.disconnect();
      hoverVideoObserver = null;
    }

    if (supportsHover) {
      videos.forEach((video) => {
        const card = video.closest('a');
        if (!card) return;
        card.addEventListener('mouseenter', () => video.play().catch(() => {}));
        card.addEventListener('mouseleave', () => video.pause());
      });
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showFirstFrame(video) {
      const seek = () => { video.currentTime = Math.min(0.1, video.duration || 0.1); };
      if (video.readyState >= 1) seek();
      else video.addEventListener('loadedmetadata', seek, { once: true });
    }

    hoverVideoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (reduceMotion) showFirstFrame(video);
          else video.play().catch(() => {});
        } else if (!reduceMotion) {
          video.pause();
        }
      });
    }, { threshold: 0.1 });

    videos.forEach((video) => hoverVideoObserver.observe(video));
  }

  // 卡片隨捲動進場:每次 applyTab() 換內容後重新綁一次(舊卡片是整批
  // innerHTML 換掉的新 DOM 節點,舊的 ScrollTrigger 實例已經對應不到
  // 任何東西,先 kill 掉再重建,不然會累積殘留實例)。用
  // ScrollTrigger.batch() 而不是自己手寫 IntersectionObserver——同一批
  // 進入視窗的卡片會自動 stagger 播放,不需要自己算延遲時間。只在初次
  // 捲入視窗時觸發一次(只給 onEnter,沒有 onLeaveBack),捲出去再捲
  // 回來不會重新淡出淡入。
  function wireCardReveal() {
    cardRevealTriggers.forEach((st) => st.kill());
    cardRevealTriggers = [];

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = Array.from(grid.children);
    if (cards.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set(cards, { autoAlpha: 0, y: 24 });
    cardRevealTriggers = ScrollTrigger.batch(cards, {
      start: 'top 90%',
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
        overwrite: true,
      }),
    });
  }

  function applyTab(key) {
    const tab = tabs[key];
    header.textContent = `[ ${tab.label} ]`;
    grid.innerHTML = tab.items
      .map((item, i) => buildWorkCard(item, tab.numbered ? `${String(i + 1).padStart(2, '0')}.` : '', tab.cropThumbnails))
      .join('\n');
    wireHoverVideos();
    wireCardReveal();
    currentTab = key;
    // 切換分頁常常改變 #works 的實際高度(Works 13 張卡片 vs Blog 目前
    // 只有 1 篇文章),這會連帶改變 #about 在文件裡的絕對位置——但
    // ScrollTrigger 快取的 trigger 起訖位置不會自動偵測這種非 resize
    // 觸發的版面變動,必須手動 refresh 一次,不然 js/hero-scroll-fade.js
    // 那個 pin 住 #about 的 ScrollTrigger 會繼續沿用切換前、已經對不準
    // 的位置。
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function setTab(key, { pushHistory = true, scrollAfter = false } = {}) {
    if (!tabs[key]) key = defaultTab;

    if (key === currentTab) {
      if (scrollAfter) scrollToWorksTop();
      return;
    }

    if (currentTab === null) {
      // 第一次渲染,還沒有舊內容可以淡出,直接淡入就好。
      applyTab(key);
      gsap.fromTo(grid, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE_DURATION });
      if (scrollAfter) scrollToWorksTop();
    } else {
      gsap.to(grid, {
        autoAlpha: 0,
        duration: FADE_DURATION,
        onComplete: () => {
          applyTab(key);
          gsap.to(grid, { autoAlpha: 1, duration: FADE_DURATION });
          // 捲動要等內容真的換完才觸發,不能在 fade-out 一開始(內容
          // 還是切換前的舊內容、高度也還是舊的)就立刻捲——踩過的坑:
          // 舊寫法在點擊當下就同步呼叫 scrollIntoView,這時 DOM 還是
          // 切換前的高度(例如 Works 13 張卡片),瀏覽器據此鎖定一個
          // 捲動終點並開始 smooth-scroll;300ms 後 onComplete 才真的把
          // 內容換成 Blog 的 1 篇文章,文件高度瞬間變矮,原本鎖定的
          // 終點超出新的可捲動範圍,瀏覽器只能把捲動位置夾到新的上限,
          // 結果精確停在「比 #works 頂部還淺一點」的位置——這正是螢幕
          // 上緣露出 Hero 尾端(圓點背景/版本號列)的根本原因。等
          // applyTab() 把內容換成最終版本之後才呼叫 scrollIntoView,
          // 目標位置從一開始就是對的,不會被中途變動的文件高度打斷。
          if (scrollAfter) scrollToWorksTop();
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
      setTab(link.getAttribute('data-tab-link'), { scrollAfter: true });
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
