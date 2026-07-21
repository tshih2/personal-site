/*
 * Case study 頁面樣板。
 * 吃一個資料物件(見 data-*.js 的格式範例),動態生成整個三欄
 * 版面(左欄簡介 + 右欄 Overview/手風琴區塊),並掛好 GSAP 高度
 * 展開/收合的互斥手風琴邏輯。
 *
 * 用法:
 *   <div id="app"></div>
 *   <script src="js/case-study-template.js"></script>
 *   <script src="data/data-xxx.js"></script>
 *   <script>renderCaseStudyPage(CASE_STUDY_DATA, '#app');</script>
 *
 * 資料物件格式(目前推薦的預設寫法——新作品一律照這個寫,詳見
 * 下面「兩種渲染模式」的說明):
 * {
 *   title: string,                // 左欄大標題
 *   category: string,             // 標題下方分類標籤
 *   intro: string,                // 左欄介紹段落
 *   author: string,               // 左欄底部作者/meta 資訊
 *   backHref: string,             // 「← BACK」連結目標,預設 'index.html'
 *   overview: {
 *     content: string[],          // 右側描述文字,陣列裡每一個字串是
 *                                  // 獨立一段(可含 <strong>子標題</strong>),
 *                                  // 段數不限
 *     media: [ ... ]               // 見下面「media 項目格式」,可省略
 *                                  // (完全沒有媒體時整段變成單欄)
 *   },
 *   sections: [                   // 底下手風琴區塊,任意數量、任意標題
 *     {
 *       title: string,
 *       content: string[],        // 格式跟 overview.content 一模一樣
 *       media: [ ... ]             // 可省略,格式同上
 *     }
 *   ],
 * }
 *
 * media 項目格式:
 *   { type: 'image', src, alt } | { type: 'video', src } | { type: 'placeholder', label }
 *
 *   src 可以是純字串(同一個檔案兩種斷點都顯示),也可以是
 *   { desktop, mobile } 物件(兩種斷點各自顯示不同檔案,`lg:` 以上顯示
 *   desktop、以下顯示 mobile,純 CSS class 切換,見下面渲染模式 2 的
 *   說明)。沒有另外準備 Mobile 版本素材時,給純字串就好——不是每張圖
 *   都強制要求兩個版本,樣板會正確處理只有 desktop 的情況。
 *
 * 兩種渲染模式(由 media 陣列是否存在自動決定,不需要另外設定開關):
 *
 *   1. 沒有 media(或空陣列)→ 純文字單欄版面,media 完全不畫。max-height
 *      上限是純 CSS 的 `calc(100vh-192px)`(192px = 自己的標題列 96px +
 *      至少露出下一個標題列 96px),不需要 JS 量測——這個公式只在單欄
 *      版面用,不會遇到下面模式 2 的「max-height 不給明確高度、h-full
 *      鏈失效」那個坑(見 buildTwoColumnShell 的完整說明),所以可以
 *      放心用純 CSS 表達,不用動態量測。
 *
 *   2. 有 media(不管幾項)→ 左右分欄:左側媒體欄是它自己獨立的
 *      overflow-y-auto 捲動容器,裡面的圖片/影片依序垂直排列,每一張
 *      都維持原始寬度(填滿媒體欄寬度)/原始長寬比,不裁切、不縮小塞進
 *      共用的固定框。使用者在媒體欄範圍內滾動滑鼠滾輪/觸控滑動,就是
 *      在這個獨立容器裡捲動——桌面版套用 CSS scroll-snap
 *      (`snap-y snap-proximity` + 每張圖 `snap-start`),讓捲動自然吸附
 *      到「一次剛好看到一張」,不需要自己寫 JS 判斷捲動距離對應第幾張。
 *      用 `proximity` 不是 `mandatory`——一個作品裡不同圖片的長寬比
 *      差異可能很大(例如某張是很扁的橫幅圖),`mandatory` 會強制每次
 *      捲動都吸附到最近的圖片,矮圖下方的大片空白區域捲起來會讓瀏覽器
 *      「用力拉回」吸附點,體感卡頓;`proximity` 只在捲動自然接近吸附
 *      點時才吸附,不會硬拉,同時仍保留「捲一段大致停在一張圖」的效果。
 *      如果有兩張以上,底下會有一列**圓點指示器**(見下面說明),反映
 *      「媒體欄自己捲到第幾張」,不是文字欄的捲動位置或長度——右側文字
 *      欄是完全獨立的另一個捲動軸,兩者互不影響。這是這個樣板目前的
 *      預設/唯一的「有媒體」渲染方式,OVERVIEW 跟任何一個 section 只要
 *      有 media 就自動套用,不需要各自客製化。完整實作見
 *      buildAccordionBlock()/buildMediaColumn()/initMediaCarousel()。
 *
 *      **手風琴框的高度是每個區塊各自獨立算的**(見
 *      initMediaColumnHeights()),不是全站共用同一個值——量這個區塊
 *      自己 media 陣列裡所有圖片/影片渲染高度的中位數,讓每個區塊的
 *      框都貼合自己的素材,不會被別的區塊(尤其是 OVERVIEW)的素材
 *      長寬比拖累。同時仍會夾一個視窗高度上限(見下面說明),確保
 *      「展開時看得到下一個標題」的保證不會被某個區塊特別高的圖片
 *      打破。
 *
 *   圓點指示器:數量對應媒體欄的圖片總數,顏色沿用既有色票——目前顯示
 *   的那張用 bg-ink,其餘用 bg-black/15,不另外設計新顏色。只在桌面
 *   (lg:)顯示,因為手機/平板本來就是整頁自然捲動,媒體欄不會是獨立
 *   捲動容器。點擊圓點會讓媒體欄捲動(scrollTo + smooth)到對應那張圖。
 *
 *   Desktop/Mobile 兩版素材:如果 media 項目的 src 是 { desktop, mobile }
 *   物件,buildMediaItem() 會渲染兩個 <img>(或 <video>),分別套用
 *   `hidden lg:block`(只在桌面顯示)跟 `block lg:hidden`(只在 lg: 以下
 *   顯示)——純 CSS class 切換顯示/隱藏,不是 JS 偵測視窗寬度動態換
 *   src,resize 不需要額外處理圖片重新載入,兩種斷點之間也不會有短暫
 *   顯示錯誤版本的問題。沒有 mobile 版本素材時,src 給純字串,兩種斷點
 *   會顯示同一張圖,不會因為缺少 mobile 欄位而報錯或留白。
 *
 *   舊資料格式相容性:content 給字串(不是陣列)一樣會被當成單一段落
 *   接受;overview 用 `paragraphs` 而不是 `content`、media 放在頂層
 *   `data.media` 而不是 `overview.media` 也一樣支援,不需要為了套用
 *   這份樣板去改寫既有頁面的資料檔——只有新資料檔案建議直接用上面
 *   的預設寫法。
 *
 *   （這一版拿掉了「文字欄捲動位置驅動圖片切換」的設計——實測發現兩個
 *   問題:文字內容不夠長時完全沒有捲動空間可以觸發切換,文字內容
 *   剛好夠長時,捲動位置換算成圖片 index 的門檻也很難抓準,容易跳過
 *   某張圖。媒體欄自己獨立捲動 + CSS scroll-snap 直接解決兩個問題,
 *   不依賴文字內容的長度或捲動位置。）
 *
 *   Lightbox 全圖檢視:每一張 type:'image' 的素材都可以點擊(或
 *   Enter/Space 鍵盤觸發)開啟全螢幕檢視,裡面有左右箭頭可以切換到
 *   同一個區塊(同一個 media 陣列)裡的上一張/下一張圖片,循環不會
 *   卡在頭尾。圖片一律顯示 desktop 版本(不管目前是哪個斷點觸發
 *   點擊)——lightbox 的用途是看清楚細節,desktop 版通常裁切較少、
 *   細節較完整,用手機版縮圖反而可能不一致。影片、佔位框不開啟
 *   lightbox,只有真正的圖片素材才有。完整實作見
 *   buildLightbox()/initLightbox()。
 */

