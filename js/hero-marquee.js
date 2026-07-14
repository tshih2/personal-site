// 低調亂碼跑馬燈——原本只服務 Hero 背景,現在拆成可重複套用的
// initMarquee(fieldId, options) 工廠函式,讓 Footer 也能用同一套邏輯
// (長短不一、雙向隨機、車道系統不重疊),只是換一組顏色/透明度參數,
// 不需要另外寫一份幾乎一樣的程式。
//
// 範圍限定在呼叫端傳入的 field 元素自己的父容器(heroContainer =
// field.parentElement),不是整個外層區塊——utility bar/時鐘/底部列
// 固定占用該區塊上下兩段,如果車道範圍是整個區塊,那兩段永遠不會空
// 出來,可用高度會被永久壓縮成中間一小段。限定在父容器內之後,唯一
// 要避開的保護區塊只剩該容器裡標了 [data-protect] 的元素(hero 是
// #heroText,footer 是 wordmark 的 <p>),可用高度就是整個容器扣掉
// 保護區塊,不會再被其他固定內容擠壓。
//
// 把這個容器的高度切成固定數量的水平「車道」(LANE_COUNT,遠大於同時
// 存在上限 MAX_TRACKS,留出車道間緩衝——車道變薄之後,同一塊保護區塊
// 會蓋住更多條車道,所以車道總數要抓「扣掉保護區塊佔用後,剩餘可用
// 車道依然遠大於 MAX_TRACKS」,不是單純跟著 MAX_TRACKS 等比放大一點點。
// 24 是用 Playwright 在 15 組同時存在時實測「任兩組 Y 軸區間都沒有
// 重疊」量出來的安全值),每條車道同一時間只允許一組跑馬燈——生成
// 新的跑馬燈時只能挑「目前沒有其他跑馬燈在跑」的車道,並且用「這條車道
// 預計何時跑完全程」(laneFreeAt,依文字長度換算出的 duration 推算)
// 登記占用,不是只看當下有沒有東西,徹底避免同一車道前後兩組跑馬燈
// 時間重疊。字級(11–14px)跟速度、透明度綁在一起做出深度感:字級小的
// 軌道跑得快、透明度低(感覺較遠);字級大的跑得慢、透明度稍高(較近)。
function initMarquee(fieldId, options) {
  if (typeof gsap === 'undefined') return;

  const field = document.getElementById(fieldId);
  if (!field) return;

  const opts = options || {};
  // 顏色/透明度階這兩個參數化,是這次拆成工廠函式唯一需要因場景而
  // 異的部分——Hero 是淺色底(cream),用 ink 色的低透明度階;Footer
  // 是黑底,直接沿用 ink 色階會幾乎看不見,改用白色的低透明度階。
  const color = opts.color || 'var(--ink)';
  const opacitySteps = opts.opacitySteps || [0.1, 0.14, 0.18, 0.22, 0.25];

  const heroContainer = field.parentElement;

  const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}/\\|_+=~';
  const MIN_FONT = 11;
  const MAX_FONT = 14;
  const MIN_TRACKS = 5;
  const MAX_TRACKS = 15;
  const LANE_COUNT = 24;
  // 速度區間拉大(原本 30–70),讓最快跟最慢的對比更明顯,實際 duration
  // 還會再疊加一個獨立的隨機浮動(見 spawnTrack),不是單純字級的線性函數。
  const MIN_DURATION = 20;
  const MAX_DURATION = 90;
  const DURATION_JITTER_MIN = 0.85;
  const DURATION_JITTER_MAX = 1.15;
  // 長度改成先決定「目標渲染寬度」(3–7 公分,96dpi 換算 ≈113–265px),
  // 再依當下這條軌道實際的字級/letter-spacing 反推要生成幾個字元,
  // 不用固定字元數——同樣字元數在不同字級/字距下渲染寬度不一樣。
  const MIN_TARGET_WIDTH_PX = 113; // 3cm @ 96dpi
  const MAX_TARGET_WIDTH_PX = 265; // 7cm @ 96dpi
  const PROTECT_PADDING = 10; // px,保護區塊上下再多留一點緩衝
  const LANE_BUFFER_MS = 250; // 車道跑完後多留一點空檔才視為可用,避免頭尾緊接

  // 產生「剛好 length 個字元」的亂碼字串(字元跟穿插的空格共用同一個
  // 長度預算,空格是取代某個字元的位置,不是額外加上去的)——量測目標
  // 寬度換算字元數時才不會因為之後又多插入空格,讓實際渲染寬度比預期寬。
  function randomText(length) {
    let out = '';
    let sinceSpace = 0;
    let nextSpaceAt = gsap.utils.random(2, 6, 1);
    for (let i = 0; i < length; i++) {
      if (i > 0 && i < length - 1 && sinceSpace >= nextSpaceAt) {
        out += ' ';
        sinceSpace = 0;
        nextSpaceAt = gsap.utils.random(2, 6, 1);
      } else {
        out += GLITCH_CHARS[gsap.utils.random(0, GLITCH_CHARS.length - 1, 1)];
        sinceSpace++;
      }
    }
    return out;
  }

  function measureWidth(text, fontSize) {
    const probe = document.createElement('span');
    probe.className = 'font-geistmono';
    probe.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; left:-99999px; top:0; letter-spacing:0.2em;';
    probe.style.fontSize = `${fontSize}px`;
    probe.textContent = text;
    document.body.appendChild(probe);
    const width = probe.scrollWidth;
    document.body.removeChild(probe);
    return width;
  }

  // 產生一段渲染後大約落在 targetWidthPx 的亂碼字串。先用一段代表性
  // 樣本(跟正式內容同一套字元分布,含空格)量出平均每字元寬度換算出
  // 初始字元數,再實際量一次渲染寬度——如果跟目標差超過 15%,依實際
  // 比例修正字元數重新生成一次,不需要無限重試迴圈就能落在合理範圍。
  function generateTextForWidth(targetWidthPx, fontSize) {
    const sampleLength = 24;
    const sampleWidth = measureWidth(randomText(sampleLength), fontSize);
    const avgCharWidth = sampleWidth / sampleLength;

    let length = Math.max(3, Math.round(targetWidthPx / avgCharWidth));
    let text = randomText(length);
    let width = measureWidth(text, fontSize);

    if (width > 0 && Math.abs(width - targetWidthPx) / targetWidthPx > 0.15) {
      length = Math.max(3, Math.round(length * (targetWidthPx / width)));
      text = randomText(length);
    }
    return text;
  }

  // 車道 i 的 Y 範圍(heroContainer 相對座標),固定切分、不隨內容變動。
  function laneRange(heroContainerHeight, i) {
    const laneHeight = heroContainerHeight / LANE_COUNT;
    return [i * laneHeight, (i + 1) * laneHeight];
  }

  // 回傳目前被 [data-protect] 區塊佔用的車道索引集合。每次生成新軌道
  // 都重新量測,因為容器內容(hero 文案 carousel/footer wordmark)可能
  // 動態改變高度。
  function getBlockedLanes() {
    const heroContainerRect = heroContainer.getBoundingClientRect();
    const laneHeight = heroContainerRect.height / LANE_COUNT;
    const blocked = new Set();
    heroContainer.querySelectorAll('[data-protect]').forEach((protectedEl) => {
      const r = protectedEl.getBoundingClientRect();
      const top = r.top - heroContainerRect.top - PROTECT_PADDING;
      const bottom = r.bottom - heroContainerRect.top + PROTECT_PADDING;
      const startLane = Math.max(0, Math.floor(top / laneHeight));
      const endLane = Math.min(LANE_COUNT - 1, Math.floor((bottom - 0.01) / laneHeight));
      for (let i = startLane; i <= endLane; i++) blocked.add(i);
    });
    return blocked;
  }

  let running = false;
  let activeCount = 0;
  const targetCount = gsap.utils.random(MIN_TRACKS, MAX_TRACKS, 1);
  // 每條車道「預計空出來的時間」(performance.now() 的時間戳),
  // 0 代表現在就是空的。生成當下用這個判斷車道是否真的沒人佔用,
  // 而不是只看「這一刻」畫面上有沒有東西——這樣才能保證同一車道
  // 前後兩組不會時間重疊。
  const laneFreeAt = new Array(LANE_COUNT).fill(0);

  function pickFreeLane() {
    const blocked = getBlockedLanes();
    const now = performance.now();
    const candidates = [];
    for (let i = 0; i < LANE_COUNT; i++) {
      if (blocked.has(i)) continue;
      if (laneFreeAt[i] > now) continue;
      candidates.push(i);
    }
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function spawnTrack() {
    if (!running || activeCount >= targetCount) return;

    const laneIndex = pickFreeLane();
    if (laneIndex === null) {
      // 目前所有車道不是被保護區塊佔用就是還有其他跑馬燈在跑,
      // 晚點再試,不硬擠進正在使用中的車道。
      gsap.delayedCall(0.5, spawnTrack);
      return;
    }

    const heroContainerRect = heroContainer.getBoundingClientRect();
    const [laneTop, laneBottom] = laneRange(heroContainerRect.height, laneIndex);

    const fontSize = gsap.utils.random(MIN_FONT, MAX_FONT);
    const depth = (fontSize - MIN_FONT) / (MAX_FONT - MIN_FONT); // 0=最小/最遠,1=最大/最近
    // 顏色:獨立隨機挑一階,不跟字級/速度綁在一起。
    const opacity = opacitySteps[gsap.utils.random(0, opacitySteps.length - 1, 1)];
    // 速度:維持「字級小→較快、字級大→較慢」的深度基準,但額外疊加
    // 一個獨立的隨機浮動,避免同一字級每次都得到幾乎一樣的速度。
    const baseDuration = gsap.utils.mapRange(0, 1, MIN_DURATION, MAX_DURATION, depth);
    const duration = baseDuration * gsap.utils.random(DURATION_JITTER_MIN, DURATION_JITTER_MAX);
    // 長度:先決定目標渲染寬度,再依這條軌道實際字級生成對應寬度的內容。
    const targetWidthPx = gsap.utils.random(MIN_TARGET_WIDTH_PX, MAX_TARGET_WIDTH_PX);
    const text = generateTextForWidth(targetWidthPx, fontSize);
    const forward = Math.random() < 0.5;

    activeCount++;
    laneFreeAt[laneIndex] = performance.now() + duration * 1000 + LANE_BUFFER_MS;

    // 車道中心對齊文字的視覺中線(用 font-size 概估文字高度)。
    const y = laneTop + (laneBottom - laneTop) / 2 - fontSize * 0.4;

    const track = document.createElement('div');
    track.className = 'absolute whitespace-nowrap font-geistmono';
    track.style.top = `${y}px`;
    track.style.left = '0';
    track.style.fontSize = `${fontSize}px`;
    track.style.letterSpacing = '0.2em';
    track.style.color = color;
    track.style.opacity = opacity;
    track.dataset.lane = String(laneIndex);
    track.textContent = text;
    field.appendChild(track);

    const trackWidth = track.scrollWidth;
    const fieldWidth = field.clientWidth;
    const fromX = forward ? -trackWidth : fieldWidth;
    const toX = forward ? fieldWidth : -trackWidth;

    gsap.set(track, { x: fromX });
    gsap.to(track, {
      x: toX,
      duration,
      ease: 'none',
      onComplete: () => {
        track.remove();
        activeCount--;
        laneFreeAt[laneIndex] = 0;
        spawnTrack();
      },
    });
  }

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    running = true;
    // 錯開初始生成時間,不要一次全部同時從畫面邊緣冒出來。
    for (let i = 0; i < targetCount; i++) {
      gsap.delayedCall(i * 0.6, spawnTrack);
    }

    return () => {
      running = false;
      field.innerHTML = '';
      activeCount = 0;
      laneFreeAt.fill(0);
    };
  });

  // 減少動態偏好時,放幾條不會動的噪點文字當背景紋理,不做任何捲動排程,
  // 一樣分散在不同車道、避開保護區塊。
  mm.add('(prefers-reduced-motion: reduce)', () => {
    const heroContainerRect = heroContainer.getBoundingClientRect();
    const blocked = getBlockedLanes();
    const openLanes = [];
    for (let i = 0; i < LANE_COUNT; i++) if (!blocked.has(i)) openLanes.push(i);
    const staticCount = Math.min(3, openLanes.length);
    const chosen = openLanes.sort(() => Math.random() - 0.5).slice(0, staticCount);

    chosen.forEach((laneIndex) => {
      const [laneTop, laneBottom] = laneRange(heroContainerRect.height, laneIndex);
      const fontSize = gsap.utils.random(MIN_FONT, MAX_FONT);
      const y = laneTop + (laneBottom - laneTop) / 2 - fontSize * 0.4;
      const track = document.createElement('div');
      track.className = 'absolute whitespace-nowrap font-geistmono';
      track.style.top = `${y}px`;
      track.style.left = 'var(--page-margin-x)';
      track.style.fontSize = `${fontSize}px`;
      track.style.letterSpacing = '0.2em';
      track.style.color = color;
      track.style.opacity = opacitySteps[0];
      track.textContent = randomText(gsap.utils.random(15, 30, 1));
      field.appendChild(track);
    });

    return () => {
      field.innerHTML = '';
    };
  });
}

initMarquee('marqueeField', {
  color: 'var(--ink)',
  opacitySteps: [0.1, 0.14, 0.18, 0.22, 0.25],
});

// About 區塊是黑底,沿用 ink 色階會幾乎看不見,改用白色的低透明度階
// (white/10 ~ white/20,依 Tim 那輪要求的範圍),這階段先不做故障感
// 的色偏/glitch 效果,單純黑底 + 跑馬燈。
initMarquee('aboutMarqueeField', {
  color: '#ffffff',
  opacitySteps: [0.1, 0.13, 0.16, 0.2],
});
