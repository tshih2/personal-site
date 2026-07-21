# Tim Shih Portfolio — 專案設計系統

純 HTML/CSS/JS(Tailwind CDN + GSAP),沒有框架、沒有 build step。這份文件記錄目前已定案的設計系統,之後任何新頁面/新元件都應該延續這套規則,除非 Tim 明確要求改變。

**核心原則:這個網站要像一個系統,不是一堆各自獨立的頁面。** 加新東西之前,先檢查這份文件跟 `theme.js`/`style.css` 有沒有現成的顏色、字體、間距、元件慣例可以套用;如果現有規則真的無法表達需求,才討論要不要擴充規則——而不是為了單一頁面的需求另外生一份寫死的樣式。同一個角色(標題、標籤、卡片、分隔線⋯⋯)不管出現在哪一頁,都應該用同一套答案。

**這個專案同時有 Claude Code 跟 Codex 在用**:根目錄的 `CLAUDE.md` 是 Claude Code 對應這份文件的規則檔,內容應該保持跟這份 `AGENTS.md` 一致(除了工具名稱的自我指涉)。修改這份文件裡的規則時,記得檢查 `CLAUDE.md` 是否也要跟著更新,避免兩邊的規則兜不起來。

## 檔案結構

專案是純 HTML 在根目錄,共用的 JS/CSS/資料分別收在 `js/`、`data/`、`css/` 三個子資料夾——這是 2026-07-08 整理過的結構,新檔案要照這個分類放,不要又把 `.js`/`.css` 檔案散在根目錄。

- `index.html` — 首頁,捲動敘事是 Hero → All Works → About → Resume → Footer(見下面「首頁捲動敘事:Hero / About / Resume / Footer」);All Works 區塊底下的 WORKS/BLOG 是同一個 grid 容器的分頁切換,不是路由跳轉(見下面「首頁 WORKS/BLOG 分頁切換」)
- `vision-control-rewritten.html` — VisionControl.AI 的 case study 頁,是一個薄殼:只負責載入 `js/case-study-template.js` + `data/data-vision-control-rewritten.js`,呼叫 `renderCaseStudyPage()`。**Case study 頁面一律用「作品名稱」命名,不要用 `work-detail` 這種通用命名——每個作品各自對應一個資料檔跟一個殼,檔名要能一眼看出是哪個作品。**(舊版 `vision-control.html` 已移除,被這份重寫版取代)
- `mpaa.html` — The Mary Pickford Arts Alliance 的 case study 頁,同樣是薄殼,載入 `data/data-mpaa-new.js`,結構跟 `vision-control-rewritten.html` 完全一致
- `js/case-study-template.js` — **Case study 頁面的樣板引擎**,吃一個資料物件、動態生成整個三欄版面(見下面「Case study 樣板系統」)
- `js/works-grid.js` — 首頁 WORKS/BLOG 分頁切換引擎(見下面「首頁 WORKS/BLOG 分頁切換」),`initWorksGrid()` 吃一組 tabs 設定,動態渲染 `#worksGrid` 卡片、處理 nav 點擊/網址 hash/瀏覽器上一頁下一頁
- `js/theme.js` — **所有頁面共用的 Tailwind 設計 token(顏色 + 字體家族)**,新頁面一律載入這個檔案,不要自己重新定義一份顏色/字體
- `js/script.js` — 首頁 Hero 即時時鐘
- `js/hero-glitch.js` — 首頁 Hero 大字(TIM SHIH / 文案輪播)的故障感動畫:文字亂碼化、紅藍色偏、字級動態計算(含完整的溢出安全檢查,見下面專門一節)
- `js/hero-marquee.js` — 低調亂碼跑馬燈,寫成 `initMarquee(fieldId, options)` 可重複呼叫的工廠函式(不是單一頁面寫死的邏輯),目前 Hero 跟 About 各呼叫一次、各自傳入不同的顏色/透明度參數(見下面「首頁捲動敘事」)
- `js/scroll-reveal.js` — 通用的「元素是否隨某個目標區塊進出視窗而淡入/淡出」IntersectionObserver 工具,靠 `data-reveal-on`(CSS selector)、`data-reveal-invert`、`data-reveal-translate`、`data-reveal-pointer-events` 這組 data 屬性驅動,不用寫 JS 就能讓任何元素套用同一套顯示邏輯(目前用在浮動 nav 跟 Hero 的往下滑動提示)
- `js/scroll-hint.js` — Hero 的往下滑動提示箭頭(位移 + 閃爍兩層獨立 GSAP tween、點擊捲動到 `#works`),顯示/隱藏邏輯委託給 `js/scroll-reveal.js`,不是自己另外寫一套
- `js/accordion.js` — 通用手風琴(`initAccordion(ids, options)`),邏輯跟 `js/case-study-template.js` 的 `initAccordions()` 是同一套(GSAP 高度展開/收合 + 互斥),差別是不綁死 case study 的資料格式,靠 `#accordionHeader-<id>`/`#accordionContent-<id>` 命名慣例運作,目前用在首頁 Resume 區塊
- `js/hero-scroll-fade.js` — GSAP ScrollTrigger 的 pin + scrub 效果集中在這裡(見下面「首頁捲動敘事」專門一節)
- `data/data-vision-control-rewritten.js` — VisionControl.AI 目前上線使用的資料物件,採用目前推薦的預設資料格式(`content` 陣列 + `media[].afterParagraph` 捲動同步,見下面「Case study 樣板系統」)
- `data/data-mpaa-new.js` — The Mary Pickford Arts Alliance 目前上線使用的資料物件
- `data/data-template.js` — 新增作品時複製這份改名用的空白範本,已更新成目前推薦的預設格式(`content` 陣列 + `media[].afterParagraph`),所有 key 都在、值留空
- `data/data-works.js` — 首頁 WORKS 分頁的卡片清單(見下面「首頁 WORKS/BLOG 分頁切換」)
- `data/data-blog.js` — 首頁 BLOG 分頁的卡片清單,目前是佔位假資料,Tim 之後提供真正文章清單時直接替換這個檔案即可
- `css/style.css` — 全站共用的少量原生 CSS:防止橫向捲動的 `html,body` 規則、case-study 標題列共用的 `.col-header`、`.dot-grid`/`.dot-grid-dark`(淺色/深色兩版圓點網格背景)、`.glitch-text`(紅藍色偏)
- `Img/` — 網站實際會載入的媒體素材;每個作品如果素材較多,底下開自己的子資料夾(例如 `Img/VisionControl_Sources/`、`Img/MPAA_Sources/`),依內容再分子資料夾(如 Overview、Product Strategy)
- `reference/` — 純設計參考用的情緒板/截圖,不是網站會載入的東西,已排除在 git 版控外(見 `.gitignore`);跟特定作品內容擷取有關的原始素材(例如網頁 scrape 下來的 HTML/JSON)歸進對應的 `Img/<作品>/` 資料夾,不要堆在 `reference/` 裡混淆用途