function renderCaseStudyPage(data, mountSelector) {
  const mount = document.querySelector(mountSelector);
  if (!mount) {
    throw new Error(`renderCaseStudyPage: 找不到掛載點 "${mountSelector}"`);
  }

  mount.innerHTML = buildHtml(data);
  initAccordions(data);
  initMediaColumnHeights(mount, data);
  initMediaCarousel(mount, data);
  initLightbox(mount);
}

// 統一收集「這個頁面總共有哪些手風琴內容區塊」,Overview 跟 sections
// 都變成同一種形狀 { id, title, defaultOpen, content, media },後面
// buildHtml()/initMediaCarousel()/initMediaColumnHeights() 都走這份
// 清單,不再各自特判 Overview 是不是特殊的第一塊。content/media 也在
// 這裡做舊資料格式的相容處理(見檔案開頭註解的「舊資料格式相容性」)。
function collectBlocks(data) {
  const overviewContent = data.overview.content || data.overview.paragraphs;
  const overviewMedia = data.overview.media || data.media;

  return [
    { id: 'overview', title: 'Overview', defaultOpen: true, content: overviewContent, media: overviewMedia },
    ...data.sections.map((section, i) => ({
      id: `section-${i}`,
      title: section.title,
      defaultOpen: false,
      content: section.content,
      media: section.media,
    })),
  ];
}

