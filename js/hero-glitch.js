// 首頁 Hero 巨大展示字的「系統故障」動畫。
// 文案排成兩行交疊(第一行靠左、第二行靠右,負 margin 讓兩行貼近但
// 保留清楚間距),平常維持 font-unbounded(設計師的展示字個性)、乾淨
// 單色、沒有紅藍色偏——色偏只在故障 burst 期間才會出現。固定每 3 秒
// 觸發一次短暫的「故障」:主要靠紅藍錯位色偏(--glitch-dx/dy)加劇 +
// 文字亂碼化(text-scramble)來製造故障感,位移/字級只做極輕微的抖動,
// 不是視覺重點。亂碼字數是獨立隨機的 4–12 字元,但會先用「這次 burst
// 實際套用的舊字級」量出當下真正安全的字數上限再夾住(見
// getMaxSafeScrambleLength/safeScrambleLength)——早期版本亂碼字數
// 完全不管字級,舊字級如果是短句(如 TIM SHIH)對應的大字級、亂碼又
// 抽到接近 12 字元,會直接溢出容器(已在自然循環中量到最高 727px 的
// 溢出,不需要任何人為干擾),這是好幾次「某句文案跑版」回報的真正
// 根因,不是單一句子的個案。故障結束 settle 的時候換上下一句文案,
// 四句依序 loop:
// TIM SHIH → PRODUCT DESIGNER → INTERACTION DESIGNER → CREATIVE
// TECHNOLOGIST → 回到 TIM SHIH——呼應 Tim 同時是設計師也是 creative
// technologist,兩個身分在畫面上互相干擾、切換的感覺。過程中會閃現
// font-geistmono(工程師/coding 常見的等寬字)。
//
// 另外,idle(兩次文案 burst/紅藍錯位之間)有一個獨立的「掃描線切片」
// 效果(scanline slice)。觸發時機不是自己另外一套隨機頻率,而是精準
// 卡在「這次紅藍錯位結束」到「下一次紅藍錯位開始」這段固定 3 秒間隔
// 的正中間(1.5 秒)——見 scheduleScanlineMidpoint,在 glitchBurst 的
// settle 完成時一起排程下一次。兩行(line1/line2)在這個共同中間點
// 同時開始各自的連跳序列,但序列內部(重複次數、切片位置/方向)各自
// 獨立隨機,兩行同時觸發但呈現完全不同的畫面。觸發當下不是單一瞬間
// 閃一下就結束,而是連續 3–6 次快速連跳(每次
// 間隔 30–60ms,整體約 0.06–0.3 秒的一小段連續抖動),每一下都重新
// 獨立隨機決定切片數量/位置/方向,不是同一組參數重複播放——早期「單
// 發一次」的版本感覺是單一瞬間發生完就結束,不夠像「螢幕訊號連續
// 抖動」。每一下裡同時生成 3–6 條切片,各自獨立決定 Y 位置(分散在
// 文字上中下)、方向、位移距離(6–14px)、跟 0–30ms 的觸發時間差,
// 不是整齊劃一的單一條窄帶。每條切片色帶佔行高的 8–15%,疊上跟 burst
// 同一組紅/藍色偏色票、40–80ms 內彈回移除。水平範圍是相對於該行文字
// 自己實際渲染的寬度(不是固定寬度),長字(CREATIVE TECHNOLOGIST)
// 一樣貼齊左右邊界。連跳序列裡每一下觸發前都重新檢查 burstActive,
// 避免跨到文案 burst 開始的瞬間還繼續疊加效果。
(function () {
  if (typeof gsap === 'undefined') return;

  const el = document.getElementById('heroText');
  const line1El = document.getElementById('heroLine1');
  const line2El = document.getElementById('heroLine2');
  if (!el || !line1El || !line2El) return;

  const DISPLAY_FONT = 'font-unbounded';
  const CODE_FONT = 'font-geistmono';
  // 靜止狀態的色偏是 0(乾淨單色文字),故障 burst 期間才會用 GSAP
  // 把 --glitch-dx/--glitch-dy 動態調大,結束後再收回這兩個值。
  const BASE_DX = '0em';
  const BASE_DY = '0em';
  const STEP_DURATION = 0.09;
  const BURST_INTERVAL = 3;
  const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}/\\|_+=~';

  const SCANLINE_MIN_DURATION = 0.04;
  const SCANLINE_MAX_DURATION = 0.08;
  const SCANLINE_MIN_BAND_RATIO = 0.08;
  const SCANLINE_MAX_BAND_RATIO = 0.15;
  const SCANLINE_MIN_OFFSET = 6;
  const SCANLINE_MAX_OFFSET = 14;
  // 單一一條切片同一時間只有一條在動,效果稀疏、容易被忽略。改成每次
  // 觸發時同時生成 3–6 條切片,各自獨立決定 Y 位置(上/中/下散開)、
  // 方向、位移距離、跟 0–30ms 的觸發時間差(不整齊劃一)。另外兩行
  // (line1/line2)也各自有自己獨立的排程,觸發時機、切片數量、方向
  // 都各自隨機,不綁在一起——見下面 scheduleScanlineFor 分別呼叫兩次。
  const SCANLINE_SLICES_MIN = 3;
  const SCANLINE_SLICES_MAX = 6;
  const SCANLINE_MAX_STAGGER = 0.03;
  // 觸發當下不是只跳一次(哪怕單次內有多條切片同時出現),而是連續
  // 好幾次快速連跳——每次觸發變成一個 0.06–0.3 秒左右的連續抖動小
  // burst,每一下都重新獨立隨機決定切片數量/位置/方向,不是同一組
  // 參數重複播放。見下面 scanlineBurstSequence。
  const SCANLINE_REPEATS_MIN = 3;
  const SCANLINE_REPEATS_MAX = 6;
  const SCANLINE_REPEAT_GAP_MIN = 0.03;
  const SCANLINE_REPEAT_GAP_MAX = 0.06;

  const TEXTS = ['TIM SHIH', 'PRODUCT DESIGNER', 'INTERACTION DESIGNER', 'CREATIVE TECHNOLOGIST'];
  let textIndex = 0;

  // 原始 class list(含 font-unbounded + text-[clamp(...)] 字級),
  // 之後 classList 會被動態切換 font-unbounded/font-geistmono,
  // 所以要在任何切換發生前先存一份,量測用的隱藏 probe 元素才能
  // 還原「靜止狀態本來該有的字級」,不受切換影響。
  const BASE_CLASS = el.className;

  // 文案依「第一個空格」拆成兩行——目前四句都剛好是兩個單字,拆完
  // line2 用 slice 保留空格後的全部內容,將來就算某句是三個單字也
  // 只會拆成「第一個字」+「其餘全部」兩行,不會出例外。
  function splitLines(text) {
    const spaceIndex = text.indexOf(' ');
    if (spaceIndex === -1) return [text, ''];
    return [text.slice(0, spaceIndex), text.slice(spaceIndex + 1)];
  }

  function setFont(font) {
    el.classList.remove(DISPLAY_FONT, CODE_FONT);
    el.classList.add(font);
  }

  function setLineText(lineEl, text) {
    lineEl.textContent = text;
    lineEl.setAttribute('data-text', text);
  }

  function applyText(text) {
    const [line1, line2] = splitLines(text);
    setLineText(line1El, line1);
    setLineText(line2El, line2);
    el.setAttribute('aria-label', text);
  }

  // 亂碼字數跟「即將出現的下一句」的實際字數脫鉤——如果直接拿 nextText
  // 的 length 生成同樣長度的亂碼,眼尖會看出亂碼字數其實跟下一句對得上,
  // 削弱了故障當下「不確定性」的效果。改成每次都在 4–12 字元的範圍內
  // 獨立隨機決定,兩行各自各抽一次,不參考 nextText 的長度。
  //
  // 重要(這是真正造成過幾次溢出的根因,不是單一句子的個案):亂碼期間
  // 套用的字級是「舊」的 baseFontSize(校準給上一句用,例如短句 TIM
  // SHIH 對應的大字級),但亂碼字數是跟這個字級完全無關的獨立隨機值——
  // 如果舊字級很大、亂碼又剛好抽到接近 12 字元的長度,實際渲染寬度會
  // 遠遠超出容器,瞬間跑版(已用 Playwright 在自然循環中量到最高 727px
  // 的溢出,不需要任何人為干擾就會發生)。修法:setScramble 現在收一個
  // maxLength 參數,由呼叫端(glitchBurst)用「這次 burst 實際會套用的
  // 字級」量出當下真正安全的字數上限再傳進來,不是死板的 4–12,確保
  // 亂碼字數本身就通過同一套邊界檢查,不是算完字級之後才疊加、繞過檢查。
  const SCRAMBLE_MIN_LENGTH = 4;
  const SCRAMBLE_MAX_LENGTH = 12;

  function setScramble(maxLength) {
    const cap = Math.max(SCRAMBLE_MIN_LENGTH, Math.min(SCRAMBLE_MAX_LENGTH, maxLength));
    setLineText(line1El, randomScramble(gsap.utils.random(SCRAMBLE_MIN_LENGTH, cap, 1)));
    setLineText(line2El, randomScramble(gsap.utils.random(SCRAMBLE_MIN_LENGTH, cap, 1)));
  }

  function randomScramble(length) {
    let out = '';
    for (let i = 0; i < length; i++) {
      out += GLITCH_CHARS[gsap.utils.random(0, GLITCH_CHARS.length - 1, 1)];
    }
    return out;
  }

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const container = el.parentElement;

    // 量測某一行文字在「本來的 clamp 字級」下是否會超出容器寬度,
    // 超出的話回傳一個 <1 的縮放比例。兩行交疊排版下,欄寬需求是
    // 「兩行中較寬的那一行」,不是整句的總寬度,所以長詞彙(如
    // CREATIVE TECHNOLOGIST)也能維持比單行排版更大的字級。
    function getFullFontSize() {
      const probe = document.createElement('span');
      probe.className = BASE_CLASS;
      probe.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; left:-99999px; top:0;';
      probe.textContent = 'x';
      document.body.appendChild(probe);
      const size = parseFloat(getComputedStyle(probe).fontSize);
      document.body.removeChild(probe);
      return size;
    }

    // container(hero 的 flex-1 容器)現在跟 header 其他排一樣套了
    // px-[var(--page-margin-x)] 水平內距,h1 是 w-full,實際可用寬度是
    // container 的「內容寬度」(clientWidth 扣掉左右 padding),不是
    // clientWidth 本身——用 clientWidth 當預算會忽略 padding、讓字級算
    // 大一點點,長文案就可能貼出 padding 以外。
    function getAvailableWidth() {
      const style = getComputedStyle(container);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      return container.clientWidth - paddingLeft - paddingRight;
    }

    // 回傳「精準不溢出」的臨界縮放比例(width 剛好等於容器寬度時
    // scale=1),不在這裡預留安全邊界——安全邊界改由 computeBaseFontSize
    // 的隨機呼吸感疊加時統一處理,避免兩層邊界疊加後互相蓋過, 搞不清楚
    // 實際留了多少空間。
    function measureLineScale(text, fullFontSize) {
      if (!text) return 1;
      const probe = document.createElement('div');
      probe.className = BASE_CLASS;
      probe.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; display:inline-block; width:auto; left:-99999px; top:0;';
      probe.style.fontSize = `${fullFontSize}px`;
      probe.textContent = text;
      document.body.appendChild(probe);
      const width = probe.scrollWidth;
      document.body.removeChild(probe);
      const containerWidth = getAvailableWidth();
      return width > containerWidth ? containerWidth / width : 1;
    }

    // 原本用「隨機抽一段亂碼樣本量平均每字元寬度」估安全字數上限,
    // 但 GLITCH_CHARS 裡字元寬度差異很大(數字/窄符號 vs M、W、%、@
    // 這種寬字母),抽樣平均值只要剛好抽到偏窄的組合就會低估寬度需求,
    // 而「實際」setScramble 抽出來的字串又是另一次獨立隨機、可能剛好
    // 偏寬——這個落差已經在 90 秒純自然觀察中量到真實溢出(未受任何
    // resize 等人為干擾),證明 85% 安全邊界不足以覆蓋這種抽樣誤差。
    // 改成量測 GLITCH_CHARS 裡「單一最寬字元」的寬度,用它當作每個字元
    // 的保底寬度上限——不管 setScramble 實際隨機抽到哪個字元組合,
    // 寬度都不可能超過用這個值算出來的長度上限,不是靠平均值賭機率。
    // 字寬比例是固定的字型度量,只算一次、之後所有 burst 共用同一個
    // cache 值,不用每次 burst 都重新掃過整個字元集。
    let cachedWidestCharRatio = null;

    function getWidestCharWidthRatio() {
      if (cachedWidestCharRatio !== null) return cachedWidestCharRatio;
      const referenceFontSize = 100;
      const probe = document.createElement('span');
      probe.className = BASE_CLASS;
      probe.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; left:-99999px; top:0;';
      probe.style.fontSize = `${referenceFontSize}px`;
      document.body.appendChild(probe);
      let maxWidth = 0;
      for (const ch of GLITCH_CHARS) {
        probe.textContent = ch;
        maxWidth = Math.max(maxWidth, probe.scrollWidth);
      }
      document.body.removeChild(probe);
      cachedWidestCharRatio = maxWidth / referenceFontSize;
      return cachedWidestCharRatio;
    }

    function getMaxSafeScrambleLength(fontSize) {
      const widestCharWidth = getWidestCharWidthRatio() * fontSize;
      const containerWidth = getAvailableWidth();
      return Math.max(SCRAMBLE_MIN_LENGTH, Math.floor((containerWidth * 0.95) / widestCharWidth));
    }

    // 每次換句時字級不要每次都一模一樣,在「絕對不溢出」的臨界值
    // (hardMaxFontSize,scale=1 剛好貼齊容器)之下,隨機取 90%–97%
    // 之間的一個值——最多留 10% 的呼吸感差異,同時保證至少 3% 安全
    // 邊界,永遠不會觸碰到真正的溢出臨界線。
    const SIZE_JITTER_MIN = 0.9;
    const SIZE_JITTER_MAX = 0.97;

    function computeBaseFontSize(text) {
      const fullFontSize = getFullFontSize();
      const [line1, line2] = splitLines(text);
      const hardMaxScale = Math.min(measureLineScale(line1, fullFontSize), measureLineScale(line2, fullFontSize));
      const jitter = gsap.utils.random(SIZE_JITTER_MIN, SIZE_JITTER_MAX);
      return fullFontSize * hardMaxScale * jitter;
    }

    // 兩行文字改成「以容器中心為基準,各自隨機小幅水平錯位」,不再是
    // 固定的第一行靠左、第二行靠右——字數差異大的詞(如 TIM / SHIH)
    // 用固定左右對齊會變成兩端被硬拉開、中間留一大段空白,改成圍繞
    // 中心軸做隨機錯位才會像「故障導致的自然錯位」而不是版面切割。
    // 位移量是容器寬度的 5%–15%,並且用該行實際渲染寬度換算出的
    // maxShift 夾住,確保這行文字的左右邊緣都還在容器範圍內。
    const LINE_OFFSET_MIN_RATIO = 0.05;
    const LINE_OFFSET_MAX_RATIO = 0.15;

    // 兩行的關聯規則——三種候選版本,用 window.__offsetVariant 切換
    // (demo/比較用,還沒定案,見對話紀錄的截圖比較跟 CLAUDE.md 待辦):
    //   'mirror'     鏡像對稱:第一行決定方向+幅度,第二行方向相反、
    //                幅度依比例衰減(例如第一行往右 12%,第二行往左 8%)
    //   'decay'      比例衰減延續:第二行「順著」第一行的方向,幅度
    //                衰減,像同一股力道的餘波,不是相反方向
    //   'sharedSeed' 共享基準 + 各自小幅獨立抖動:兩行大致同調(同一個
    //                基準位移乘上接近 1 的比例),但各自疊加一點小幅
    //                獨立隨機,不是完全鏡像也不是完全獨立
    // 目前預設 fallback 是 'mirror',純粹是暫定值,正式定案要等使用者
    // 從截圖比較裡選一個。
    function computeLine2Desired(line1Desired, containerWidth, variant) {
      if (variant === 'decay') {
        return line1Desired * gsap.utils.random(0.4, 0.7);
      }
      if (variant === 'sharedSeed') {
        const jitter = containerWidth * gsap.utils.random(-0.04, 0.04);
        return line1Desired * gsap.utils.random(0.7, 1.0) + jitter;
      }
      // 'mirror'(預設/fallback)
      return -line1Desired * gsap.utils.random(0.5, 0.85);
    }

    function applyLineOffsets() {
      const containerWidth = getAvailableWidth();
      const variant = window.__offsetVariant || 'mirror';

      const magnitude1 = containerWidth * gsap.utils.random(LINE_OFFSET_MIN_RATIO, LINE_OFFSET_MAX_RATIO);
      const line1Desired = magnitude1 * (Math.random() < 0.5 ? -1 : 1);
      const line2Desired = computeLine2Desired(line1Desired, containerWidth, variant);

      [
        [line1El, line1Desired],
        [line2El, line2Desired],
      ].forEach(([lineEl, desired]) => {
        const lineWidth = lineEl.scrollWidth;
        const maxShift = Math.max(0, (containerWidth - lineWidth) / 2);
        const shift = gsap.utils.clamp(-maxShift, maxShift, desired);
        gsap.set(lineEl, { x: shift });
      });
    }

    let baseFontSize = computeBaseFontSize(TEXTS[textIndex]);
    gsap.set(el, { fontSize: baseFontSize });
    applyLineOffsets();

    let burstActive = false;

    // burst 進行中(亂碼顯示中)不重新套用字級/位移——這段期間畫面上
    // 顯示的是跟 TEXTS[textIndex] 無關的獨立隨機亂碼,如果這時候容器
    // 寬度變動觸發,會拿 TEXTS[textIndex] 的「真正文案」重新算字級/
    // 位移,但拿去套用/量測邊界的卻是當下完全不同字數的亂碼文字,
    // 兩者對不上,一樣可能繞過邊界檢查造成瞬間溢出。burst 期間跳過
    // 這一次更新,改記錄 resizePending,等 burst 一結束就立刻補一次
    // (見下面 onComplete),不用等下一次自然觸發的變動事件或下一輪
    // burst 才校正。
    let resizePending = false;
    const onContainerResize = () => {
      if (burstActive) {
        resizePending = true;
        return;
      }
      baseFontSize = computeBaseFontSize(TEXTS[textIndex]);
      gsap.set(el, { fontSize: baseFontSize });
      applyLineOffsets();
    };

    // 改用 ResizeObserver 直接觀察 hero 容器本身的實際尺寸變化,不用
    // window 的 'resize' 事件——'resize' 事件不保證每一次寬度變化都會
    // 觸發,瀏覽器在渲染負載較重時(這個頁面同時有跑馬燈、glitch burst
    // 等多個動畫在跑)可能會合併/跳過部分 resize 事件,導致某幾次寬度
    // 變化完全沒有對應的重新校準,字級永遠停留在舊寬度,直到剛好又有
    // 下一次「有觸發」的 resize 事件或下一輪 burst 才會被動修正——這正是
    // 用 Playwright 資源壓力測試量到的真實溢出根因(不是 burst 期間跳過
    // 的問題,是「事件根本沒發生」)。ResizeObserver 直接綁定渲染引擎
    // 自己的版面尺寸帳本,只要容器實際尺寸改變,一定會在下一個影格收到
    // 一次通知(多次變化只會合併成最新一次,不會整個遺漏),沒有這種
    // 事件遺失的風險。
    let isFirstObserverCallback = true;
    const resizeObserver = new ResizeObserver(() => {
      if (isFirstObserverCallback) {
        // ResizeObserver 第一次觀察一定會立即收到一次初始回報(即使尺寸
        // 沒有真的變化),這一次跳過,避免跟上面已經做過的初始
        // computeBaseFontSize/applyLineOffsets 重複套用。
        isFirstObserverCallback = false;
        return;
      }
      onContainerResize();
    });
    resizeObserver.observe(container);

    // forcedNextIndex 只給「開場故障」那次呼叫用——頁面載入時 textIndex
    // 本來就是 0(TIM SHIH),如果照平常的 (textIndex+1)%N 邏輯,開場
    // burst 會直接跳到下一句(PRODUCT DESIGNER),不會是「先亂碼、
    // 再穩定回到 TIM SHIH」。傳入 0 讓開場這次刻意 settle 回自己,
    // 之後沒有再傳參數的呼叫(包括這次 burst 自己排的下一輪)一律照
    // 原本的自動遞增邏輯走,不需要另外寫一套 burst 機制。
    function glitchBurst(forcedNextIndex) {
      burstActive = true;
      const nextIndex = typeof forcedNextIndex === 'number' ? forcedNextIndex : (textIndex + 1) % TEXTS.length;
      const nextText = TEXTS[nextIndex];
      const nextBaseFontSize = computeBaseFontSize(nextText);
      // 亂碼期間套用的字級是「舊」的 baseFontSize(還沒被 nextBaseFontSize
      // 取代),所以安全字數上限也要用這個舊字級去量,不是 nextBaseFontSize。
      const safeScrambleLength = getMaxSafeScrambleLength(baseFontSize);
      // getMaxSafeScrambleLength 的安全上限是假設這一行「置中、沒有水平
      // 位移」去算的,但兩行這時候可能還留著上一次 settle 的
      // applyLineOffsets() 位移(最多容器寬度的 15%)——scramble 步驟
      // 本身不會呼叫 applyLineOffsets 重算,這個舊位移疊上「本來安全」
      // 的亂碼寬度,一樣可能把文字推出邊界。故障期間位移本來就不是視覺
      // 重點,burst 一開始就把兩行的水平位移收回 0(置中),讓亂碼期間
      // 的安全字數計算跟實際渲染狀態一致,settle 時 applyLineOffsets()
      // 會再重新套用新的隨機位移。
      gsap.set([line1El, line2El], { x: 0 });

      const steps = gsap.utils.random(4, 7, 1);
      const tl = gsap.timeline({
        onComplete: () => {
          burstActive = false;
          // settle 已經套用了「這次 burst 開始時」校準的字級/位移——如果
          // burst 進行期間剛好有容器尺寸變化被跳過(見 onContainerResize 的
          // resizePending),這裡補一次,讓字級即時反映「現在」的實際
          // 容器寬度,不用等下一次剛好又觸發變化、或等到下一輪 3 秒後的
          // 自然 burst 才校正。
          if (resizePending) {
            resizePending = false;
            onContainerResize();
          }
          gsap.delayedCall(BURST_INTERVAL, glitchBurst);
          scheduleScanlineMidpoint();
        },
      });

      for (let i = 0; i < steps; i++) {
        tl.to(el, {
          x: () => gsap.utils.random(-2, 2),
          fontSize: () => baseFontSize * gsap.utils.random(0.99, 1.01),
          '--glitch-dx': () => `${gsap.utils.random(0.08, 0.4).toFixed(3)}em`,
          '--glitch-dy': () => `${gsap.utils.random(0.05, 0.3).toFixed(3)}em`,
          duration: STEP_DURATION,
          ease: 'none',
          onStart: () => {
            setFont(i % 2 === 1 ? CODE_FONT : DISPLAY_FONT);
            setScramble(safeScrambleLength);
          },
        });
      }

      // Settle:即時定格回復原狀 + 換上新文案,不對字級做插值動畫——
      // 如果字級也用 tween 淡入新字級,會出現「新文案(可能字數差很多)
      // 已經換上、但字級還在補間過渡到新目標」的空窗期,導致瞬間跑版
      // 溢出容器。用 tl.add() 讓文字內容、字級、字體、色偏全部在同一個
      // 瞬間一起定案,乾淨的「卡一下」也更符合故障感,不需要平滑過渡。
      tl.add(() => {
        setFont(DISPLAY_FONT);
        textIndex = nextIndex;
        baseFontSize = nextBaseFontSize;
        applyText(nextText);
        gsap.set(el, { x: 0, fontSize: nextBaseFontSize, '--glitch-dx': BASE_DX, '--glitch-dy': BASE_DY });
        applyLineOffsets();
      });
    }

    // Idle 掃描線切片:複製當下那一行文字,clip-path 只留一條細帶,
    // 短暫水平位移再彈回、移除。跟真正的 line1El/line2El 是兩個獨立
    // 節點,不會被 burst 的 GSAP tween 影響,burst 期間也不會觸發。
    //
    // 重要:單純複製「同色」文字再位移 1–2px 幾乎不可能被肉眼看見——
    // 純黑色狀跟自己的複製體疊在一起錯位 1–2px,對這麼粗的字重來說
    // 落在人眼可辨識的門檻以下(已用 Playwright 截圖比對驗證過)。改成
    // 給複製體套用跟 burst 同一組紅/藍色偏色票(#49c7d3 / #e16c67)+
    // mix-blend-mode:multiply,錯位處會露出一絲有色的縫隙,才是實際
    // 看得到的訊號。clone 的 width:100% 是相對於 lineEl 自己(inline-block、
    // 縮到剛好貼合文字內容)算的,所以每條切片的水平範圍天生就等於這一行
    // 文字實際渲染的寬度,不管是 TIM 這種短字還是 CREATIVE TECHNOLOGIST
    // 這種長字都一樣貼齊左右邊界,不是套用固定寬度。
    const SCANLINE_COLORS = ['#49c7d3', '#e16c67'];

    function createScanlineSlice(lineEl, lineHeight) {
      const bandHeight = lineHeight * gsap.utils.random(SCANLINE_MIN_BAND_RATIO, SCANLINE_MAX_BAND_RATIO);
      const bandTop = gsap.utils.random(0, Math.max(0, lineHeight - bandHeight));
      const dist = gsap.utils.random(SCANLINE_MIN_OFFSET, SCANLINE_MAX_OFFSET) * (Math.random() < 0.5 ? -1 : 1);
      const duration = gsap.utils.random(SCANLINE_MIN_DURATION, SCANLINE_MAX_DURATION);
      const stagger = gsap.utils.random(0, SCANLINE_MAX_STAGGER);

      // 用 cloneNode(false)(淺層複製,只複製元素本身跟屬性,不含子節點)
      // 再手動塞入純文字——絕對不能用 cloneNode(true)。lineEl 這時候可能
      // 已經有其他還沒移除的切片 clone 掛在身上(同一次連跳序列裡前面
      // 幾個 repeat 建立的),cloneNode(true) 會把那些 clone 也一起深層
      // 複製進來,而且是「clone 包 clone 包 clone」——在單次 burst 內
      // for 迴圈連續呼叫、疊上多次 repeat、兩行各自獨立觸發的情況下,
      // DOM 節點數會指數爆炸,幾秒內就能讓分頁當掉(已實際發生過)。
      const clone = lineEl.cloneNode(false);
      let directText = '';
      for (const node of lineEl.childNodes) {
        if (node.nodeType === 3) { directText = node.textContent; break; }
      }
      clone.textContent = directText;
      clone.removeAttribute('id');
      clone.classList.remove('glitch-text'); // 不需要 clone 自己再疊一層 ::before/::after 色偏
      clone.style.position = 'absolute';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.margin = '0';
      clone.style.width = '100%';
      clone.style.pointerEvents = 'none';
      clone.style.color = SCANLINE_COLORS[Math.random() < 0.5 ? 0 : 1];
      clone.style.mixBlendMode = 'multiply';
      clone.style.clipPath = `inset(${bandTop}px 0 ${Math.max(0, lineHeight - bandTop - bandHeight)}px 0)`;
      lineEl.appendChild(clone);
      gsap.set(clone, { x: 0 });

      gsap.delayedCall(stagger, () => {
        gsap.to(clone, {
          x: dist,
          duration,
          ease: 'none',
          onComplete: () => {
            gsap.to(clone, {
              x: 0,
              duration: duration * 0.6,
              ease: 'none',
              onComplete: () => clone.remove(),
            });
          },
        });
      });
    }

    // 一次觸發同時生成 3–6 條切片,各自獨立的 Y 位置/方向/位移距離/
    // 觸發時間差(0–30ms),不是單一一條窄帶在動,分散在文字上中下
    // 同時出現,故障感才夠明顯。
    function scanlineBurst(lineEl) {
      const rect = lineEl.getBoundingClientRect();
      const lineHeight = rect.height;
      if (lineHeight <= 0) return;
      const count = gsap.utils.random(SCANLINE_SLICES_MIN, SCANLINE_SLICES_MAX, 1);
      for (let i = 0; i < count; i++) {
        createScanlineSlice(lineEl, lineHeight);
      }
    }

    // 觸發當下不是只跳一次,而是連續 3–6 次快速連跳(每次間隔
    // 30–60ms,整體約 0.06–0.3 秒),每一下都重新呼叫 scanlineBurst
    // 獨立隨機決定切片數量/位置/方向,不是同一組參數重複播放同一個
    // 畫面。每一下觸發前都重新檢查 burstActive,避免整個連跳序列
    // 跨到文案 burst 開始的瞬間還繼續疊加效果。
    function scanlineBurstSequence(lineEl) {
      const repeats = gsap.utils.random(SCANLINE_REPEATS_MIN, SCANLINE_REPEATS_MAX, 1);
      let cumulativeDelay = 0;
      for (let i = 0; i < repeats; i++) {
        gsap.delayedCall(cumulativeDelay, () => {
          if (!burstActive) {
            scanlineBurst(lineEl);
          }
        });
        cumulativeDelay += gsap.utils.random(SCANLINE_REPEAT_GAP_MIN, SCANLINE_REPEAT_GAP_MAX);
      }
    }

    // 掃描線的觸發時機改成:每次文案 burst(紅藍錯位)結束到下一次
    // burst 開始這段固定 BURST_INTERVAL(3 秒)的間隔裡,精準取中間點
    // (1.5 秒)觸發——不是自己另外一套隨機頻率的排程。兩行(line1/
    // line2)在這個共同的中間點「一起開始」各自的連跳序列,但序列
    // 內部(重複幾次、每次幾條切片、Y 位置、方向)還是各自獨立隨機,
    // 兩行同時觸發但呈現完全不同的切片組合。
    let scanlineMidpointCall = null;
    function scheduleScanlineMidpoint() {
      scanlineMidpointCall = gsap.delayedCall(BURST_INTERVAL / 2, () => {
        if (!burstActive) {
          scanlineBurstSequence(line1El);
          scanlineBurstSequence(line2El);
        }
      });
    }

    // 頁面一載入就立刻跑一次故障(不是先顯示乾淨的 TIM SHIH、等
    // BURST_INTERVAL 之後才第一次觸發),讓使用者一進頁面先看到系統
    // 故障感,亂碼結束再穩定成 TIM SHIH——沿用 glitchBurst 本身完整的
    // 亂碼/色偏邏輯,只是把「開場」這次的觸發時機從 delayedCall 改成
    // 立即執行,並強制 settle 回索引 0(見 glitchBurst 的 forcedNextIndex
    // 參數說明)。
    glitchBurst(0);
    scheduleScanlineMidpoint();

    return () => {
      resizeObserver.disconnect();
      if (scanlineMidpointCall) scanlineMidpointCall.kill();
      setFont(DISPLAY_FONT);
      applyText(TEXTS[textIndex]);
      gsap.set(el, { x: 0, fontSize: baseFontSize, '--glitch-dx': BASE_DX, '--glitch-dy': BASE_DY });
      gsap.set([line1El, line2El], { x: 0 });
    };
  });
})();