## Case study 樣板系統

**新增一個作品的 case study 頁,不要複製貼上既有頁面改內容——複製 `data/data-template.js` 改名成 `data/data-<作品名>.js`,照裡面的空白格式填(完整欄位說明見 `js/case-study-template.js` 檔案開頭的註解),然後複製 `vision-control-rewritten.html` 當殼(換 `<title>`、載入的 data 檔名,並依作品名稱取一個對應的檔名,例如 `data-spider-lily.js` 就對應 `spider-lily.html`,不要沿用 `work-detail` 這種通用命名),讓 `renderCaseStudyPage()` 去生成整個頁面。**

資料物件至少要有:`title`、`category`、`intro`、`author`、`backHref`、`overview`(見下面完整格式)、`sections`(陣列,任意數量的 `{title, content, media?}`,這些就是底下的手風琴區塊,不是寫死 User Research/Process/Reflection 這幾個名字)。

版面邏輯(三欄結構、OVERVIEW 跟手風琴共用的展開/收合互動、hairline、`.col-header` 固定高度對齊)全部在 `js/case-study-template.js` 裡,不要因為某個作品需要客製化就把邏輯抄一份出去修改——如果樣板真的無法表達某個作品需要的東西,先跟 Tim 討論要不要擴充資料格式(例如加一個新的 media type),而不是繞過樣板直接寫死 HTML。

### 預設渲染邏輯:左右分欄 + 媒體欄獨立捲動(scroll-snap)+ 圓點指示器

**這是 `case-study-template.js` 目前的系統預設規則,適用於 OVERVIEW 跟任何一個 section——不是 Research & Problem Framing 這種特定內容的專屬寫法,而是「只要有 `media`,就自動套用同一套邏輯呈現」,不需要每個 section 各自客製化程式碼。**

`overview` 跟 `sections[]` 裡每一項的格式完全一樣:

```js
{
  content: [                     // 陣列,每個字串是獨立一段(可含 <strong>子標題</strong>),段數不限
    '<strong>小標題</strong><br><br>這一段的內文……',
    '……下一段……',
  ],
  media: [                       // 可省略。完全沒有素材時整段自動變成純文字單欄版面
    { type: 'image', src, alt },   // src 可以是純字串,也可以是 { desktop, mobile } 物件(見下面說明)
    { type: 'video', src },
  ],
}
```

`buildAccordionBlock()` 依 `media` 是否存在自動選其中一種渲染模式,不需要另外設定開關:

1. **沒有 `media`(或空陣列)** → 純文字單欄版面。
2. **有 `media`(不管幾項)** → 左右分欄:左側媒體欄是它自己獨立的 `overflow-y-auto` 捲動容器,圖片/影片依序垂直排列,每一張都維持原始寬度(填滿媒體欄寬度)/原始長寬比,**不裁切、不縮小塞進共用的固定框**。使用者在媒體欄範圍內滾動滑鼠滾輪/觸控滑動,就是在這個獨立容器裡捲動切換圖片——桌面版套用 CSS `scroll-snap`(`snap-y snap-proximity` + 每張圖 `snap-start`),讓捲動自然吸附到「一次剛好看到一張」,不用自己寫 JS 判斷捲動距離對應第幾張。**用 `proximity` 不是 `mandatory`**——同一個作品裡不同素材的長寬比可能差異很大(踩過的坑:MPAA 的 OVERVIEW 參考素材是 16:9 影片,但某張 section 圖片是 4.9:1 的扁平橫幅圖,兩者換算出來的高度天差地遠),`mandatory` 會強制每次捲動都吸附到最近的圖片,矮圖下方大片空白區域捲起來時瀏覽器會「用力拉回」吸附點,體感卡頓;`proximity` 只在捲動自然接近吸附點時才吸附,不會硬拉,仍保留「捲一段大致停在一張圖」的效果,但不會卡。有兩張以上圖片時,底下會有一列**圓點指示器**(顏色沿用既有色票:目前顯示的用 `bg-ink`、其餘用 `bg-black/15`,只在桌面 `lg:` 顯示),反映「媒體欄自己捲到第幾張」,點擊可以讓媒體欄捲動(`scrollTo` + smooth)到對應那張圖。右側文字欄是完全獨立的另一個捲動軸(如果內容夠長),兩者互不影響。