function buildHtml(data) {
  const backHref = data.backHref || 'index.html';
  const blocks = collectBlocks(data);

  return `
    <div id="fold" class="flex flex-col lg:flex-row lg:h-screen lg:w-screen">

      <!-- 左欄:作品簡介。桌面(lg 以上,1024px)固定寬度側欄不參與收合;手機/平板疊在最上面、正常寬度 -->
      <div class="intro-col lg:h-full border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col px-8 lg:flex-[0_0_20.8333%] lg:min-w-[260px]">
        <div class="col-header border-b border-black/10">
          <a href="${backHref}" class="font-geistmono text-xs text-muted hover:text-ink transition-colors">← BACK</a>
        </div>

        <h1 class="mt-12 break-words font-unbounded font-extrabold text-[2.25rem] sm:text-[2.75rem] leading-[1.1] tracking-[-0.034em]">${data.title}</h1>
        <p class="mt-8 font-geistmono text-xs text-muted uppercase">${data.category}</p>

        <p class="mt-12 font-geist text-xs leading-[1.6] text-muted">${data.intro}</p>

        <div class="mt-12 lg:mt-auto pt-8 pb-12 font-geistmono text-xs text-muted">
          <p>${data.author}</p>
        </div>
      </div>

      <!-- 右欄:Overview + 手風琴區塊清單。桌面這一欄自己捲動;手機/平板跟著整頁一起捲 -->
      <div class="min-w-0 flex flex-col lg:h-full lg:overflow-y-auto lg:flex-1">
        ${blocks.map(buildAccordionBlock).join('\n')}
      </div>

    </div>

    ${buildLightbox()}
  `;
}

// 手風琴內容區「固定高度 + 左右分欄,兩欄各自獨立捲動」的外殼——
// OVERVIEW 跟任何有 media 的 section 共用同一份殼,不要各自抄一份改。
// lg:h-[var(--accordion-max-h-<id>)] 用固定高度而不是 max-height,是
// 因為 max-height 不會給子孫元素一個明確高度可以參照:任何子孫元素想
// 用 h-full(height:100%)去取得「填滿這一層」的高度時,因為這一層本身
// 是 height:auto(只有上限、沒有明確高度),百分比高度會直接失效退回
// auto——連鎖反應下,下面 flex row 的 lg:h-full、媒體欄/文字欄各自的
// lg:h-full 全部一起失效,媒體欄因此照著全部媒體項目疊起來的自然高度
// 撐開,lg:overflow-y-auto 形同虛設,因為沒有任何比內容矮的高度可以
// 觸發捲動。改成 h-[var(...)](固定高度,不是上限)才能真正給整條
// h-full 鏈一個明確的高度基準。
//
// 每個區塊(OVERVIEW、每個 section)各自有自己的 CSS 變數
// `--accordion-max-h-<id>`,由 initMediaColumnHeights() 量測這個區塊
// 自己 media 陣列裡所有項目渲染高度的中位數後動態賦值,不是全站共用
// 一個值、也不是寫死一個 px/vh 公式——這樣每個區塊的框都貼合自己的
// 素材長寬比,不會被別的區塊拖累(踩過的坑:MPAA 的 OVERVIEW 參考素材
// 是 16:9 影片,套用到其他 section 明顯比例不同的圖片上時,那些圖片
// 只佔框高一小部分,留下大片空白)。fallback 600px 只是在圖片量測
// 完成前(第一次 paint)的暫時值。lg:overflow-hidden 是保險——理論上
// 這一層高度固定後不該再有任何東西溢出,但仍防禦性地擋住。呼叫端
// 需要提供 mediaColumnHtml/textColumnHtml 兩欄各自的內容,加上這個
// 區塊的 id(用來組出對應的 CSS 變數名稱)。
function buildTwoColumnShell(mediaColumnHtml, textColumnHtml, id) {
  return `
    <div class="lg:h-[var(--accordion-max-h-${id},600px)] lg:overflow-hidden">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 px-10 py-10 lg:h-full">
        ${mediaColumnHtml}
        ${textColumnHtml}
      </div>
    </div>
  `;
}

