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
 * 資料物件格式:
 * {
 *   title: string,                // 左欄大標題
 *   category: string,             // 標題下方分類標籤
 *   intro: string,                // 左欄介紹段落
 *   author: string,               // 左欄底部作者/meta 資訊
 *   backHref: string,             // 「← BACK」連結目標,預設 'index.html'
 *   media: [                      // 中欄 Overview 的媒體堆疊,任意數量
 *     { type: 'image', src, alt } |
 *     { type: 'video', src } |
 *     { type: 'placeholder', label }
 *   ],
 *   overview: { paragraphs: string[] }, // Overview 右側描述文字,任意段數
 *   sections: [                   // 底下手風琴區塊,任意數量、任意標題
 *     { title: string, content: string }
 *   ],
 * }
 */

function renderCaseStudyPage(data, mountSelector) {
  const mount = document.querySelector(mountSelector);
  if (!mount) {
    throw new Error(`renderCaseStudyPage: 找不到掛載點 "${mountSelector}"`);
  }

  mount.innerHTML = buildHtml(data);
  initAccordions(data);
}

function buildHtml(data) {
  const backHref = data.backHref || 'index.html';

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

        <div class="border-b border-black/10 shrink-0">
          ${buildAccordionHeader('overview', 'Overview', true)}
          <div id="accordionContent-overview" class="overflow-hidden">
            <div class="lg:max-h-[calc(100vh-192px)] lg:overflow-y-auto">
              <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 px-10 py-10">
                <div class="w-full lg:w-[60%] flex flex-col gap-8">
                  ${data.media.map(buildMediaItem).join('\n')}
                </div>
                <div class="flex-1">
                  ${buildParagraphs(data.overview.paragraphs)}
                </div>
              </div>
            </div>
          </div>
        </div>

        ${data.sections.map((section, i) => buildSection(section, i)).join('\n')}

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

function buildSection(section, index) {
  const id = `section-${index}`;
  return `
    <div class="border-b border-black/10 shrink-0">
      ${buildAccordionHeader(id, section.title, false)}
      <div id="accordionContent-${id}" class="overflow-hidden" style="height: 0;">
        <div class="lg:max-h-[calc(100vh-192px)] lg:overflow-y-auto">
          <div class="px-10 py-10">
            ${buildParagraphs([section.content])}
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildMediaItem(item) {
  if (item.type === 'image') {
    return `<img src="${item.src}" alt="${item.alt || ''}" class="w-full block">`;
  }
  if (item.type === 'video') {
    return `<video src="${item.src}" class="w-full block" controls></video>`;
  }
  return `
    <div class="w-full aspect-[4/3] border border-dashed border-black/15 flex items-center justify-center">
      <span class="font-geistmono text-xs text-muted">${item.label || ''}</span>
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