**每個區塊(OVERVIEW、每個 section)各自獨立算自己的框高,不是全站共用一個值。** `initMediaColumnHeights()` 對每個有 `media` 的區塊,量它自己媒體欄裡所有已載入項目渲染高度的**最大值**(不是中位數或平均——這裡踩過一次坑:一開始用中位數,結果一個 section 裡如果同時有很矮跟很高的圖(例如 130px/220px/410px 混在一起),中位數會落在中間值附近,那張最高的圖反而會超出框、變成需要在自己的「一頁」裡再往下捲才看得完,違背 scroll-snap「捲一次剛好看到一張完整圖片」的核心體驗;改用最大值可以保證這個區塊裡任何一張圖都不會被裁切、都不需要內部再捲動,代價是比較矮的圖片下方會有比較明顯的空白,但寧可留白也不要有圖片被截斷),設成這個區塊自己的 `--accordion-max-h-<id>` CSS 變數,每個區塊各自讀自己的變數,不會互相干擾。**這是取代舊版「全站共用一個 `--accordion-max-h`,由 OVERVIEW 第一項素材決定」設計的正式做法**——舊版踩過的坑:MPAA 的 OVERVIEW 參考素材是 16:9 影片,套到其他 section 明顯比例不同的圖片上時,那些圖片只佔框高一小部分,留下大片空白,而且同一個框裡圖片高度落差太大,scroll-snap 捲動切換時也感覺卡頓。改成每個區塊各自量、各自設定後,只要同一個區塊「自己」內部的素材長寬比夠接近,這個區塊就會自動 fit 得剛好;區塊「自己」內部如果本身就混雜差異很大的素材(例如同一個 section 裡有一張特別扁的橫幅圖),那張離群素材雖然不會被截斷,但比較矮的圖片還是會有明顯空隙,這是無法避免的(除非裁切)。

這個理論上算出來的高度還會再夾一個視窗高度上限(`window.innerHeight - 192`,192px = 自己的標題列 96px + 至少露出下一個標題列 96px,沿用「展開時至少要看到下一個標題」那條規則的數字)——避免某個區塊剛好都是很長的直式素材時,展開後把下一個區塊的標題列擠出視窗外。

新作品只要給 `media` 就會自動套用這套捲動同步呈現,不需要額外欄位;沒有素材時才落回模式 1。**這一套邏輯是共用的 `buildAccordionBlock()`/`buildMediaColumn()`/`initMediaCarousel()`,OVERVIEW 內部也是呼叫這幾個函式,不是另外寫一份——修改行為時兩種模式都要一起確認沒有壞掉。**

**這一版拿掉了「文字欄捲動位置驅動圖片切換」的設計**(`afterParagraph` 欄位、GSAP `autoAlpha` 交叉淡出、`object-contain` 塞進共用固定框——這些都已移除,不要再沿用)。實測踩到兩個問題:文字內容不夠長時完全沒有捲動空間可以觸發切換(OVERVIEW 曾經因此永遠停在第一張圖);文字內容剛好夠長時,捲動位置換算成圖片 index 的門檻很難抓準,容易跳過某張圖。`object-contain` 塞共用固定框也會把圖片縮小,不符合「維持原始尺寸」的需求。媒體欄自己獨立捲動 + CSS scroll-snap 直接解決這兩個問題,不依賴文字內容的長度或捲動位置,原生行為也比自己算捲動門檻更穩定。如果之後想要「文字捲到某段落時媒體欄也連動切換」這種加分效果,要當成疊加在這套機制之上的獨立功能討論,不要回頭改成文字驅動媒體。

**舊資料格式相容性**:`content` 給字串(不是陣列)一樣會被當成單一段落接受;`overview` 用 `paragraphs`(不是 `content`)、media 放在頂層 `data.media`(不是 `overview.media`)也一樣支援——這是為了不強迫舊格式的資料檔案跟著改寫。只有新資料檔案需要照上面「預設渲染邏輯」的格式寫。

### 圖片素材:桌面版/手機版分開準備(`src: { desktop, mobile }`)

**新作品的圖片素材,建議每張都同時準備桌面版跟手機版兩份**,因為桌面版的橫向裁切在窄螢幕上常常擠壓到看不清楚內容,手機版通常需要更方正/直向的裁切。media 項目的 `src` 欄位可以是:

- **純字串**——同一個檔案兩種斷點都顯示。沒有另外準備手機版素材時就這樣寫,不是強制規定每張圖都要兩份,樣板會正確處理只有桌面版的情況,不會報錯或留白。
- **`{ desktop: '桌面版路徑', mobile: '手機版路徑' }` 物件**——`lg:` 以上顯示 desktop、以下顯示 mobile。

切換邏輯是**純 CSS**,不是 JS 偵測視窗寬度動態換 `src`:`buildMediaItem()` 遇到物件格式的 `src` 時,會渲染兩個 `<img>`(或 `<video>`),分別套用 `hidden lg:block`(只在桌面顯示)跟 `block lg:hidden`(只在 lg: 以下顯示)。這樣寫的理由——resize 不需要額外處理圖片重新載入,兩種斷點之間也不會有短暫顯示錯誤版本的問題,符合「能用 CSS 表達就不要用 JS」的原則。桌面版那個 `<img>` 額外加 `data-variant="desktop"`,讓 `initMediaColumnHeights()` 量測主圖高度時能明確排除 Mobile 版本(Mobile 版在桌面寬度下是 `display:none`,量到的高度會是 0)。

**檔名慣例**:Mobile 版本的檔名 = 桌面版原檔名 + `" - Mobile"` 後綴(副檔名前面),例如 `BTPC — Debug the Pipeline One Layer at a Time.png` 對應 `BTPC — Debug the Pipeline One Layer at a Time - Mobile.png`。實際檔名裡這個後綴前面的空格數量不一定統一(踩過的坑:同一批檔案裡有的是一個空格、有的是兩個空格),寫資料檔的路徑字串時要照資料夾裡實際存在的檔名逐字對照,不要自己假設空格數量。