function buildAccordionHeader(id, title, defaultOpen) {
  const icon = defaultOpen ? '−' : '+';
  return `
    <button id="accordionHeader-${id}" type="button" class="col-header w-full px-10 cursor-pointer">
      <h2 class="font-geistmono text-xs text-label uppercase">${title}</h2>
      <span class="toggle-icon shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-black/15 font-geistmono text-base">${icon}</span>
    </button>
  `;
}

// 單一手風琴內容區塊(Overview 或某個 section 都用這個)——依 media
// 是否存在自動選其中一種渲染模式,見檔案開頭註解的完整說明。
function buildAccordionBlock({ id, title, defaultOpen, content, media }) {
  const paragraphs = Array.isArray(content) ? content : [content];
  const hasMedia = Array.isArray(media) && media.length > 0;

  let inner;
  if (!hasMedia) {
    // 模式 1:沒有 media,純文字單欄版面。max-height 上限用純 CSS 的
    // calc(100vh-192px),不需要 JS 量測(理由見檔案開頭註解)。
    inner = `
      <div class="lg:max-h-[calc(100vh-192px)] lg:overflow-y-auto">
        <div class="px-10 py-10">
          ${buildParagraphs(paragraphs)}
        </div>
      </div>
    `;
  } else {
    // 模式 2:媒體欄自己獨立捲動(scroll-snap 分頁),文字欄由上往下
    // 獨立捲動,兩者完全不互相影響。
    inner = buildTwoColumnShell(
      buildMediaColumn(media, id),
      `<div id="textColumn-${id}" class="flex-1 lg:h-full lg:min-h-0 lg:overflow-y-auto">
        <div class="lg:shrink-0">
          ${buildParagraphs(paragraphs)}
        </div>
      </div>`,
      id
    );
  }

  return `
    <div class="border-b border-black/10 shrink-0">
      ${buildAccordionHeader(id, title, defaultOpen)}
      <div id="accordionContent-${id}" class="overflow-hidden" ${defaultOpen ? '' : 'style="height: 0;"'}>
        ${inner}
      </div>
    </div>
  `;
}

// 媒體欄:桌面版(lg:)是獨立的 overflow-y-auto + scroll-snap 捲動容器,
// 圖片依序垂直排列,每張都是 w-full 原始長寬比(不裁切、不縮小塞進
// 共用框)。lg:min-h-0 是這個專案已知的坑:flex item 預設
// min-height:auto,不會縮小到比自己內容的自然高度還小,即使父層想
// 透過 h-full/flex-1 逼它變矮也沒用,必須明確蓋掉這個預設值,
// overflow-y-auto 才會真正生效。手機/平板(< lg:)沒有這些 lg: 前綴
// class,退回一般文件流,圖片依序自然堆疊,跟著整頁捲動——不套用
// scroll-snap,因為手機本來就沒有獨立捲動的媒體欄,硬套 snap 只會讓
// 整頁捲動變得卡頓。
function buildMediaColumn(media, id) {
  const items = media
    .map((item, i) => {
      // 只有真正的圖片素材才能開 lightbox——影片有自己的原生
      // controls,佔位框沒有真的檔案可以看。lightbox 一律用 desktop
      // 版本的路徑(不管目前是哪個斷點點擊的),理由見檔案開頭註解。
      const isImage = item.type === 'image';
      const lightboxSrc = isImage ? (typeof item.src === 'object' ? item.src.desktop : item.src) : '';
      const triggerAttrs = isImage
        ? `data-lightbox-src="${lightboxSrc}" data-lightbox-alt="${item.alt || ''}" role="button" tabindex="0" aria-label="View full image"`
        : '';
      const triggerClass = isImage ? 'cursor-pointer' : '';
      return `
        <div class="media-item ${triggerClass} shrink-0 lg:snap-start" data-media-index="${i}" ${triggerAttrs}>
          ${buildMediaItem(item)}
        </div>
      `;
    })
    .join('\n');

  const hasDots = media.length > 1;

  return `
    <div class="w-full lg:w-[60%] flex flex-col gap-8 lg:gap-0 lg:h-full">
      <div id="mediaColumn-${id}" class="flex flex-col gap-8 lg:gap-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:snap-y lg:snap-proximity">
        ${items}
      </div>
      ${hasDots ? buildMediaDots(media.length) : ''}
    </div>
  `;
}

// 單一媒體項目——用原始長寬比,寬度填滿媒體欄,不裁切、不強迫統一
// 長寬比、不縮小塞進共用固定框(這是跟更早版本最大的差異:更早版本用
// object-contain 把圖片塞進跟圓點共用的固定高度框裡,結果圖片被縮小;
// 現在圖片維持自己應有的尺寸,圓點需要的高度另外算進
// --accordion-max-h-<id>,不跟圖片搶空間)。
//
// item.src 可以是純字串(同一張圖兩種斷點都顯示,例如目前部分作品的
// 素材還沒有另外準備 Mobile 版本),也可以是 { desktop, mobile } 物件
// (兩種斷點各自顯示不同檔案)。後者渲染成兩個 <img>/<video>,分別套
// `hidden lg:block`(只在桌面顯示)跟 `block lg:hidden`(只在 lg: 以下
// 顯示)——純 CSS 切換顯示/隱藏,不用 JS 偵測視窗寬度動態換 src,這樣
// resize 不需要額外處理圖片重新載入,也不會有兩種斷點之間短暫顯示
// 錯誤版本的問題。桌面版那個 <img> 加 data-variant="desktop",讓
// initMediaColumnHeights() 量測高度時能明確排除 Mobile 版本(見該函式
// 註解)。
function buildMediaItem(item) {
  if (item.type === 'image') {
    if (typeof item.src === 'object') {
      return `
        <img src="${item.src.desktop}" alt="${item.alt || ''}" class="hidden lg:block w-full" data-variant="desktop">
        <img src="${item.src.mobile}" alt="${item.alt || ''}" class="block lg:hidden w-full" data-variant="mobile">
      `;
    }
    return `<img src="${item.src}" alt="${item.alt || ''}" class="w-full block">`;
  }
  if (item.type === 'video') {
    if (typeof item.src === 'object') {
      return `
        <video src="${item.src.desktop}" class="hidden lg:block w-full" data-variant="desktop" controls></video>
        <video src="${item.src.mobile}" class="block lg:hidden w-full" data-variant="mobile" controls></video>
      `;
    }
    return `<video src="${item.src}" class="w-full block" controls></video>`;
  }
  return `
    <div class="w-full aspect-[4/3] border border-dashed border-black/15 flex items-center justify-center">
      <span class="font-geistmono text-xs text-muted">${item.label || ''}</span>
    </div>
  `;
}

// 全圖檢視 lightbox——整個頁面只建一份(不是每張圖各自一份),用
// state(目前顯示第幾張)去換內容,由 initLightbox() 控制顯示/隱藏跟
// 換圖。深色背景(bg-black,不是既有的 ink/muted 色票——這幾個 token
// 是給淺色背景配的文字色,全黑背景直接用 Tailwind 內建的
// black/white,比照 CLAUDE.md 裡 footer 純黑背景的既有慣例,不需要
// 為了這個全新的深色情境獨立定義新 token)。預設 `hidden`,
// initLightbox() 用 GSAP autoAlpha 淡入淡出切換。
function buildLightbox() {
  const iconAttrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  return `
    <div id="lightbox" class="hidden fixed inset-0 z-[100] items-center justify-center bg-black/95" role="dialog" aria-modal="true" aria-label="Image viewer">
      <button type="button" id="lightboxClose" class="absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors" aria-label="Close">
        <svg class="w-5 h-5" ${iconAttrs}><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
      <button type="button" id="lightboxPrev" class="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors" aria-label="Previous image">
        <svg class="w-5 h-5 lg:w-6 lg:h-6" ${iconAttrs}><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <img id="lightboxImage" src="" alt="" class="max-w-[85vw] max-h-[85vh] object-contain">
      <button type="button" id="lightboxNext" class="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors" aria-label="Next image">
        <svg class="w-5 h-5 lg:w-6 lg:h-6" ${iconAttrs}><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <div id="lightboxCounter" class="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 font-geistmono text-xs text-white/70"></div>
    </div>
  `;
}

// 頁數圓點指示器——僅桌面(lg:)顯示,是媒體欄下方的一個普通 sibling
// (不是疊在圖片上面的 absolute 元素),所以不會擠壓圖片本身的空間;
// 需要的高度由 initMediaColumnHeights() 量測後加進這個區塊自己的
// --accordion-max-h-<id>。顏色沿用 CLAUDE.md 既有色票:目前顯示的那張
// 用 bg-ink(跟主要文字同一個深色),其餘用 bg-black/15(元件邊框那個
// 色階,淺色/空心的視覺效果不需要另外定義新顏色)。點擊可以直接讓媒體
// 欄捲動到對應那張圖,由 initMediaCarousel() 綁定 click。
function buildMediaDots(count) {
  const dots = Array.from({ length: count }, (_, i) => `
    <button type="button" class="media-dot w-2 h-2 rounded-full transition-colors ${i === 0 ? 'bg-ink' : 'bg-black/15'}" data-dot-index="${i}" aria-label="Show image ${i + 1} of ${count}"></button>
  `).join('\n');

  return `
    <div class="media-dots hidden lg:flex items-center justify-center gap-2 pt-4 shrink-0">
      ${dots}
    </div>
  `;
}