### 全圖檢視 lightbox

**每一張 `type: 'image'` 的素材都可以點擊(或鍵盤 Enter/Space)開啟全螢幕檢視**,裡面有左右箭頭可以切換到「同一個媒體欄」裡的上一張/下一張圖片(循環,不會卡在頭尾)——導覽範圍刻意限定在同一個區塊自己的 `media` 陣列,不是跨區塊的全站清單,跟圓點指示器/scroll-snap 已經建立的「每個區塊是獨立一組」心智模型一致。影片跟佔位框不會開啟 lightbox,只有真正的圖片素材才有。

Lightbox 裡一律顯示 **desktop 版本**的圖片,不管目前是哪個斷點點擊的——lightbox 的用途是看清楚細節,desktop 版通常裁切較少、細節較完整,手機版縮圖拿來放大反而可能不一致,所以不隨斷點切換。

整頁只建一份 lightbox DOM(`buildLightbox()`,附加在 `#fold` 旁邊),不是每張圖各自一份;點擊圖片時當場從 DOM 查詢同一個 `#mediaColumn-<id>` 底下所有帶 `data-lightbox-src` 的 `.media-item`,組成當次導覽清單,不是頁面載入時就快取一份——這樣不需要另外維護一份跟 `collectBlocks()` 重複的資料結構。深色背景直接用 Tailwind 內建的 `bg-black`/`text-white`,比照 CLAUDE.md 既有的 footer 純黑背景慣例,不為了這個全新的深色情境獨立定義新色票 token。換圖跟開關都用 GSAP `autoAlpha` 淡入淡出,不是硬切,跟全站其他淡出淡入的慣例一致。支援 `Escape` 關閉、方向鍵切換,關閉時焦點會還給原本點擊的那張圖(基本鍵盤可用性,但沒有做完整的 focus trap,跟這個專案目前其他互動元件的無障礙投入程度一致,不算過度工程)。

新頁面的 `<head>` 應該固定包含這個載入順序:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="js/theme.js"></script>
<script>tailwind.config = window.SITE_THEME;</script>
<link rel="stylesheet" href="css/style.css">
```

## 顏色 token(定義在 `js/theme.js`)

| Token | 色碼 | 用途 |
|---|---|---|
| `ink` | `#111111` | 主要文字(標題、卡片標題、內文主色) |
| `muted` | `#706F6A` | 次要文字(說明文字、meta 資訊、design type) |
| `label` | `#878787` | Section 標籤/eyebrow 文字(比 muted 更淡一階) |
| `cream` | `#F9F7F2` | 暖米白——Hero 區塊、work-detail 整頁背景 |
| `stone` | `#F2F2F0` | 中性灰白——一般內容區(All Works grid)背景、浮動 Nav 背景 |
| `card` | `#F9F9F9` | 卡片色塊底色 |

不要新增顏色前先檢查這張表——大部分情境應該都能用現有 token 表達。footer 的純黑背景直接用 Tailwind 內建的 `bg-black`/`text-white`,不需要獨立 token。

## 字體(Google Fonts,四個家族)

| Tailwind class | 實際字體 | 用途 |
|---|---|---|
| `font-unbounded` | Unbounded(Black/ExtraBold) | 巨大展示 wordmark、case-study 大標題 |
| `font-archivo` | Archivo Black | 首頁 Hero 的日期/時間數字 |
| `font-geistmono` | Geist Mono | **全站唯一的等寬字體。**所有「功能性 UI」文字都用這個:utility bar、index/version 列、nav 連結、section 標籤(如「[ALL WORKS]」、case-study 的 Overview/手風琴標題)、卡片標題、meta 資訊 |
| `font-geist` | Geist(Regular/SemiBold) | 一般內文、段落、次要說明文字 |

Geist Mono 已經統一成全站唯一的等寬字體,不要再用 Tailwind 內建的系統 `font-mono`(Menlo/Consolas 那組)——這是舊版本的過渡狀態,已經定案改掉了。任何「小型 UI 文字/標籤/標題」需要等寬感的地方,一律用 `font-geistmono`。

Unbounded 字重依情境不同:巨大 wordmark(首頁 Hero/Footer)用 `font-black`(900);case-study 標題用 `font-extrabold`(800,刻意降一階,因為在較小的字級下 900 太粗)。新頁面如果也要用 Unbounded 大字,先想清楚字級多大再決定字重,不要預設套 900。

## 字級與字距慣例

- 所有「功能性小字」(label、meta、utility bar)統一用 `text-xs`(12px),不要用 13px 這種不在 Tailwind 預設刻度上的任意值。
- 巨大展示字級(hero wordmark、日期數字)一律用 `clamp()` 做響應式縮放,不要寫死 px。換算公式:`vw 係數 = 目標px ÷ 14.4`(以 1440px 參考寬度反推),`floor` 值抓一個手機上不會爆版的安全下限。
- 字距(letter-spacing)用 em,換算公式是 `字距px ÷ 字級px = em 值`(不是隨便挑一個值)。目前的慣例:
  - Utility bar / index-version 列這類「品牌感」等寬文字:`tracking-[0.167em]`(寬)
  - Case-study 面板裡的功能性標籤(Overview/手風琴標題、作者資訊):`tracking` 不設(0),因為這是 Tim 對照 Figma 精確數字後的決定——**注意這跟首頁「[ALL WORKS]」用的 `tracking-[0.125em]` 不一樣**,兩者是同一種「section eyebrow 標籤」的角色,但目前刻意維持不同字距,分屬兩個各自定案的脈絡(首頁是通用 grid 標籤,case-study 是 Figma 精確稿)。如果之後要統一,先跟 Tim 確認要往哪邊靠,不要自己選一邊改掉。
  - 巨大 wordmark:`tracking-[-0.064em]`(負值,展示字級常見的收緊處理)

## 版面與間距

- 任何「大型、桌面基準」的間距數字(如 Figma 給的 120px 留白)都要轉換成 `clamp()`,不要在所有螢幕寬度下寫死同一個 px。小型間距(卡片內距、grid gap、段落間距)可以直接用 Tailwind 預設刻度(`gap-6`、`mt-10` 這種),不需要 clamp。
- 版面寬度不要寫死(不要 `w-[1344px]` 這種),用「總寬度 − 左右邊界」或 `max-w-[...]` + `mx-auto` 表達。
- Grid 欄數要 responsive:手機 1 欄、平板 2 欄、桌面 3 欄(`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`,首頁 All Works grid 用的斷點)。

## 動態/響應式文字的溢出安全檢查

Hero 大字(`js/hero-glitch.js`)這類「字級/內容都會動態改變」的元件,踩過好幾次溢出的坑,教訓整理成以下規則,新頁面如果也有類似的動態文字(字級隨內容/容器寬度變動、或有隨機亂碼/跑馬燈這類生成文字),都要延續這套做法:

- **量測邊界一定要跟其他 UI 列共用同一套基準,不要另外定義一份寬度計算。** 全站的水平邊界統一是 `--page-margin-x`(見下面「版面與間距」),量「這個元件現在有多少可用寬度」時,要用「容器 `clientWidth` 扣掉左右 padding」這個算法(對應 `js/hero-glitch.js` 的 `getAvailableWidth()`),不要直接量整個 viewport 寬度或另外寫一套。這樣算出來的安全字級才會跟 utility bar/版本列這些用同一個 `--page-margin-x` 的其他列真正對齊,不會發生「這個元件自己以為沒溢出,但跟旁邊那排的邊界線對不上」的情況。用 Playwright 驗證時同理:要抓「內容實際邊緣」(例如 utility bar 裡最後一個 `<span>` 的 `getBoundingClientRect().right`),不要抓外層還帶 padding 的容器本身,否則會多算一段 padding、誤判成安全。
- **任何「先算完字級/尺寸、才疊加隨機效果(如亂碼字數)」的地方,隨機效果本身也要通過同一套邊界檢查,不能算完之後才疊上去繞過檢查。** 亂碼字數如果是跟字級無關的獨立隨機值,兩者疊在一起實際渲染寬度可能遠超容器——安全上限要用「這次實際會套用的字級」反推「這個字級下最多能塞幾個字元」,不是分開各自夾在自己的安全範圍內就假設疊加後也安全。
- **用隨機字元集(如亂碼)估寬度時,不要用「隨機抽一段樣本量平均寬度」——字元集寬窄差異大時,平均值會被抽樣運氣影響,可能低估真正的寬度需求。** 改成量測字元集裡「單一最寬字元」的寬度(只需算一次、cache 起來給整個頁面共用),用這個當作每個字元的保底寬度上限,不管實際隨機抽到哪個組合,寬度都不可能超過用這個值算出來的長度上限——這是用保證值取代機率賭注。
- **容器尺寸變化的監聽,優先用 `ResizeObserver` 觀察容器本身,不要只依賴 `window` 的 `resize` 事件。** `resize` 事件不保證每一次尺寸變化都會觸發,瀏覽器在渲染負載較重時(同一頁面有多個動畫同時在跑)可能合併/跳過部分事件,導致某幾次變化完全沒有對應的重新校準。`ResizeObserver` 直接綁定渲染引擎自己的版面尺寸帳本,沒有這種事件遺失的風險。
- **如果元件有「動畫進行中不應該被重新校準打斷」的狀態(如故障動畫、轉場),被這個狀態擋下的尺寸變化不能就這樣憑空消失——記一個 pending flag,狀態結束時立刻補做一次校準**,不要假設「反正等下一次事件或下一輪動畫自然會校正」,那段空窗期就是使用者實際看得到的溢出。
- **用 Playwright 驗證「尺寸變化後有沒有正確反應」時,commanding resize 之後要留至少一次 animation frame 的 settle 時間再量測(例如 `await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))`),不要在下完 resize 指令後零延遲立刻量。** `ResizeObserver`/`resize` 事件的 callback 本來就是非同步、批次在下一個影格才觸發,零延遲量測到的「溢出」其實是量測方法本身的假訊號,不是真的 bug——這個坑已經在這次調查中親自踩過,浪費不少時間才確認是測試手法問題。真的要測「使用者體感」,量測前留下 settle 時間才是對照使用者實際感知的方式。

## 首頁捲動敘事:Hero / About / Resume / Footer

首頁的捲動順序是固定的:**Hero(淡出)→ All Works → About(黑底+圓點+跑馬燈+wordmark+聯絡資訊,pin 住) → Resume+Footer(同一個 pin 內三段式交叉淡出淡入)**。這一節記錄這套機制的規則,新增/調整任何 pin 住的捲動效果都要延續這裡的做法,不要另外發明一套。