// 段落清單:第一段不留上距,之後每段留上距(mt-10),數量不限。
function buildParagraphs(paragraphs) {
  return paragraphs.map((text, i) => {
    const spacing = i === 0 ? '' : 'mt-10 ';
    return `<p class="${spacing}font-geist text-xs leading-[1.8] text-muted max-w-md">${text}</p>`;
  }).join('\n');
}

/* ---- 媒體欄輪播:媒體欄本身是獨立捲動容器(見 buildMediaColumn),
   這裡只負責讓底部圓點指示器反映「媒體欄目前捲到第幾張」,以及讓點擊
   圓點時媒體欄捲動到對應那張圖——實際的「捲動切換圖片」本身是原生
   CSS scroll-snap 在做,不需要 JS 介入。只在桌面寬度(lg:)有意義,
   因為手機/平板的媒體欄不是獨立捲動容器,沒有「捲到第幾張」這件事;
   這裡沒有另外用 gsap.matchMedia() 限制寬度,因為就算在手機寬度掛了
   'scroll' 監聽也不會被觸發(media column 在手機沒有 overflow-y-auto,
   使用者是在捲整個頁面,不是這個容器本身),不會有多餘副作用,不需要
   額外的 cleanup 機制。 ---- */

function initMediaCarousel(mount, data) {
  const blocks = collectBlocks(data);

  blocks.forEach(({ id, media }) => {
    if (!Array.isArray(media) || media.length <= 1) return;

    const mediaColumn = mount.querySelector(`#mediaColumn-${id}`);
    if (!mediaColumn) return;

    const items = Array.from(mediaColumn.querySelectorAll('.media-item'));
    const dotsContainer = mediaColumn.parentElement.querySelector('.media-dots');
    if (!dotsContainer) return;
    const dots = Array.from(dotsContainer.querySelectorAll('.media-dot'));

    let activeIndex = 0;

    function setActiveDot(newIndex) {
      if (newIndex === activeIndex) return;
      if (dots[activeIndex]) dots[activeIndex].classList.replace('bg-ink', 'bg-black/15');
      if (dots[newIndex]) dots[newIndex].classList.replace('bg-black/15', 'bg-ink');
      activeIndex = newIndex;
    }

    // 每張圖在「內容座標系」裡的位置(不受目前捲動位置影響的絕對值)
    // ——用 getBoundingClientRect() 反推,不用 offsetTop,因為 offsetTop
    // 是相對於最近的「有定位」祖先元素,不保證就是這個捲動容器本身。
    function contentTopOf(el) {
      const containerTop = mediaColumn.getBoundingClientRect().top;
      return el.getBoundingClientRect().top - containerTop + mediaColumn.scrollTop;
    }

    function updateActiveFromScroll() {
      const scrollTop = mediaColumn.scrollTop;
      let closestIndex = 0;
      let closestDist = Infinity;
      items.forEach((item, i) => {
        const dist = Math.abs(contentTopOf(item) - scrollTop);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      setActiveDot(closestIndex);
    }

    mediaColumn.addEventListener('scroll', updateActiveFromScroll, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        mediaColumn.scrollTo({ top: contentTopOf(items[i]), behavior: 'smooth' });
        setActiveDot(i);
      });
    });
  });
}

/* ---- 全圖檢視 lightbox:點擊(或鍵盤 Enter/Space)任何一張圖片,開啟
   全螢幕檢視,左右箭頭在「同一個媒體欄」的圖片之間循環切換——導覽範圍
   刻意限定在同一個區塊自己的 media 陣列裡,不是跨區塊的全站清單,跟
   圓點指示器/scroll-snap 已經建立的「每個區塊是獨立一組」心智模型
   一致。清單用點擊當下即時從 DOM 抓(查詢同一個 #mediaColumn-<id>
   底下所有帶 data-lightbox-src 的 .media-item),不是頁面載入時就
   建好快取——這樣不需要另外維護一份跟 collectBlocks() 重複的資料
   結構,永遠反映目前 DOM 實際的圖片清單。 ---- */