- **全站共用同一套「pin + scrub」機制,定義在 `js/hero-scroll-fade.js`,不要在別的檔案裡各自寫一份 ScrollTrigger。** 目前有兩處套用:(1) Hero 大字 `#heroText` 淡出(單純淡出,`pin:true` 固定 `<header>` 一個視窗高度的捲動距離);(2) About 區塊三段式交叉淡出淡入(wordmark 淡出 → 姓名/電話/email 位移重新編排 → Resume 淡入 → Footer 淡入,全部 pin 在 `#about` 一個區塊內)。兩處都是「建一個 `gsap.timeline()`,把多個 tween 用時間軸座標(0–1)安排重疊/交錯,再用 `ScrollTrigger.create({ trigger, start:'top top', end:'+=N%', pin:true, scrub:true, animation: tl })` 把 timeline 綁到捲動進度」的同一個模式。
- **淡出淡入一律用 GSAP 的 `autoAlpha`,不要用單純的 `opacity`。** `autoAlpha` 在數值到 0 時會自動加 `visibility:hidden`,避免「視覺上淡出了,但底下的按鈕/連結還能被點到或被 tab 鍵取得焦點」——這個專案有好幾個淡出區塊本身是互動元件(手風琴按鈕、社群連結),這個坑很容易忽略。
- **timeline 裡不要留任何「動畫已經跑完、但還要再撐一段捲動距離才放開 pin」的空白 hold 段。** 早期版本在最後一個 tween 後面多接了一段 `duration:0.25` 的 filler 想留緩衝時間,結果使用者的體感是「畫面明明已經定格了,卻還要再多捲一段空白距離」才會看到下一個區塊——已用 Playwright 精確量到這個落差。正確做法:讓 timeline 的總長度直接由**最後一個有意義的 tween**的結束時間決定(不額外加 filler),GSAP scrub 會把這個總長度對應到 pin 的 `end`,「動畫跑完」跟「pin 解除」永遠是同一個時間點。
- **如果 pin 住的區塊是全站最後一個區塊(後面沒有其他內容),不需要刻意計算「捲到底剛好放開 pin」——這件事會自動成立。** 因為 pin-spacer 的高度就是頁面在該區塊「捲得到的最大距離」的唯一來源,只要 timeline 本身沒有多餘 hold(見上一條),pin 的 `end` 自然就等於 `document.body.scrollHeight` 的極限,使用者捲到真正的頁面底部時動畫剛好也定格完成,不會有多餘的可捲動空白。這個特性已用 Playwright 精確驗證過(`pin 的 end` 與 `maxScroll` 兩個數字完全相等)。
- **一個 ScrollTrigger 的 `end` 如果依賴「後面還有多少內容可以繼續捲」,要確認那段內容真的夠長,不然 end 條件永遠達不到、動畫會卡在半途。** 踩過的坑:原本 Resume 淡出的 `end` 設在 `'bottom top'`(內容捲到視窗頂端才算數),但底下接的 `<footer>` 遠矮於一個視窗高度,頁面實際可捲動的距離根本不夠長,導致動畫永遠卡在半淡出的中間狀態。修法是把 `end`/`endTrigger` 綁在**保證捲得到的參考點**(例如頁面最底部元素的 `'bottom bottom'`),不要綁在一個可能捲不到的位置。
- **背景圖層(`.dot-grid`/`.dot-grid-dark` 圓點網格)、跑馬燈、跟疊在它們上面的內容文字,是三個獨立圖層,調整可讀性時不要混在一起處理。** 曾經為了讓 Resume 文字在跑馬燈背景下更清楚,直接在文字容器上加一層 `bg-black/60` 半透明遮罩——結果因為這層遮罩蓋住了下面**所有**東西(跑馬燈跟圓點背景都在它下面),圓點背景也跟著被誤傷變淡。正確做法是只調暗需要變淡的那個圖層本身(例如把跑馬燈**容器自己的** `opacity` 用同一條 timeline 往下調,不要蓋一層遮罩去間接影響它),圓點背景維持在自己的 CSS 屬性上,不受任何 timeline 影響。
- **元素從一種版面邏輯(如橫向多欄分散)動畫過渡到另一種版面邏輯(如垂直堆疊靠左)時,不要整個容器共用同一個位移——容器內每個子元素各自的移動距離通常都不一樣(有的要左移很多、有的只要下移一點),要各自獨立的 x/y tween。** 落點座標不要用猜的或寫死的 px,改成在 DOM 裡放一個永遠 `opacity:0`、`aria-hidden="true"` 的隱藏「範本」,照目標版面的最終樣子排好(這個範本本身也同時用來在目標容器裡佔版面空間,讓後面的內容自然被推到正確位置),再用 `getBoundingClientRect()` 量測每個動畫元素跟它在範本裡對應元素的座標差,當作 tween 的目標值。量測前記得先把來源元素自己的 x/y 重設回 0 再量、量完再還原,不然「量測當下剛好動畫跑到一半」會讓算出來的差值疊加舊的位移量,越量越偏。
- **落點座標的 tween 用函式(`x: () => computeDelta().x`)而不是量一次就寫死的數字,並且在 `ScrollTrigger.create()` 加 `invalidateOnRefresh: true`。** 這樣視窗尺寸改變、版面跟著重排時,GSAP 會在下一次 refresh 重新呼叫這個函式拿新的距離,不會停留在舊尺寸量出來的錯誤位移量。
- **`prefers-reduced-motion: reduce` 的 fallback 不能只是「什麼都不做」,要確認拿掉動畫之後版面本身還是合理的。** 這個專案的 pin+cross-fade 效果依賴多個圖層互相疊在同一塊區域(用 `position:absolute` + `autoAlpha:0` 初始隱藏),如果 reduced-motion 版本什麼都不改,使用者會看到「本來該淡入淡出的內容,現在直接卡死疊在最上層」或「該顯示的內容永遠透明」這類殘留狀態。做法是額外寫一個 `mm.add('(prefers-reduced-motion: reduce)', ...)` 分支,把疊層的元素改回 `position:relative`(讓瀏覽器用一般文件流依序排列)、該顯示的直接設 `autoAlpha:1`,任何「只服務動畫、不服務 fallback 版面」的隱藏範本/占位元素也要在這個分支裡收掉它佔的空間(`height:0`/`marginBottom:0`),不然 fallback 版面會多出一段莫名其妙的空白。

## 首頁 WORKS/BLOG 分頁切換

底部浮動 nav 的 WORKS 跟 BLOG,**是同一個 `#worksGrid` 容器的兩種資料來源切換,不是兩個頁面之間的路由跳轉**——概念上比照 Instagram 個人主頁貼文/珍藏分頁切換的體驗,不是點連結跳到 `blog.html`。HOME/ABOUT 維持原本各自的捲動行為(HOME 捲回 Hero 頂端、ABOUT 捲到 About 區塊「完成態」),只有 WORKS/BLOG 屬於這套機制。

**運作方式**(`js/works-grid.js` 的 `initWorksGrid()`):
- 底部 nav 的 WORKS/BLOG 連結加 `data-tab-link="<tab key>"`,由 `initWorksGrid()` 統一攔截 click(`preventDefault()`),原地換 `#worksGrid` 的內容 + `#worksHeader` 的標題文字,**不會觸發真正的頁面導覽/reload**。
- 兩個分頁共用同一份卡片樣板(`buildWorkCard()`),資料分別放在 `data/data-works.js`/`data/data-blog.js`(格式:`{ title, category, href, thumbnail? }`,`thumbnail` 可省略,沒有縮圖時卡片維持 `bg-card` 色塊當佔位框)——新增/修改任一個分頁的內容只需要改對應的資料檔,不要回頭去 `index.html` 手寫卡片 HTML。
- 內容切換用 GSAP `autoAlpha` 淡出→換內容→淡入,時長 300ms——沿用這個頁面卡片 hover(`duration-300`)、底部 nav 淡入淡出(`transition duration-300`)已經定案的節奏,不是另外挑一個新數字。
- **網址會用 `history.pushState` 更新 hash**(WORKS 是預設分頁,網址不帶 hash;BLOG 是 `#blog`)——這個過程不觸發真正的頁面導覽,純粹是 JS 讀取這個狀態去決定顯示哪個資料集。這樣重新整理或分享連結都能正確停在對應分頁;也監聽了 `popstate`,瀏覽器上一頁/下一頁一樣會正確換回對應分頁的內容,不會出現「網址列顯示的分頁跟畫面對不起來」的情況。
- 點擊 WORKS/BLOG 後會順便 `scrollIntoView` 捲回 `#works` 容器——使用者點了是想看到對應內容,如果人還停留在頁面其他區塊(例如 About),內容換了但畫面沒捲過去,等於看不到剛剛切換的結果。

**之後如果要新增第三個分頁(或幫某個分頁加子分類)**,延續同一套模式:資料檔案照 `{ title, category, href, thumbnail? }` 格式建一份新的 `data/data-<分頁>.js`,`initWorksGrid()` 呼叫時的 `tabs` 物件多加一個 key,不需要改 `buildWorkCard()` 或分頁切換邏輯本身。

## Responsive 斷點:兩套系統,不要混用

全站目前有兩組彼此獨立的 breakpoint 邏輯,新頁面要先分清楚自己屬於哪一種,不要混用:

1. **卡片 grid(首頁 All Works)**:用 `sm:`/`lg:` 做「欄數」漸進(1→2→3 欄),斷點在標準的 640px/1024px。
2. **Case study 版面(左欄側欄 + 右欄內容)**:預設(手機/平板)整個垂直堆疊成單欄——`intro-col` 是滿寬的一般區塊,右欄自然往下接,整頁跟著瀏覽器捲動。只有到 `lg:`(**1024px**)以上才切成「左欄固定寬度側欄 + 右欄自己捲動」的桌面版面。**這裡刻意選 `lg:` 不是 `md:`——Tailwind 的 `md:` 剛好等於 768px,如果用 `md:`,那平板尺寸會直接落在切換點上變成桌面側欄版,擠壓內容;`lg:` 才能確保手機到平板這段範圍都維持單欄。** 新增任何 case-study 版面的斷點(手風琴的 `max-height` 捲動優先權、intro-col 的寬度/border/`mt-auto`)一律用 `lg:`,不要臨時改用 `md:`。

驗證斷點有沒有生效,不要只看畫面「看起來」對不對——直接用 Playwright 量 `getComputedStyle(el).flexDirection` 或 `getBoundingClientRect()`,在斷點前一個像素(如 1023px)跟斷點本身(1024px)各測一次,確認切換的臨界點精確。

## 元件慣例