function initLightbox(mount) {
  const lightbox = mount.querySelector('#lightbox');
  const imgEl = mount.querySelector('#lightboxImage');
  const counterEl = mount.querySelector('#lightboxCounter');
  const closeBtn = mount.querySelector('#lightboxClose');
  const prevBtn = mount.querySelector('#lightboxPrev');
  const nextBtn = mount.querySelector('#lightboxNext');
  if (!lightbox || !imgEl) return;

  let currentList = [];
  let currentIndex = 0;
  let triggerEl = null;

  function renderCurrent() {
    const item = currentList[currentIndex];
    imgEl.alt = item.alt;
    counterEl.textContent = currentList.length > 1 ? `${currentIndex + 1} / ${currentList.length}` : '';
    const multiple = currentList.length > 1;
    prevBtn.classList.toggle('hidden', !multiple);
    nextBtn.classList.toggle('hidden', !multiple);
  }

  // 切換圖片用 GSAP autoAlpha 交叉淡出,不是單純換 src 硬切——理由跟
  // 全站其他淡出淡入一律用 autoAlpha 的慣例一致(見 CLAUDE.md)。
  function showAt(index) {
    if (currentList.length === 0) return;
    currentIndex = (index + currentList.length) % currentList.length;
    gsap.to(imgEl, {
      autoAlpha: 0,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        imgEl.src = currentList[currentIndex].src;
        renderCurrent();
        gsap.to(imgEl, { autoAlpha: 1, duration: 0.15, ease: 'power1.out' });
      },
    });
  }

  function open(mediaColumn, clickedEl) {
    const triggers = Array.from(mediaColumn.querySelectorAll('.media-item[data-lightbox-src]'));
    currentList = triggers.map((el) => ({
      src: el.getAttribute('data-lightbox-src'),
      alt: el.getAttribute('data-lightbox-alt') || '',
    }));
    if (currentList.length === 0) return;

    const startIndex = triggers.indexOf(clickedEl);
    currentIndex = startIndex >= 0 ? startIndex : 0;
    triggerEl = clickedEl;

    imgEl.src = currentList[currentIndex].src;
    gsap.set(imgEl, { autoAlpha: 1 });
    renderCurrent();

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    gsap.fromTo(lightbox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    gsap.to(lightbox, {
      autoAlpha: 0,
      duration: 0.2,
      onComplete: () => {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        imgEl.src = '';
      },
    });
    document.body.style.overflow = '';
    if (triggerEl) triggerEl.focus();
  }

  mount.querySelectorAll('.media-item[data-lightbox-src]').forEach((el) => {
    const mediaColumn = el.closest('[id^="mediaColumn-"]');
    if (!mediaColumn) return;
    function trigger() {
      open(mediaColumn, el);
    }
    el.addEventListener('click', trigger);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => showAt(currentIndex - 1));
  nextBtn.addEventListener('click', () => showAt(currentIndex + 1));

  // 點背景(不是圖片或按鈕本身)也可以關閉——lightbox 底下的子元素
  // (圖片/按鈕)都是它的直接子節點,點在那些元素上 e.target 不會是
  // #lightbox 本身,所以這裡不會誤觸關閉。
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
    else if (e.key === 'ArrowRight') showAt(currentIndex + 1);
  });
}

/* ---- 手風琴內容區高度:每個區塊(OVERVIEW、每個 section)各自獨立
   量測、各自設定自己的 --accordion-max-h-<id> CSS 變數,不是全站共用
   一個值(這是這一版改掉的地方——之前固定只量 OVERVIEW 第一個媒體
   項目,套用到全站,結果別的區塊如果素材長寬比跟 OVERVIEW 差很多,
   框跟圖片就會明顯不合:圖片只佔框高一小部分,留下大片空白,捲動
   切換時也因為同一個框裡不同圖片高度落差太大而感覺卡頓)。

   量測邏輯:
   1. 對每個有 media 的區塊,抓出它自己媒體欄裡所有「目前生效的」
      <img>/<video>(排除 data-variant="mobile"——桌面寬度下量測時,
      Mobile 版本那個元素是 lg:hidden,getBoundingClientRect().height
      會是 0,量到的話會拉低結果)。
   2. 每個項目各自的 load/loadedmetadata 事件都會觸發重新計算一次
      ——不是等全部素材都載入完才算,而是隨著素材陸續載入完成,結果
      逐步收斂到最終正確值(先算出來的暫時值可能不準,但不會擋著不
      顯示東西)。
   3. 取這個區塊所有已載入項目「渲染高度」的**最大值**(不是中位數或
      平均——這裡踩過一次坑:一開始用中位數,結果一個 section 裡如果
      同時有很矮跟很高的圖(例如 130px/220px/410px 混在一起),中位數
      會落在中間值附近,那張最高的圖反而會超出框、變成需要在自己的
      「一頁」裡再往下捲才看得完,違背 scroll-snap「捲一次剛好看到
      一張完整圖片」的核心體驗。用最大值可以保證這個區塊裡任何一張圖
      都不會被裁切、都不需要內部再捲動;代價是比較矮的圖片下方會有
      比較明顯的空白,但這是目前公認「圖片不裁切、不縮小」的前提下
      無法避免的取捨,寧可留白也不要有圖片被截斷。用 getBoundingClientRect()
      量,不是用 naturalWidth/naturalHeight(那是原始檔案尺寸,不是
      response 後在畫面上實際佔的高度)。
   4. 最大高度 + 這個區塊媒體欄外層 flex row 的上下 padding + 圓點
      指示器高度(如果有的話),得到這個區塊「理論上」需要的框高。
   5. 這個理論值還要再夾一個視窗高度上限——`window.innerHeight - 192`
      (192px = 自己的標題列 96px + 至少露出下一個標題列 96px,沿用
      CLAUDE.md 原本「展開時至少要看到下一個標題」那條規則的數字)。
      不加這個上限的話,萬一某個區塊剛好都是很長的直式素材,中位數
      會很大,展開時可能會把下一個區塊的標題列擠出視窗外,破壞這條
      保證。

   每個區塊各自用 ResizeObserver 觀察自己的媒體欄容器寬度變化(響應式
   斷點、視窗縮放都會改變容器寬度,連帶改變每張圖的渲染高度);視窗
   「高度」單獨改變但寬度不變的情況(例如純粹把瀏覽器視窗拉高/拉矮)
   不會觸發容器寬度變化的 ResizeObserver,所以另外掛一個 window resize
   監聽,統一重新觸發所有區塊的量測。 ---- */