- **卡片(All Works grid)**:色塊呈現、不用邊框線,靠 `bg-card` 淺灰底色跟頁面背景做區隔,不要加 `border`。圓角 `rounded-xl`(容器)+ `rounded`(縮圖)。圖片一律 `object-contain`,不裁切。Hover 效果:卡片微放大(`scale-[1.02]`)+ 圖片變暗疊層,兩者都是 `transition` 300ms。
- **Case-study 標題列**:共用 `.col-header`(定義在 `css/style.css`)——固定 96px 高 + 垂直置中,這樣不同區塊不管裡面放純文字還是文字+按鈕,高度天生一致,底下內容才能自然對齊,不需要事後調整某一個的 margin 去湊。**這是這個專案最重要的一條系統規則,之後任何多欄/多區塊版面都要延續這個「固定高度共用標題列」的做法,不要回頭去個別調整每個的 padding。**
- **手風琴(Overview + sections)**:互斥展開(一次最多一個開著,允許全部收合),用 GSAP `gsap.to(el, {height: 'auto' 或 0})` 做展開/收合動畫——GSAP 原生支援 animate 到 `'auto'`,不需要手動量測高度或另外裝 plugin。Case study 頁面的邏輯統一寫在 `js/case-study-template.js` 的 `initAccordions()`,新增區塊不需要另外寫開關邏輯,資料物件的 `sections` 陣列會自動被納入同一套互斥邏輯。**不屬於 case study 資料格式的手風琴(例如首頁 Resume 區塊)改用 `js/accordion.js` 的通用版 `initAccordion(ids, options)`**——同一套「互斥展開 + `height:auto`」邏輯,但不綁 case study 的資料物件,靠 `#accordionHeader-<id>`/`#accordionContent-<id>` 命名慣例運作,呼叫時傳一組 id 陣列跟 `{ defaultOpenId }`。兩份手風琴邏輯目前刻意分開(一個服務 case study 的資料驅動渲染、一個服務手寫 HTML 的通用場景),新增手風琴前先判斷屬於哪一種情境,不要把 `initAccordion` 硬套進 case study 樣板、或反過來把 case study 邏輯搬進手寫頁面。
- **手風琴內容區的最大高度,有 media 的區塊用動態量測的 `--accordion-max-h-<id>` CSS 變數(每個區塊各自一個,不共用),純文字區塊直接用寫死的 `calc(100vh-192px)`。** 兩者分開處理是刻意的,不是不一致:有 media 的區塊需要「固定高度」(不是 max-height)才能讓左右分欄的 `h-full` 鏈正常運作(見 `buildTwoColumnShell()` 的完整說明),這個固定值只能用 JS 動態量測,因為每個區塊自己的素材長寬比不一樣;純文字區塊只是單欄 `max-height`,沒有 `h-full` 鏈的問題,直接用 CSS 公式最簡單、也不用等 JS 執行。`js/case-study-template.js` 的 `initMediaColumnHeights()` 對每個有 media 的區塊,量它自己所有媒體項目渲染高度的最大值,加上圓點指示器的高度(如果有兩張以上圖片、需要顯示圓點的話),再夾一個 `window.innerHeight - 192` 的視窗上限,動態設成這個區塊自己的 CSS 變數(fallback 600px,只在第一次 paint、素材還沒量完時短暫生效)。**圓點需要的高度是讓整個框變高去容納,不是從圖片的份額裡扣掉**——圖片一律維持原始尺寸,不因為加了圓點就被縮小。這個 max-height 同時解決**捲動優先權**:內容裝在帶 `overflow-y-auto` 的容器裡,瀏覽器原生的 nested scroll chaining 行為會自動先捲內部內容、捲到底再接手捲整個頁面,不需要用 GSAP ScrollTrigger/Observer 或任何 JS 判斷「捲到底了沒」——這是刻意選擇原生行為而不是重新實作,更穩定也更不容易在觸控板上出現卡頓。這個限制只在 `lg:` 生效,是因為手機/平板版本整頁本來就是自然捲動,不需要也不應該有巢狀捲動。
- **邊框/分隔線顏色慣例**:`border-black/10` 用在「分隔線」性質的地方(欄位之間、標題列底下的 hairline);`border-black/15` 用在「元件自己的邊框」(浮動 nav 的外框、圓形收合按鈕、虛線佔位框)。兩者色階很接近但用途不同,新增邊框前先想清楚是分隔還是元件邊框,對應套用。
- **邊界保護**:`css/style.css` 裡的 `html, body { overflow-x: hidden; max-width: 100% }` 是全站唯一、統一的橫向捲動防護,不要在個別頁面/元素上另外加 `overflow-x-hidden`。任何「巨大展示字級的容器」或「寬度會動態改變的 flex 欄位」都要記得加 `min-w-0`——flexbox 預設不會讓 flex item 縮小到比它內容的自然最小寬度還小,沒加這個常常會在內容變長/欄位變窄時把畫面撐出邊界。這個坑目前已經在兩個不相關的地方各踩過一次(巨大展示字、收合按鈕),遇到任何「寬度會變的 flex 子元素」都要主動加,不要等它爆版才修。

## 驗證方式

改完視覺/互動相關的東西,不要只看程式碼就回報完成——用 Playwright(`npx playwright install chromium` 若尚未安裝)實際開瀏覽器截圖、量測 DOM 座標(尤其是「對齊」類的需求,肉眼看螢幕截圖常常判斷不準,要 `getBoundingClientRect()` 實際量)、檢查 console error、檢查 `document.documentElement.scrollWidth` 有沒有超過 `clientWidth`(橫向捲動)。

## Push 前一定要先更新這份文件

**Tim 每次要求 push 到 GitHub 之前,先檢查這次改動有沒有新增/修改設計規則、檔案結構、元件慣例——有的話先更新 AGENTS.md 反映最新狀態,確認內容跟實際程式碼一致之後,才執行 commit + push。** 不要 push 完才回頭補文件,也不要略過這一步直接 push。如果這次改動單純是內容調整、沒有動到任何系統性規則,就不需要為了湊而硬改文件,但要主動確認過一次,不是預設跳過。

**同一時間也要更新 Obsidian 裡的工作日誌**:`C:\Users\tim\OneDrive\黑曜石工作室 OneDrive\02. 作品\01. 專案\03. Personal Website\03. 每日進度紀錄.md`。把這次 push 之前做的工作、遇到的問題、怎麼解決的,照這份日誌原本的第一人稱、Day-by-day 的寫法補上去(格式參考同一位置的 `02. 創作/作品發想/Spider Lily.md`)。順序是:更新 AGENTS.md → 更新這份日誌 → commit → push。