function initMediaColumnHeights(mount, data) {
  const fold = mount.querySelector('#fold');
  if (!fold) return;

  const blocks = collectBlocks(data);
  const recomputeFns = [];

  blocks.forEach(({ id, media }) => {
    if (!Array.isArray(media) || media.length === 0) return;

    const mediaColumn = mount.querySelector(`#mediaColumn-${id}`);
    if (!mediaColumn) return;

    const primaryMediaEls = Array.from(
      mediaColumn.querySelectorAll('img:not([data-variant="mobile"]), video:not([data-variant="mobile"])')
    );
    if (primaryMediaEls.length === 0) return;

    const dotsRow = mediaColumn.parentElement.querySelector('.media-dots');

    function maxHeight() {
      const heights = primaryMediaEls
        .map((el) => el.getBoundingClientRect().height)
        .filter((h) => h > 0);
      if (heights.length === 0) return 0;
      return Math.max(...heights);
    }

    function applyHeight() {
      const height = maxHeight();
      if (height <= 0) return;
      const flexRow = mediaColumn.parentElement.parentElement;
      const rowStyle = getComputedStyle(flexRow);
      const verticalPadding = parseFloat(rowStyle.paddingTop) + parseFloat(rowStyle.paddingBottom);
      const dotsHeight = dotsRow ? dotsRow.getBoundingClientRect().height : 0;
      const raw = height + verticalPadding + dotsHeight;
      const viewportCap = Math.max(window.innerHeight - 192, 200);
      const capped = Math.min(raw, viewportCap);
      fold.style.setProperty(`--accordion-max-h-${id}`, `${capped}px`);
    }

    primaryMediaEls.forEach((el) => {
      if (el.tagName === 'VIDEO') {
        if (el.readyState >= 1) applyHeight();
        else el.addEventListener('loadedmetadata', applyHeight, { once: true });
      } else {
        if (el.complete) applyHeight();
        else el.addEventListener('load', applyHeight, { once: true });
      }
    });

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => applyHeight());
      ro.observe(mediaColumn);
    }

    recomputeFns.push(applyHeight);
  });

  window.addEventListener('resize', () => recomputeFns.forEach((fn) => fn()));
}

/* ---- 手風琴互動邏輯:GSAP 高度展開/收合 + 互斥展開 ---- */

function initAccordions(data) {
  const DURATION = 0.5;
  const EASE = 'power2.inOut';

  const ids = ['overview', ...data.sections.map((_, i) => `section-${i}`)];
  const items = ids.map((id) => ({
    id,
    header: document.getElementById(`accordionHeader-${id}`),
    content: document.getElementById(`accordionContent-${id}`),
  }));

  let openId = 'overview';

  function setState(item, open) {
    const icon = item.header.querySelector('.toggle-icon');
    if (open) {
      gsap.to(item.content, { height: 'auto', duration: DURATION, ease: EASE });
      icon.textContent = '−';
    } else {
      gsap.to(item.content, { height: 0, duration: DURATION, ease: EASE });
      icon.textContent = '+';
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
