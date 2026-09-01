# Tim Shih Portfolio — 專案設計系統

純 HTML/CSS/JS(Tailwind CDN + GSAP),沒有框架、沒有 build step。這份文件記錄目前已定案的設計系統,之後任何新頁面/新元件都應該延續這套規則,除非 Tim 明確要求改變。

**核心原則:這個網站要像一個系統,不是一堆各自獨立的頁面。** 加新東西之前,先檢查這份文件跟 `theme.js`/`style.css` 有沒有現成的顏色、字體、間距、元件慣例可以套用;如果現有規則真的無法表達需求,才討論要不要擴充規則——而不是為了單一頁面的需求另外生一份寫死的樣式。同一個角色(標題、標籤、卡片、分隔線⋯⋯)不管出現在哪一頁,都應該用同一套答案。

專案根目錄原本還有一份 `AGENTS.md`(給 Codex 用的對應規則檔),Tim 表示不需要再同步維護後,這份檔案已經整個移除——修改這份 `CLAUDE.md` 時不用再考慮 `AGENTS.md`,push 前的檢查流程也不需要再包含它。

## 檔案結構

專案是純 HTML 在根目錄,共用的 JS/CSS/資料分別收在 `js/`、`data/`、`css/` 三個子資料夾——這是 2026-07-08 整理過的結構,新檔案要照這個分類放,不要又把 `.js`/`.css` 檔案散在根目錄。

- `index.html` — 首頁,捲動敘事是 Hero → All Works → About → Resume → Footer(見下面「首頁捲動敘事:About / Resume / Footer」跟「首頁全站背景」);All Works 區塊底下的 WORKS/BLOG/PLAY 是同一個 grid 容器的分頁切換,不是路由跳轉(見下面「首頁 WORKS/BLOG/PLAY 分頁切換」)
- `case-study.html` — **所有 case study 頁共用的單一薄殼**,不是每個作品各自建一個 html 檔案(VisionControl.AI/MPAA 兩個較早期作品原本各自有自己的 `vision-control-rewritten.html`/`mpaa.html`,已經統一遷移改用這個共用殼,兩份舊檔案已移除)。靠網址 `?work=<作品 slug>` 參數決定顯示哪個作品,`js/case-study-loader.js` 依這個參數動態載入對應的 `data/data-<作品 slug>.js`,呼叫 `renderCaseStudyPage()`(見下面「Case study 樣板系統」)
- `blog-post.html` — **所有 Blog 文章共用的單一薄殼**,不是每篇文章各自一個 html 檔案。載入 `js/blog-post-template.js` + `data/data-blog.js`,依網址 `?slug=` 從 `BLOG_POSTS` 陣列找出對應那篇文章的資料才渲染(見下面「Blog 文章系統」)
- `favicon.png` — 全站網站圖標,是唯一刻意放在根目錄、直接進 git 版控的圖片(見下面「網站圖標」)——瀏覽器分頁圖示是每個頁面載入都要用到的東西,不適合跟其他 case study 素材一樣依賴 R2(多一次外部請求、R2 掛掉時整站分頁圖示都不見),而且檔案很小,直接進 repo 沒有 Img/ 那種大型媒體檔案的顧慮
- `js/case-study-template.js` — **Case study 頁面的樣板引擎**,吃一個資料物件、動態生成整個三欄版面。依 `data.layout` 分兩條渲染路徑:預設的手風琴版面,跟 2026-09-01 加的連續閱讀版面(`layout: 'continuous'`,目前只有 VisionControl.AI 在用)——見下面「Case study 樣板系統」
- `js/case-study-loader.js` — `case-study.html` 的載入邏輯:讀網址 `?work=` 參數、動態插入對應的 `data/data-<work>.js` `<script>`、載入完成後呼叫 `renderCaseStudyPage()`。找不到 `?work=` 參數或資料檔載入失敗都會顯示「找不到這個作品」的畫面 + 回首頁連結,不會整頁壞掉。
- `js/blog-post-template.js` — **Blog 文章頁的樣板引擎**,吃 `BLOG_POSTS` 陣列 + 網址上的 `slug`,動態生成單欄文章閱讀版面(見下面「Blog 文章系統」)
- `js/works-grid.js` — 首頁 WORKS/BLOG/PLAY 分頁切換引擎(見下面「首頁 WORKS/BLOG/PLAY 分頁切換」),`initWorksGrid()` 吃一組 tabs 設定,動態渲染 `#worksGrid` 卡片、處理 nav 點擊/網址 hash/瀏覽器上一頁下一頁,支援 `numbered: true` 幫卡片標題自動加兩位數流水號(目前只有 Blog 分頁在用)
- `js/theme.js` — **所有頁面共用的 Tailwind 設計 token(顏色 + 字體家族)**,新頁面一律載入這個檔案,不要自己重新定義一份顏色/字體
- `js/script.js` — 首頁 Hero 即時時鐘
- `js/hero-glitch.js` — 首頁 Hero 大字(TIM SHIH / 文案輪播)的故障感動畫:文字亂碼化、紅藍色偏、字級動態計算(含完整的溢出安全檢查,見下面專門一節)
- `js/hero-marquee.js` — 低調亂碼跑馬燈,寫成 `initMarquee(fieldId, options)` 可重複呼叫的工廠函式(不是單一頁面寫死的邏輯),目前 Hero、All Works(`#works`)、About 各呼叫一次,Hero 跟 All Works 共用同一組淺色底參數、About 另用一組深色底參數(見下面「首頁全站背景」跟「首頁捲動敘事」)
- `js/scroll-reveal.js` — 通用的「元素是否隨某個目標區塊進出視窗而淡入/淡出」IntersectionObserver 工具,靠 `data-reveal-on`(CSS selector)、`data-reveal-invert`、`data-reveal-translate`、`data-reveal-pointer-events` 這組 data 屬性驅動,不用寫 JS 就能讓任何元素套用同一套顯示邏輯(目前用在浮動 nav、Hero 的往下滑動提示、Hero 左下角版本號列)
- `js/scroll-hint.js` — Hero 的往下滑動提示箭頭(位移 + 閃爍兩層獨立 GSAP tween、點擊捲動到 `#works`),顯示/隱藏邏輯委託給 `js/scroll-reveal.js`,不是自己另外寫一套。Hero 這個箭頭上方另外有一個「SCROLL」文字提示(`index.html` 裡跟箭頭同一個 `#scrollHint` 按鈕內,`font-geistmono text-xs tracking-[0.125em] uppercase text-muted`),跟箭頭共用同一組 `data-reveal-*` 淡入淡出,不需要另外處理顯示/隱藏——About/Resume 底部的往上箭頭沒有套這個文字(使用者當下已經在捲動,語意已經明確,不需要重複提示)
- `js/accordion.js` — 通用手風琴(`initAccordion(ids, options)`),邏輯跟 `js/case-study-template.js` 的 `initAccordions()` 是同一套(GSAP 高度展開/收合 + 互斥),差別是不綁死 case study 的資料格式,靠 `#accordionHeader-<id>`/`#accordionContent-<id>` 命名慣例運作,目前用在首頁 Resume 區塊
- `js/hero-scroll-fade.js` — GSAP ScrollTrigger 的 pin + scrub 效果集中在這裡(見下面「首頁捲動敘事」專門一節)
- `js/page-loader.js` — 全站共用的頁面載入動畫(圓點網格脈動),`index.html`/`case-study.html`/`blog-post.html` 三個共用殼都套用同一套(見下面「頁面載入動畫:圓點網格脈動」)
- `data/data-vision-control-rewritten.js` — VisionControl.AI 目前上線使用的資料物件,採用 `layout: 'continuous'` 的連續閱讀模式,並以 `media[].afterParagraph` 控制媒體在自然文件流中的位置(見下面「Case study 樣板系統」)
- `data/data-mpaa-new.js` — The Mary Pickford Arts Alliance 目前上線使用的資料物件
- `data/data-criterion-channel.js` — The Criterion Channel Brand Identity 的資料物件,透過 `case-study.html?work=criterion-channel` 存取
- `data/data-cyber-spell-discord.js` — Cyber Spell: Discord 的資料物件,透過 `case-study.html?work=cyber-spell-discord` 存取
- `data/data-psycho-thrills.js` — Psycho Thrills 的資料物件,透過 `case-study.html?work=psycho-thrills` 存取
- `data/data-serious-business-of-comedy.js` — The Serious Business of Comedy 的資料物件,透過 `case-study.html?work=serious-business-of-comedy` 存取
- `data/data-ldn-24.js` — LDN 24 的資料物件,透過 `case-study.html?work=ldn-24` 存取
- `data/data-a-message-to-the-end.js` — A Message To The End. 的資料物件,透過 `case-study.html?work=a-message-to-the-end` 存取
- `data/data-oko-echo.js` — OkoEcho 的資料物件,透過 `case-study.html?work=oko-echo` 存取
- `data/data-mahjong.js` — MahJong Ledger 的資料物件,透過 `case-study.html?work=mahjong` 存取
- `data/data-template.js` — 新增作品時複製這份改名用的空白範本,所有 key 都在、值留空。**目前只有手風琴版面的格式**(沒有 `layout`/`displayTitle`/`afterParagraph` 這幾個連續閱讀版面才用得到的欄位,見下面「連續閱讀版面」)——複製這份範本做出來的新作品預設都是手風琴,要用連續閱讀版面得手動加欄位,不是這份範本目前的預設值
- `data/data-works.js` — 首頁 WORKS 分頁(`WORKS_DATA`)跟 PLAY 分頁(`PLAY_DATA`)的卡片清單,兩個陣列同一個檔案(見下面「首頁 WORKS/BLOG/PLAY 分頁切換」)
- `data/data-blog.js` — **Blog 文章的唯一資料來源**(`BLOG_POSTS` 陣列),存完整文章內容(標題、日期、封面圖、作者、結構化的 `content` 區塊陣列),不是卡片形狀的假資料——首頁 BLOG 分頁的卡片清單跟 `blog-post.html` 的文章內文共用同一份,見下面「Blog 文章系統」
- `css/style.css` — 全站共用的少量原生 CSS:防止橫向捲動的 `html,body` 規則、case-study 標題列共用的 `.col-header`、`.dot-grid`/`.dot-grid-dark`(淺色/深色兩版圓點網格背景)、`.glitch-text`(紅藍色偏)、`.loading-lock`/`.loader-dots`/`.loader-dot`(頁面載入動畫,見下面「頁面載入動畫:圓點網格脈動」)
- `Img/` — 本地端的媒體素材原始檔,**已經排除在 git 版控外**(見 `.gitignore`),只留在本機當備份/編輯預覽用——實際部署的網站讀的是 Cloudflare R2 上的副本,不是這個資料夾。細節見下面「媒體素材託管:Cloudflare R2」。每個作品如果素材較多,底下開自己的子資料夾(例如 `Img/VisionControl_Sources/`、`Img/MPAA_Sources/`),依內容再分子資料夾(如 Overview、Product Strategy)——新增素材時本地路徑慣例維持不變,只是最後寫進 `data/*.js` 的 `src`/`thumbnail` 要換成 R2 網址,不是本地相對路徑。
- `reference/` — 純設計參考用的情緒板/截圖,不是網站會載入的東西,已排除在 git 版控外(見 `.gitignore`);跟特定作品內容擷取有關的原始素材(例如網頁 scrape 下來的 HTML/JSON)歸進對應的 `Img/<作品>/` 資料夾,不要堆在 `reference/` 裡混淆用途

## 網站圖標

`favicon.png`(根目錄)是全站唯一的圖標檔案,三個共用殼(`index.html`/`case-study.html`/`blog-post.html`)的 `<head>` 都在 `<title>` 後面接同樣兩行:

```html
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="favicon.png">
```

**這是刻意跟其他媒體素材分開處理的例外**:case study 用的圖片/影片都在 R2(見下面「媒體素材託管」),但 favicon 是每個頁面載入都會請求的東西,不適合再多繞一次外部網域(多一次 DNS/TLS 交握,而且 R2 萬一出狀況會連分頁圖示都不見),檔案本身也很小(707×707,個位數 KB),直接進 git 版控沒有 `Img/` 那種大型媒體檔案會拖垮 repo 的顧慮。

來源檔案是 `Img/Self-Identity/71nG_color.png`(1080×1080,漸層背景版本,標誌本身只佔畫面中間一小條、四周留白很多),`favicon.png` 是從這份原始檔以標誌為中心裁切出一個正方形區域(705×705)後產生的——直接拿原始檔當圖標的話,標誌在瀏覽器分頁那種 16–32px 的小尺寸下會小到幾乎看不見。這個裁切是一次性手動處理,不是自動化流程;之後如果要換一個新的圖標圖案,同樣需要先確認裁切後在小尺寸下清不清楚可辨識,不能直接拿原始設計稿套用。專案裡還有一份 `Img/Self-Identity/71nG_transparent.png`(黑色線條版、透明背景)是同一個標誌的另一個版本,favicon 目前用的是彩色漸層版,不是這份。

## 媒體素材託管:Cloudflare R2

**所有圖片/影片都放在 Cloudflare R2(bucket 名稱 `tshih-media`),不是 git repo 裡——這是 2026-07-29 定案的架構,新增素材一律照這套流程,不要把媒體檔案 commit 進 git。**

**為什麼不能放 git 裡**:這個網站部署在 Cloudflare Workers(靜態資源模式),Workers 的靜態資源有 **25 MiB 單檔上限**,比 GitHub 本身的 100MB 上限更嚴格——這個專案有好幾支作品影片超過 25MB(甚至超過 100MB),放在 git 裡會直接讓 `wrangler deploy` 失敗(`[ERROR] Asset too large`)。就算檔案都壓在 25MB 以下,git 本身也不適合存大量二進位媒體檔案,repo 只會越滾越大、clone 越來越慢。

**運作方式**:
- 本地 `Img/` 資料夾維持原樣(檔名、資料夾結構都不變),只是加進 `.gitignore`,不進 git 版控——純粹當作素材的本機備份跟預覽用途。
- `data/*.js` 裡所有原本寫 `Img/xxx.png` 這種相對路徑的地方,一律換成 R2 的公開網址:`https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/xxx.png`(網址裡刻意保留 `Img/` 這一段路徑,跟本地資料夾結構對應,方便一眼看出對應到本機的哪個檔案)。
- **新增作品/新增素材的流程**:素材先照舊放進本機 `Img/<作品>/` 對應資料夾 → 手動上傳到 R2 bucket 的同一個相對路徑(Cloudflare Dashboard → R2 → 選 bucket → Upload,或用有 R2 API 憑證時的批次上傳腳本)→ `data/*.js` 裡的 `src`/`thumbnail` 直接寫 `https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/<作品>/<檔名>`,不要寫本地相對路徑。
- R2 的 **Public Development URL**(`pub-xxxxx.r2.dev` 這組網址)已經在 bucket 設定裡手動啟用——這是免費、不需要另外綁自訂網域就能公開讀取的網址,足夠這個網站現在的規模用,不需要另外設定 `cdn.tshih.me` 這種自訂子網域(除非之後有品牌一致性的需求)。
- R2 免費額度是每月 10GB 儲存 + 1000 萬次讀取,目前用量(約 870MB)遠低於額度上限。

**驗證新素材有沒有正確連到 R2**:除了平常的 Playwright 截圖/console error 檢查,新增媒體時要額外確認瀏覽器實際發出的請求是打到 `pub-xxxxx.r2.dev` 網址且回應碼是 200(不是本地 404),避免路徑寫成本地相對路徑卻忘記換成 R2 網址而沒被發現。

## Case study 樣板系統

**新增一個作品的 case study 頁,不要複製貼上既有頁面改內容,也不要建立獨立的 html 殼——複製 `data/data-template.js` 改名成 `data/data-<作品 slug>.js`,照裡面的空白格式填(完整欄位說明見 `js/case-study-template.js` 檔案開頭的註解),就可以透過 `case-study.html?work=<作品 slug>` 存取,不需要另外準備 html 檔案。** `js/case-study-loader.js` 會依網址參數動態載入對應的資料檔、呼叫 `renderCaseStudyPage()`,細節見下面「共用殼:`case-study.html?work=`」。

**全部四個作品(VisionControl.AI/MPAA/Criterion Channel/Cyber Spell: Discord)都統一用這個共用殼**,沒有任何作品還留著自己獨立的 html 殼——VisionControl.AI/MPAA 原本各自有 `vision-control-rewritten.html`/`mpaa.html`,遷移到共用殼之後這兩份檔案已經刪除,`data/data-works.js` 的對應 `href` 也改成 `case-study.html?work=vision-control-rewritten`/`case-study.html?work=mpaa-new`(沿用資料檔既有的檔名當 slug,沒有另外改名,所以 slug 裡還留著 `rewritten`/`new` 這種歷史命名痕跡——如果之後想要更乾淨的 slug,需要連同資料檔一起改名,屬於另一項需要另外確認的工作,不是這次遷移範圍)。

資料物件至少要有:`title`、`category`、`intro`、`author`、`backHref`、`overview`(見下面完整格式)、`sections`(陣列,任意數量的 `{title, content, media?}`)。預設不寫 `layout` 時沿用手風琴;設成 `layout: 'continuous'` 時,Overview 與所有 sections 會直接排成一篇持續往下閱讀的長頁,不需要逐章展開。

版面邏輯(三欄結構、OVERVIEW 跟手風琴共用的展開/收合互動、連續閱讀模式、hairline、`.col-header` 固定高度對齊)全部在 `js/case-study-template.js` 裡,不要因為某個作品需要客製化就把邏輯抄一份出去修改——如果樣板真的無法表達某個作品需要的東西,先跟 Tim 討論要不要擴充資料格式(例如加一個新的 media type),而不是繞過樣板直接寫死 HTML。

### 共用殼:`case-study.html?work=`

**跟 Blog 文章「單一殼 + 資料驅動」是同一個精神,但實作方式不一樣**——Blog 所有文章存在同一個陣列(`BLOG_POSTS`)裡,靠 `.find(slug)` 找到對應那篇;case study 的每個作品是各自獨立的資料檔,各自宣告自己的 `const CASE_STUDY_DATA = {...}`(這是延續 VisionControl.AI/MPAA 已經在用的既有格式,沒有為了共用殼把所有作品硬塞進同一個陣列重寫)。所以 `case-study.html` 不是像 `blog-post.html` 那樣在頁面載入時就把所有資料一起載入、再用陣列查找,而是 `js/case-study-loader.js` 讀網址的 `?work=<作品 slug>` 參數,動態插入一個 `<script src="data/data-<slug>.js">`,只載入這一個作品的資料檔——同一個頁面同一時間只會有一個 `CASE_STUDY_DATA` 被宣告,不會有多個作品的資料檔同時載入互相撞名的問題。

- `?work=` 的值就是資料檔檔名去掉 `data-` 前綴跟 `.js` 副檔名,例如 `data/data-criterion-channel.js` 對應 `case-study.html?work=criterion-channel`,不需要另外維護一份 slug 對應表。
- 資料檔載入完成後,`case-study-loader.js` 順便把 `document.title` 設成 `${CASE_STUDY_DATA.title} | Tim Shih`——因為現在是共用殼,`<title>` 沒辦法像舊模式那樣寫死在 html 裡,要等資料載入後才知道。
- 網址沒帶 `?work=`,或資料檔 404/載入失敗,都會顯示一個簡單的「找不到這個作品」畫面 + 回首頁連結,不會整頁空白或報錯——跟 `blog-post.html` 找不到對應 slug 時的處理邏輯是同一個精神。
- `data/data-works.js` 裡新作品的 `href` 直接寫 `case-study.html?work=<作品 slug>` 就好,不需要額外欄位。

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
    { type: 'video', src },        // 本地影片檔案
    { type: 'youtube', src, alt }, // 外部 YouTube 影片,src 給 youtu.be/watch?v= 網址即可,見下面說明
  ],
}
```

`buildAccordionBlock()` 依 `media` 是否存在自動選其中一種渲染模式,不需要另外設定開關:

1. **沒有 `media`(或空陣列)** → 純文字單欄版面。
2. **有 `media`(不管幾項)** → 左右分欄:左側媒體欄是它自己獨立的 `overflow-y-auto` 捲動容器,圖片/影片依序垂直排列,每一張都維持原始寬度(填滿媒體欄寬度)/原始長寬比,**不裁切、不縮小塞進共用的固定框**。使用者在媒體欄範圍內滾動滑鼠滾輪/觸控滑動,就是在這個獨立容器裡捲動切換圖片——桌面版套用 CSS `scroll-snap`(`snap-y snap-proximity` + 每張圖 `snap-start`),讓捲動自然吸附到「一次剛好看到一張」,不用自己寫 JS 判斷捲動距離對應第幾張。**用 `proximity` 不是 `mandatory`**——同一個作品裡不同素材的長寬比可能差異很大(踩過的坑:MPAA 的 OVERVIEW 參考素材是 16:9 影片,但某張 section 圖片是 4.9:1 的扁平橫幅圖,兩者換算出來的高度天差地遠),`mandatory` 會強制每次捲動都吸附到最近的圖片,矮圖下方大片空白區域捲起來時瀏覽器會「用力拉回」吸附點,體感卡頓;`proximity` 只在捲動自然接近吸附點時才吸附,不會硬拉,仍保留「捲一段大致停在一張圖」的效果,但不會卡。有兩張以上圖片時,底下會有一列**圓點指示器**(顏色沿用既有色票:目前顯示的用 `bg-ink`、其餘用 `bg-black/15`,只在桌面 `lg:` 顯示),反映「媒體欄自己捲到第幾張」,點擊可以讓媒體欄捲動(`scrollTo` + smooth)到對應那張圖。右側文字欄是完全獨立的另一個捲動軸(如果內容夠長),兩者互不影響。

**每個區塊(OVERVIEW、每個 section)各自獨立算自己的框高,不是全站共用一個值。** `initMediaColumnHeights()` 對每個有 `media` 的區塊,量它自己媒體欄裡所有已載入項目渲染高度的**最大值**(不是中位數或平均——這裡踩過一次坑:一開始用中位數,結果一個 section 裡如果同時有很矮跟很高的圖(例如 130px/220px/410px 混在一起),中位數會落在中間值附近,那張最高的圖反而會超出框、變成需要在自己的「一頁」裡再往下捲才看得完,違背 scroll-snap「捲一次剛好看到一張完整圖片」的核心體驗;改用最大值可以保證這個區塊裡任何一張圖都不會被裁切、都不需要內部再捲動,代價是比較矮的圖片下方會有比較明顯的空白,但寧可留白也不要有圖片被截斷),設成這個區塊自己的 `--accordion-max-h-<id>` CSS 變數,每個區塊各自讀自己的變數,不會互相干擾。**這是取代舊版「全站共用一個 `--accordion-max-h`,由 OVERVIEW 第一項素材決定」設計的正式做法**——舊版踩過的坑:MPAA 的 OVERVIEW 參考素材是 16:9 影片,套到其他 section 明顯比例不同的圖片上時,那些圖片只佔框高一小部分,留下大片空白,而且同一個框裡圖片高度落差太大,scroll-snap 捲動切換時也感覺卡頓。改成每個區塊各自量、各自設定後,只要同一個區塊「自己」內部的素材長寬比夠接近,這個區塊就會自動 fit 得剛好;區塊「自己」內部如果本身就混雜差異很大的素材(例如同一個 section 裡有一張特別扁的橫幅圖),那張離群素材雖然不會被截斷,但比較矮的圖片還是會有明顯空隙,這是無法避免的(除非裁切)。

這個理論上算出來的高度還會再夾一個視窗高度上限(`window.innerHeight - 192`,192px = 自己的標題列 96px + 至少露出下一個標題列 96px,沿用「展開時至少要看到下一個標題」那條規則的數字)——避免某個區塊剛好都是很長的直式素材時,展開後把下一個區塊的標題列擠出視窗外。

新作品只要給 `media` 就會自動套用這套捲動同步呈現,不需要額外欄位;沒有素材時才落回模式 1。**這一套邏輯是共用的 `buildAccordionBlock()`/`buildMediaColumn()`/`initMediaCarousel()`,OVERVIEW 內部也是呼叫這幾個函式,不是另外寫一份——修改行為時兩種模式都要一起確認沒有壞掉。**

### 連續閱讀版面(`data.layout === 'continuous'`)

**2026-09-01 加的第二種版面,目前只有 VisionControl.AI 在用**(`data-vision-control-rewritten.js` 的 `layout: 'continuous'`)。沒有 `layout` 欄位(或值不是 `'continuous'`)的其餘作品完全不受影響——`renderCaseStudyPage()`/`buildHtml()` 開頭就依這個欄位分流成兩條路徑,手風琴那條(`buildAccordionBlock()`/`buildMediaColumn()`/`initMediaColumnHeights()`/`initMediaCarousel()`/`initAccordions()`)完全沒有改動,兩條路徑除了共用 `collectBlocks()`/`buildMediaItem()`/`buildParagraphs()`/`buildLightbox()`/`initLightbox()` 這幾個小工具之外彼此獨立。

跟手風琴版面最大的差異:Overview + 全部 sections 直接攤開連續往下排列,不需要點擊展開。**版面是三欄,不是兩欄**:第一欄作品基本信息(標題、分類、簡介、作者)、第二欄章節快轉導覽,這兩欄在桌面寬度都固定在畫面上不隨捲動移動;第三欄才是真正的內容,是整個版面裡唯一會捲動的欄位。第一、二欄能「固定不動」不是靠 `position: sticky`,是延續手風琴版面 intro-col 本來就有的做法——`#fold` 本身是 `lg:h-screen`、不會整頁捲動,只有第三欄 `<main>` 自己 `lg:overflow-y-auto` 獨立捲動,第一、二欄只是這個捲動容器之外的普通 flex 兄弟元素,自然就會「留在原地」,不需要額外機制。**2026-09-02 從最初的兩欄版面(章節導覽是疊在第三欄內容上方的 `sticky top-0` 橫條)改成三欄**——原本的橫條做法會在使用者往下捲動時一直蓋在內容最上緣,體感比較像「內容底下有一條浮動列」;獨立成第二欄之後,導覽跟內容互不重疊,也更貼近 Tim 給的參考稿(單一資訊欄 + 單一導覽欄 + 單一內容欄,三者並排)。

- **素材位置**用 `media[].afterParagraph` 這個整數決定(`buildContinuousBlock()`):`-1` 放在該 section 第一段之前,`0` 放在第一段之後,`1` 放在第二段之後,以此類推;沒有指定或數字對不上任何段落的素材,會自動排在該 section 最後面(不會憑空消失,見 `buildContinuousBlock()` 的 `unplacedMedia`)。**這個欄位純粹是靜態排版用的,不會驅動任何捲動同步或動畫**——CLAUDE.md 稍早記錄過的「文字欄捲動位置驅動圖片切換」設計已經拿掉,`afterParagraph` 是同一個名字重新用在完全不同的用途上,不要誤會成那個舊功能復活了。
- **段落跟素材都支援 `title`/`align`,2026-09-03 加的**——`content` 陣列每一項可以維持純字串(等同 `{ text: 字串 }`,舊寫法照樣可以用,`normalizeContinuousParagraph()` 統一轉換),也可以寫成 `{ text, title?, align? }` 物件:
  - `title`(可省略)是這一段自己專屬的小標題,顯示在段落文字正上方(`<h3 class="mb-4 font-geist font-semibold text-sm text-ink">`)——這跟這個 section 本身的 `<h2>` 大標題是兩層不同的東西,不要混為一談。以前的做法是把小標題寫死進 `<strong>...</strong>` 塞進同一段文字裡,現在拆成獨立欄位是因為段落內文本身要套用完全不同的字體(見下面 Arial 那條),繼續塞進同一段字串會讓標題也被迫套用內文的字體/字級。
  - `align`(可省略,預設 `'left'`)決定這一段文字在內容欄裡貼齊哪一側,用 `mr-auto`(left)/`ml-auto`(right)做——**不是文字自己的 `text-align`**,是整個文字區塊(`max-w-3xl`)在較寬的內容欄裡的左右位置。段落 `align: 'right'` 搭配鄰近素材(反過來靠左),可以做出雜誌式的 Z 字型交錯閱讀動線。`media[]` 的每一項也支援同一個 `align` 欄位(`buildContinuousMedia()`),資料格式還在,但目前不會有視覺效果,見下一條。
  - **素材的寬度歷經好幾輪調整,最後定案是「一律 `w-full`,填滿整個內容欄,不設 `max-width` 上限」——2026-09-05 定案,Tim 明確要求所有 media(圖片/影片)都要 fill the space。** 中間的過程:一開始用 `max-w-5xl`(1024px),比第三欄實際可用寬度(當時大約 850px 上下)還寬,結果素材永遠貼滿整欄,`align` 完全沒有視覺效果(兩側算出來的 margin 都是 0);改成 `max-w-3xl`(768px)、之後第三欄本身放大到 `max-w-[1200px]` 時再跟著放大一階到 `max-w-4xl`(896px),兩輪都是刻意留窄一點,讓 `align` 能把素材推到某一側做出交錯效果。但 Tim 最後的優先順序是「滿版展示」優先於「素材也能交錯」,所以直接拿掉 `max-width`,改回 `w-full`。**副作用:素材的 `align` 欄位現在不會再有任何視覺效果**(`w-full` 已經沒有多餘空間可以被 `margin: auto` 推動)——欄位保留著沒有刪除(留著無害,只是不生效),段落文字自己的 `align`/`max-w-3xl` 完全沒受影響,一樣照原本邏輯靠左右。如果之後又想讓素材也能交錯,兩個目標(滿版 vs 交錯)互斥,要先跟 Tim 確認清楚要選哪一個,或者討論要不要另外加一個獨立欄位分開控制,不要自己決定要不要拿掉 `w-full`。
  - **驗證這類「新出現的 Tailwind class 有沒有生效」時,用 Playwright 動態注入測試資料後,記得等一段時間(至少一次 `waitForTimeout`)再量測 `getComputedStyle()`,不要注入完 DOM 立刻同步量。** Tailwind CDN 是靠 MutationObserver 即時偵測 DOM 裡新出現的 class 字串、才動態產生對應的 CSS 規則——如果某個 class(例如 `ml-auto`)在頁面初始載入時完全沒被用過(所有既有內容預設都是 `align: 'left'` → `mr-auto`),第一次注入含 `align: 'right'` 的測試資料時,`ml-auto` 對應的 CSS 規則可能還沒被 Tailwind 產生出來,零延遲量測會得到「margin 沒生效」的假訊號,不是真的 bug——這個坑已經在這次驗證時親自踩過,补一次延遲重新量測後確認其實是好的。
- **段落內文字體改成 Arial Regular**(`font-['Arial'] font-normal leading-[1.5]`,字級目前是 `text-[12pt]`——2026-09-03 先定案 20pt、2026-09-04 改回 12pt,Tim 覺得 20pt 太大)——這是 Tim 明確要求的例外,只套用在連續閱讀版面的段落內文上,不是全站字體規則的變動(其餘元件,包含這個版面自己的 `<h1>`/`<h2>`/`<h3>`/導覽文字,都還是原本的 `font-unbounded`/`font-geistmono`/`font-geist`)。`text-[12pt]` 直接用 CSS 原生的 `pt` 單位(瀏覽器原生支援,不需要換算成 px/rem),Arial 是作業系統內建字體,不需要另外載入 Google Fonts 或任何 `@font-face`。
- **第三欄(內容欄)寬度上限是 `lg:max-w-[1200px]`,不是 `flex-1` 撐滿剩餘空間**——2026-09-04 改的,原本 `<main>` 是 `flex-1`,螢幕夠寬時(尤其超寬螢幕)內容本身的 `max-w-2xl`/`max-w-3xl` 遠比可用寬度窄,右側會留下一大片空白。改成明確的寬度上限後,空白還是存在(內容本來就不需要那麼寬),但至少是「內容欄自己不需要那麼寬」的自然結果,不是「flex-1 硬撐出一個過大的容器,子元素卻用不到」。中間試過把第二、三欄一起包一層 `justify-center` 讓兩者在扣掉第一欄後的剩餘空間裡置中(量過在 1920px 寬視窗下,左右兩側間距精確對稱都是 230px),但 Tim 覺得第二欄(導覽)離第一欄太遠,要求**第二欄退回原本緊貼第一欄的位置,第三欄的寬度上限不用改**——所以拿掉了那層 `justify-center`,現在第二、三欄都直接照 flex 預設的 `justify-start` 排列,彼此之間、跟第一欄之間都沒有額外留白,右側的空白純粹是「內容欄本身沒有撐滿剩餘空間」造成的,不是刻意置中的效果。之後如果又想調整第二/三欄的水平位置,先跟 Tim 確認清楚是要調整哪一欄、留白要出現在哪一側,不要直接假設「置中」是預設答案。

**2026-09-04 再改一次:靠「加寬第二欄本身」讓第三欄往右移,不是靠外層 `justify-center` 加留白。** 這次 Tim 要的效果是「第二欄留在原地(緊貼第一欄),但整體再往中間靠一點」——關鍵差異在於留白算是「加在第二欄的框裡」還是「加在第二欄外面」:`justify-center` 那個做法是在 nav 前面插入一段看不見的 margin,把 nav 整個(連同裡面的文字連結)一起往右推,文字因此離第一欄變遠;現在的做法是把 nav 自己的框加寬(`lg:flex-[0_0_18%]`,原本是固定 `160px`),nav 內部的文字連結本身有 `px-8` 內距、靠左對齊,不會因為外層框變寬就跟著往右移——所以視覺上「導覽文字」還是貼著第一欄沒有動,只是 nav 框的右邊界往右延伸,把第三欄一起往右推。因為 nav 沒有背景色/邊框,框變寬留下的空白跟外面加 margin 留下的空白其實長得一模一樣,但意義不同:框變寬時,只要文字本身還是左對齊,就一定不會被誤認成「導覽離第一欄變遠了」。改用 `%` 而不是固定 px,是因為想要「螢幕越寬,第二欄讓出的空間越多」的比例效果,`lg:min-w-[160px]` 保留當作下限,避免 `lg:` 斷點剛好卡在 1024px 時算出來的百分比寬度太窄擠壓到文字。

**「靠縮小第二欄湊出第三欄左右對稱」這條路一開始行不通,是參數組合下的數學限制,不是沒調好——2026-09-04 同一天 Tim 直接選了另一個方向處理:與其縮小第三欄湊對稱,不如把第三欄本身放大,讓它吃掉更多右側留白。** 原本第三欄的寬度上限固定在 `900px` 時,要讓左右留白對稱,理論上需要的第二欄寬度是 `(扣掉第一欄後的可用寬度 − 900) ÷ 2`——這個數字在筆電常見的 1440px 寬度下算出來大約只有 120px,比 nav 文字實際需要的最小寬度(160px)還窄,兩個限制互相衝突,那個寬度下不可能真正置中。改成把第三欄的寬度上限直接加大到 `1200px` 之後,問題不再是「湊對稱」,而是讓第三欄本身盡量吃滿可用空間——用 Playwright 量過:1440px 寬度下,第三欄現在直接撐滿到剩餘可用空間(右側留白降到 0);1920px 寬度下,右側留白從原本(900px 上限時)的 346px 降到 46px。留白對不對稱這個理論問題並沒有真的解決,但視覺上留白本身已經小到幾乎感覺不到,體感上跟「置中」原本要解決的問題(一大片不平衡的空白)是同一回事,額外的好處是內容(影片、圖片)本身也顯示得更大更清楚。**這是 Tim 明確選的方向,不是自己判斷「反正差不多」就代為決定——之後如果這個上限還要再調,同樣的邏輯(加大內容欄本身,不是靠縮小其他欄位湊對稱)是目前定案的方向。**
- **第二欄的章節導覽**(`initContinuousNavigation()`)垂直排列,每個連結對應一個 section 的錨點。點擊會平滑捲動第三欄(不是 `window`)到對應 section,同時用 `history.replaceState()`(不是 `pushState`)更新網址 hash,不會多留一筆瀏覽紀錄。**目前捲到哪個 section,對應連結會自動變 `text-ink`(其餘維持 `text-label`)**,靠 `IntersectionObserver` 做 scrollspy——`rootMargin: '-20% 0px -70% 0px'` 把偵測範圍收窄成螢幕頂端往下一小段,哪個 section 的標題進到這段範圍就算「目前這個」,不需要自己手算捲動位置對應第幾個 section。**2026-09-03 拿掉了 active 狀態的底線**(原本疊加 `border-b border-ink`)——Tim 覺得底線太搶眼,現在 active 只靠顏色深淺區分(`text-ink` vs `text-label`),不要再加回底線。連結本身維持 `inline-block`(不是 `block`)的理由不變:就算之後又想加底線一類的裝飾,底線也該貼齊文字寬度,不要撐滿整欄。
- **三欄的視覺對齊**:只有第一欄(作品基本信息)有分隔線(`lg:border-r`),第二欄(章節導覽)跟第三欄的每個 section 都刻意不加任何邊框——**2026-09-03 拿掉了原本每個 section 底部的 `border-b`**(原本的用意是分隔各個 section,但視覺上疊在一起太多線,Tim 要求拿掉,section 之間單純靠留白區隔)。第二欄跟第三欄的第一個區塊(Overview)桌面寬度的頂部內距都是實測調出來的 `lg:pt-36`,讓「Overview」這幾個字(不管是第二欄的連結、還是第三欄 Overview 區塊自己的 `<h2>`)的頂部都對齊第一欄大標題(`<h1>`)的頂部——用 Playwright 量過 `getBoundingClientRect().top`,三者(`<h1>`、第二欄 Overview 連結、第三欄 Overview 的 `<h2>`)完全相等(桌面寬度 1440px 下量測)。**只有 Overview 這個區塊需要 `lg:pt-36`,其餘 section 維持原本的 `lg:pt-20`**——因為只有 Overview 一開始(捲動位置在頂端時)會跟第一、二欄同一水平線,其餘 section 的位置是由上面內容的自然高度往下推算,不是固定在容器頂端,套用同一個 `pt-36` 沒有意義,也會把其餘 section 的內距拉得不必要地大。**這個 `pt-36` 數字是針對 `<h1>` 目前的字級/margin 調出來的,不是算出來的公式**——`<h1>` 的字級是響應式的(`text-[1.875rem] lg:text-[1.75rem] xl:text-[2.25rem] 2xl:text-[2.75rem]`),不同斷點下 `<h1>` 實際佔的高度會有些微差異,`pt-36` 只保證在量測當下的斷點精確對齊,其他斷點可能有幾 px 的落差,如果之後要更精確,一樣要重新用 Playwright 量測調整,不要憑感覺改數字。拿掉 section 之間的 `border-b`、加大 Overview 的頂部內距都不影響可以捲到的內容範圍——第三欄還是同一個 `overflow-y-auto` 容器,捲到底一樣能看到最後一個 section 的最後一段文字,已經用 Playwright 把 `<main>` 捲到 `scrollHeight` 確認過,不會有任何內容被擠出捲動範圍外變得看不到。
- **圖片 lightbox 沿用跟手風琴版面完全一樣的 `initLightbox()`,不是另外寫一份**——`buildContinuousMedia()` 產生的每個素材容器刻意也掛上 `media-item` class(疊加在 `continuous-media` 之外),外層 section 內容包一層 `id="mediaColumn-<id>"`(`buildContinuousBlock()` 裡文字+媒體共用的那個容器)。這兩個命名慣例是 `initLightbox()` 查詢「可點擊的圖片」跟「同一組導覽清單範圍」的依據——這裡踩過一個坑:第一版只顧著排版邏輯,忘了對齊這兩個 class/id 慣例,結果連續閱讀版面的圖片點了完全沒反應(`role="button"`/`cursor-pointer` 樣式都有,但 `initLightbox()` 的 `querySelectorAll('.media-item[data-lightbox-src]')` 找不到任何符合的元素,靜默失敗、不會報錯,不細看很容易漏掉)。之後如果要再新增第三種版面,務必記得沿用這兩個慣例,不要各自發明一套。
- **大標題支援可選的 `displayTitle` 欄位**(HTML 字串,可以帶 `<br>` 手動換行),優先於 `title` 顯示在左欄的 `<h1>`——`document.title`(瀏覽器分頁標題)固定用 `title`,不受 `displayTitle` 影響。這個欄位兩種版面都支援(不是只有連續版面才有),沒有給的作品直接 fallback 用 `title`,不影響其餘作品。
- `data/data-template.js` 目前**還沒有**更新成把 `layout`/`displayTitle`/`afterParagraph` 這幾個新欄位列進去——複製它建立的新作品預設一律是手風琴版面。要讓另一個作品也用連續閱讀版面,直接在複製出來的資料檔手動加上 `layout: 'continuous'` 跟對應的 `afterParagraph` 值即可,不需要等 `data-template.js` 補上這個選項才能用;但如果之後決定要把連續閱讀版面推廣成常態選項,記得回頭把 `data-template.js` 也補上對應的註解/空白欄位。

**Accordion 模式已拿掉「文字欄捲動位置驅動圖片切換」的設計**(GSAP `autoAlpha` 交叉淡出、`object-contain` 塞進共用固定框都已移除,不要再沿用)。實測踩到兩個問題:文字內容不夠長時完全沒有捲動空間可以觸發切換(OVERVIEW 曾經因此永遠停在第一張圖);文字內容剛好夠長時,捲動位置換算成圖片 index 的門檻很難抓準,容易跳過某張圖。`object-contain` 塞共用固定框也會把圖片縮小,不符合「維持原始尺寸」的需求。媒體欄自己獨立捲動 + CSS scroll-snap 直接解決這兩個問題,不依賴文字內容的長度或捲動位置,原生行為也比自己算捲動門檻更穩定。`afterParagraph` 現在只在 `layout: 'continuous'` 中作為靜態排序欄位:-1 是第一段之前,0 是第一段之後,以此類推;它不會驅動動畫或同步捲動。

**舊資料格式相容性**:`content` 給字串(不是陣列)一樣會被當成單一段落接受;`overview` 用 `paragraphs`(不是 `content`)、media 放在頂層 `data.media`(不是 `overview.media`)也一樣支援——這是為了不強迫舊格式的資料檔案跟著改寫。只有新資料檔案需要照上面「預設渲染邏輯」的格式寫。

### 圖片素材:桌面版/手機版分開準備(`src: { desktop, mobile }`)

**新作品的圖片素材,建議每張都同時準備桌面版跟手機版兩份**,因為桌面版的橫向裁切在窄螢幕上常常擠壓到看不清楚內容,手機版通常需要更方正/直向的裁切。media 項目的 `src` 欄位可以是:

- **純字串**——同一個檔案兩種斷點都顯示。沒有另外準備手機版素材時就這樣寫,不是強制規定每張圖都要兩份,樣板會正確處理只有桌面版的情況,不會報錯或留白。
- **`{ desktop: '桌面版路徑', mobile: '手機版路徑' }` 物件**——`lg:` 以上顯示 desktop、以下顯示 mobile。

切換邏輯是**純 CSS**,不是 JS 偵測視窗寬度動態換 `src`:`buildMediaItem()` 遇到物件格式的 `src` 時,會渲染兩個 `<img>`(或 `<video>`),分別套用 `hidden lg:block`(只在桌面顯示)跟 `block lg:hidden`(只在 lg: 以下顯示)。這樣寫的理由——resize 不需要額外處理圖片重新載入,兩種斷點之間也不會有短暫顯示錯誤版本的問題,符合「能用 CSS 表達就不要用 JS」的原則。桌面版那個 `<img>` 額外加 `data-variant="desktop"`,讓 `initMediaColumnHeights()` 量測主圖高度時能明確排除 Mobile 版本(Mobile 版在桌面寬度下是 `display:none`,量到的高度會是 0)。

**檔名慣例**:Mobile 版本的檔名 = 桌面版原檔名 + `" - Mobile"` 後綴(副檔名前面),例如 `BTPC — Debug the Pipeline One Layer at a Time.png` 對應 `BTPC — Debug the Pipeline One Layer at a Time - Mobile.png`。實際檔名裡這個後綴前面的空格數量不一定統一(踩過的坑:同一批檔案裡有的是一個空格、有的是兩個空格),寫資料檔的路徑字串時要照資料夾裡實際存在的檔名逐字對照,不要自己假設空格數量。

### YouTube 影片嵌入(`{ type: 'youtube', src, alt }`)

**外部 YouTube 影片用專屬的 `youtube` 類型,不要塞進 `video` 類型**——`video` 類型放的是本地檔案(`<video src="...">` 直接播放檔案),YouTube 影片必須用 `<iframe>` 嵌入 YouTube 自己的播放器,兩者渲染方式完全不同,不能共用同一個 `type`。`src` 直接給 YouTube 網址就好(`https://youtu.be/xxx` 或 `https://www.youtube.com/watch?v=xxx` 兩種格式都支援),`extractYouTubeId()` 會自己解析出 11 碼的影片 ID 組出 embed 網址,不需要手動轉換。

**iframe 用 `aspect-video`(16:9)容器包住,不是自由高度。** `<img>`/`<video>` 有素材本身的原始尺寸可以量(`initMediaColumnHeights()` 靠這個算 `--accordion-max-h-<id>`),但 `<iframe>` 沒有「原始尺寸」這回事——不給明確的長寬比,高度會塌陷成 0。用 CSS `aspect-video` 讓高度直接由容器寬度換算出來,`initMediaColumnHeights()` 的量測邏輯也對應更新:`.youtube-embed-wrapper` 這個元素不需要等任何 `load`/`loadedmetadata` 事件(不像圖片/影片要等素材真的下載完才有正確尺寸),layout 算完就能立刻讀到高度,直接計入區塊的最大高度計算。

**不支援 `{ desktop, mobile }` 物件**——YouTube 沒有「手機版影片」這回事,`src` 只接受純字串網址。YouTube 影片也不會觸發 lightbox(跟 `video`/`placeholder` 一樣,只有 `type: 'image'` 才有 lightbox)。

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

`<title>` 後面緊接著也要固定放 favicon 兩個 `<link>` 標籤(見下面「網站圖標」),三個共用殼都是這個順序。

## Blog 文章系統

**Blog 用「單一 data set + 樣板引擎」架構,跟 Case study 樣板系統是同一個精神,但不是同一套程式碼**——case-study-template.js 服務的是三欄、手風琴、scroll-snap 媒體欄那種版面,Blog 文章是單欄由上到下的閱讀版面,兩者版面邏輯差異夠大,所以是獨立的 `js/blog-post-template.js`,不是把 Blog 硬套進 case-study 的樣板裡。

**只有一個 `blog-post.html` 殼,不是每篇文章各自一個 html 檔案。** 使用者點進某篇文章時,頁面讀取網址上的識別碼、才去 `data/data-blog.js` 的 `BLOG_POSTS` 陣列裡找出對應那篇的資料來渲染——不是把全部文章內容一次性載入到頁面。

- **網址識別碼用 query string**(`blog-post.html?slug=<slug>`),不是 hash——首頁的 `#blog` 這個 hash 已經是 WORKS/BLOG/PLAY 分頁狀態在用(見下面「首頁 WORKS/BLOG/PLAY 分頁切換」),跟「這篇文章是哪一篇」是兩件不同的事,用不同機制表達比較不會混淆。`js/blog-post-template.js` 用 `new URLSearchParams(location.search).get('slug')` 讀取,找不到對應文章時顯示一個簡單的「找不到這篇文章」畫面 + 回 Blog 分頁的連結,不會整頁壞掉。
- `data/data-blog.js` 的 `BLOG_POSTS` 是**唯一資料來源**,首頁 BLOG 分頁的卡片清單(`index.html` 呼叫 `initWorksGrid()` 前用 `.map()` 現算出來的 `{title, category, href, thumbnail}` 形狀)跟 `blog-post.html` 的文章內文,兩邊都吃同一份資料,不是分開維護兩份。卡片的 `category` 欄位借來放文章日期(`post.date`),`href` 是 `blog-post.html?slug=${post.slug}`,`thumbnail` 是 `post.coverImage`。
- **文章內頁是純文字版面,不渲染任何圖片/影片**——`coverImage` 只用在首頁卡片縮圖,不會出現在 `blog-post.html` 本身。單篇文章物件格式:`{ slug, title, date, coverImage, author, content: [...] }`。`content` 是結構化區塊陣列,依序渲染,種類自由混用:
  - `{ type: 'paragraph', text }` — 一般段落(可含 `<strong>子標題</strong>` 這種內嵌強調,跟 case-study 段落的慣例一致)
  - `{ type: 'heading', text }` — 小標題
  - `{ type: 'quote', text }` — 引言(blockquote)
  
  **沒有 image/video 類型**——這是刻意的規則,不是還沒做完;之後新增文章時不要把封面圖或影片連結塞進 `content` 裡,`js/blog-post-template.js` 不會渲染它們。未知/沒寫的 type 會 fallback 當成 paragraph 處理,不會整頁壞掉。目前也沒有 list(項目符號清單)這個類型——遇到列點式的內容,目前的做法是拆成多個各自帶 `<strong>標籤:</strong>` 前綴的 paragraph(跟 case-study 用 `<strong>子標題</strong>` 的慣例一致),不是另外發明一個新類型;如果之後常態性需要真的清單,再跟 Tim 討論要不要擴充。
- **首頁卡片上的兩位數流水號(01./02./...)不存在資料裡**,是 `js/works-grid.js` 依 `BLOG_POSTS` 陣列目前的排列順序即時算出來的(`initWorksGrid()` 的 `tabs.blog.numbered: true`)——新增/調整文章順序時編號自動跟著對,不需要手動維護,也不會跟 Works 分頁的卡片共用這個行為(Works 沒有 `numbered: true`,標題維持原樣不加編號)。
- **Blog 卡片縮圖用 `object-cover` + `object-center` 從中心點裁切填滿容器**(`initWorksGrid()` 的 `tabs.blog.cropThumbnails: true`),跟 Works 卡片原本的 `object-contain`(完整顯示原圖比例,不裁切)是刻意的分歧,不是不一致——Works 縮圖通常是作品截圖/Logo,裁切可能切掉重要內容,所以維持不裁切;Blog 封面是純攝影/情境照,裁切填滿才有雜誌感,留白反而顯得廉價。`buildWorkCard(item, numberPrefix, cropThumbnail)` 的第三個參數只有 `tabs.<key>.cropThumbnails` 開了才會傳,兩種卡片共用同一份樣板函式,不是各自客製一份。
- **`blog-post.html` 的 `<body>` 套用跟 Hero 一樣的 `.dot-grid` 圓點網格背景**(`bg-cream dot-grid`),不套跑馬燈——純粹是背景紋理裝飾,維持文章內容清晰可讀,不需要 Hero/About 那套 `initMarquee()` 邏輯。
- 版面/字體/顏色沿用既有 token,沒有另外發明新角色:大標題用跟 case-study 頁一樣的 `font-unbounded font-extrabold`;back 連結、作者/日期 meta 用跟 case-study 一樣的 `font-geistmono text-xs text-muted`;段落用跟 case-study 完全一樣的 `font-geist text-xs leading-[1.8] text-muted`。小標題(`heading` 區塊)目前沒有現成的角色可以直接借,用 `font-geist font-semibold text-sm text-ink` 跟本文拉開一階區隔——不用 Unbounded,因為那是給「巨大展示標題」的角色,小標題字級不到那個量級。
- **文章之間的交互參照,只有明確對應得上網站上已發布文章的才轉成真正的站內連結**(`<a href="blog-post.html?slug=...">`,直接寫在 `paragraph` 的 `text` 裡,`content` 支援內嵌 HTML,不需要額外欄位)——Tim 的逐字稿裡常帶著 Obsidian 的 `[[雙方括號]]` 交互參照語法,但大多數連到的是他個人筆記系統裡的其他筆記,不是這個網站上已發布的文章,照樣轉連結會變成死連結。目前的做法是逐篇檢查,只轉確定連得到的那幾個,其餘的整段(通常是文章結尾的「Related: [[...]] · [[...]]」清單)先不渲染,不要整段照抄或猜測性地連過去。
- 首頁卡片標題超過兩行會截斷加「...」、標籤(日期)獨立一排、不會被標題擠壓——這是共用卡片樣板(`buildWorkCard()`)的規則,細節見下面「元件慣例」的卡片小節。

## 顏色 token(定義在 `js/theme.js`)

| Token | 色碼 | 用途 |
|---|---|---|
| `ink` | `#111111` | 主要文字(標題、卡片標題、內文主色) |
| `muted` | `#706F6A` | 次要文字(說明文字、meta 資訊、design type) |
| `label` | `#878787` | Section 標籤/eyebrow 文字(比 muted 更淡一階) |
| `cream` | `#F9F7F2` | 暖米白——Hero 區塊、work-detail 整頁背景 |
| `stone` | `#F2F2F0` | 中性灰白——浮動 Nav 背景(2026-08-26 之前也是 `<body>`/All Works grid 的背景,現在首頁全站統一用 `cream` + `dot-grid`,`stone` 只剩浮動 nav 這個用途,詳見下面「首頁全站背景」) |
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
- 版面寬度不要寫死(不要 `w-[1344px]` 這種),用「總寬度 − 左右邊界」或 `max-w-[...]` + `mx-auto` 表達。**首頁的水平邊界一律用 `px-[var(--page-margin-x)]`(定義在 `css/style.css`,`clamp(1.25rem, 4vw, 2.5rem)`),不要另外幫某個容器訂一組 `max-w-[...] + mx-auto + 自己的 clamp padding`。** 2026-08-26 修過一個坑:`<main>`(包住 `#works` 的容器)原本是 `max-w-[1600px] mx-auto px-[clamp(1.25rem,3.33vw,3rem)]`,在夠寬的螢幕上(超過 1600px + padding)`mx-auto` 會讓左右各多出「(視窗寬度 − 1600px)/2」的置中留白,疊加在自己的 padding 上,結果 All Works 區塊的實際左右邊界比 Hero/About 用 `--page-margin-x` 算出來的邊界寬得多——兩者理論上該對齊(同一頁面同一套邊界),但因為各自用不同公式,肉眼看起來明顯「Works 區塊縮進去一大截」。改成跟 Hero/About 一樣直接 `px-[var(--page-margin-x)]`(拿掉 `max-w`/`mx-auto`)後才真正對齊。之後任何新的首頁區塊容器,水平邊界都直接套這個變數,不要自己另外設計一套「max-width 置中」的邊界邏輯。
- Grid 欄數要 responsive。首頁 All Works grid(`#worksGrid`)是手機 1 欄、平板以上 2 欄(`grid-cols-1 sm:grid-cols-2`,不再往 `lg:` 加到 3 欄)——2026-08-26 改成大方展示的大卡片版面後,2 欄是刻意定案的上限,不是還沒補完 `lg:` 斷點,加大卡片尺寸換取更有份量的視覺效果,同一畫面能看到的作品數量變少是預期的取捨。其他 grid(如果之後有）不受此限制,可視情境沿用手機 1 欄、平板 2 欄、桌面 3 欄的舊斷點。

## 動態/響應式文字的溢出安全檢查

Hero 大字(`js/hero-glitch.js`)這類「字級/內容都會動態改變」的元件,踩過好幾次溢出的坑,教訓整理成以下規則,新頁面如果也有類似的動態文字(字級隨內容/容器寬度變動、或有隨機亂碼/跑馬燈這類生成文字),都要延續這套做法:

- **量測邊界一定要跟其他 UI 列共用同一套基準,不要另外定義一份寬度計算。** 全站的水平邊界統一是 `--page-margin-x`(見下面「版面與間距」),量「這個元件現在有多少可用寬度」時,要用「容器 `clientWidth` 扣掉左右 padding」這個算法(對應 `js/hero-glitch.js` 的 `getAvailableWidth()`),不要直接量整個 viewport 寬度或另外寫一套。這樣算出來的安全字級才會跟 utility bar/版本列這些用同一個 `--page-margin-x` 的其他列真正對齊,不會發生「這個元件自己以為沒溢出,但跟旁邊那排的邊界線對不上」的情況。用 Playwright 驗證時同理:要抓「內容實際邊緣」(例如 utility bar 裡最後一個 `<span>` 的 `getBoundingClientRect().right`),不要抓外層還帶 padding 的容器本身,否則會多算一段 padding、誤判成安全。
- **任何「先算完字級/尺寸、才疊加隨機效果(如亂碼字數)」的地方,隨機效果本身也要通過同一套邊界檢查,不能算完之後才疊上去繞過檢查。** 亂碼字數如果是跟字級無關的獨立隨機值,兩者疊在一起實際渲染寬度可能遠超容器——安全上限要用「這次實際會套用的字級」反推「這個字級下最多能塞幾個字元」,不是分開各自夾在自己的安全範圍內就假設疊加後也安全。
- **用隨機字元集(如亂碼)估寬度時,不要用「隨機抽一段樣本量平均寬度」——字元集寬窄差異大時,平均值會被抽樣運氣影響,可能低估真正的寬度需求。** 改成量測字元集裡「單一最寬字元」的寬度(只需算一次、cache 起來給整個頁面共用),用這個當作每個字元的保底寬度上限,不管實際隨機抽到哪個組合,寬度都不可能超過用這個值算出來的長度上限——這是用保證值取代機率賭注。
- **容器尺寸變化的監聽,優先用 `ResizeObserver` 觀察容器本身,不要只依賴 `window` 的 `resize` 事件。** `resize` 事件不保證每一次尺寸變化都會觸發,瀏覽器在渲染負載較重時(同一頁面有多個動畫同時在跑)可能合併/跳過部分事件,導致某幾次變化完全沒有對應的重新校準。`ResizeObserver` 直接綁定渲染引擎自己的版面尺寸帳本,沒有這種事件遺失的風險。
- **如果元件有「動畫進行中不應該被重新校準打斷」的狀態(如故障動畫、轉場),被這個狀態擋下的尺寸變化不能就這樣憑空消失——記一個 pending flag,狀態結束時立刻補做一次校準**,不要假設「反正等下一次事件或下一輪動畫自然會校正」,那段空窗期就是使用者實際看得到的溢出。
- **用 Playwright 驗證「尺寸變化後有沒有正確反應」時,commanding resize 之後要留至少一次 animation frame 的 settle 時間再量測(例如 `await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))`),不要在下完 resize 指令後零延遲立刻量。** `ResizeObserver`/`resize` 事件的 callback 本來就是非同步、批次在下一個影格才觸發,零延遲量測到的「溢出」其實是量測方法本身的假訊號,不是真的 bug——這個坑已經在這次調查中親自踩過,浪費不少時間才確認是測試手法問題。真的要測「使用者體感」,量測前留下 settle 時間才是對照使用者實際感知的方式。

## 首頁全站背景:cream + dot-grid + 跑馬燈從 Hero 延續到 All Works

**2026-08-26 定案**:首頁 `<body>` 直接套 `bg-cream dot-grid`(不再是 `bg-stone` 素色),讓 Hero 底下接的 All Works 區塊(`#works`,`<main>` 包住、本身沒有另外設定背景)自然沿用同一個圓點網格背景,捲動下去不會有「Hero 是有紋理的米白、All Works 突然變成一片平面灰白」的視覺斷層。`#about` 區塊本身有自己明確的 `bg-black dot-grid-dark`,套在深色底、不受這個改動影響。

**套在 `<body>` 這一個元素上,不要分別套在 `<header>` 跟 `#works` 兩個區塊上**——`.dot-grid` 是 `background-image` 的固定尺寸圓點網格(`background-size: 24px 24px`,見 `css/style.css`),如果 Hero 跟 All Works 各自獨立套用,兩個元素會各自從自己的 `(0,0)` 起點重新平鋪網格,兩者交界處的圓點間距很容易對不齊、出現一條「接縫」(除非 Hero 的高度剛好是 24px 的整數倍,而 `min-h-screen` 顯然不會剛好整除)。套在同一個 `<body>` 上是唯一能保證從頭到尾一張連續、不斷點的網格的做法。

`bg-stone` 現在只剩浮動 nav 自己的背景色(nav 本身有獨立的 `bg-stone` class,不是繼承 body),不再是頁面級的背景 token——調整首頁背景相關樣式前,先確認是要改「全站背景」(改 body)還是「某個獨立元件自己的底色」(nav/卡片這類有自己 `bg-*` class 的元件),不要混著改。

**跑馬燈也比照辦理,不是只延續了圓點背景卻漏掉動態效果。** `#works` 區塊(`relative`)裡加了 `#worksMarqueeField`(`absolute inset-0`,DOM 順序放在 `#worksHeader` 前面),呼叫方式跟 Hero/About 一樣寫在 `js/hero-marquee.js` 檔案最底部(`initMarquee('worksMarqueeField', { color: 'var(--ink)', opacitySteps: [...] })`,參數跟 Hero 完全一樣,因為兩者都是 `bg-cream` 淺色底)——這個欄位是寫在 `index.html` 的靜態 html,頁面一載入就存在,不像 case study 頁那種動態渲染出來的欄位需要等特定時機才能呼叫 `initMarquee()`。`#worksHeader`(「[ ALL WORKS ]」標籤)加了 `data-protect`,跟 Hero 保護 `#heroText`、Hero 保護大標題同一個道理,避免跑馬燈疊在這個區塊最顯眼的標籤文字上;`#worksGrid` 底下的卡片本身沒有另外保護,跑馬燈可能會有極低透明度的文字飄過卡片圖片上方,這是刻意接受的「低調噪點」效果,不是遺漏。

## 首頁捲動敘事:About / Resume / Footer

首頁的捲動順序是固定的:**Hero → All Works → About(黑底+圓點+跑馬燈+wordmark+聯絡資訊,pin 住) → Resume+Footer(同一個 pin 內三段式交叉淡出淡入)**。這一節記錄這套機制的規則,新增/調整任何 pin 住的捲動效果都要延續這裡的做法,不要另外發明一套。

**Hero 大字(`#heroText`)原本也套過「往下捲動離開視窗時 pin 住 + opacity 淡出」的效果,2026-08-26 拿掉了**——Tim 要求大字不要再跟著捲動消失,`<header>` 現在就是一般內容區塊,捲過去就自然被往上推出視窗,不需要 pin 或任何淡出動畫。拿掉這段之後,`js/hero-scroll-fade.js` 只剩 About 區塊這一處 pin+scrub 應用,不是這一節標題原本講的「Hero 跟 About 各一處」。如果之後想再幫某個區塊加類似的「pin 住 + scrub 淡出/交叉淡出」效果,下面幾條規則(尤其是 timeline 不留 hold、`autoAlpha` 而非 `opacity`)仍然是要延續的做法,不要因為 Hero 那個範例被拿掉就重新發明一套。

- **`js/hero-scroll-fade.js` 是這套「pin + scrub」機制唯一的定義位置,不要在別的檔案裡各自寫一份 ScrollTrigger。** 目前的應用是 About 區塊三段式交叉淡出淡入(wordmark 淡出 → 姓名/電話/email 位移重新編排 → Resume 淡入 → Footer 淡入,全部 pin 在 `#about` 一個區塊內):建一個 `gsap.timeline()`,把多個 tween 用時間軸座標(0–1)安排重疊/交錯,再用 `ScrollTrigger.create({ trigger, start:'top top', end:'+=N%', pin:true, scrub:true, animation: tl })` 把 timeline 綁到捲動進度。
- **淡出淡入一律用 GSAP 的 `autoAlpha`,不要用單純的 `opacity`。** `autoAlpha` 在數值到 0 時會自動加 `visibility:hidden`,避免「視覺上淡出了,但底下的按鈕/連結還能被點到或被 tab 鍵取得焦點」——這個專案有好幾個淡出區塊本身是互動元件(手風琴按鈕、社群連結),這個坑很容易忽略。
- **timeline 裡不要留任何「動畫已經跑完、但還要再撐一段捲動距離才放開 pin」的空白 hold 段。** 早期版本在最後一個 tween 後面多接了一段 `duration:0.25` 的 filler 想留緩衝時間,結果使用者的體感是「畫面明明已經定格了,卻還要再多捲一段空白距離」才會看到下一個區塊——已用 Playwright 精確量到這個落差。正確做法:讓 timeline 的總長度直接由**最後一個有意義的 tween**的結束時間決定(不額外加 filler),GSAP scrub 會把這個總長度對應到 pin 的 `end`,「動畫跑完」跟「pin 解除」永遠是同一個時間點。
- **如果 pin 住的區塊是全站最後一個區塊(後面沒有其他內容),不需要刻意計算「捲到底剛好放開 pin」——這件事會自動成立。** 因為 pin-spacer 的高度就是頁面在該區塊「捲得到的最大距離」的唯一來源,只要 timeline 本身沒有多餘 hold(見上一條),pin 的 `end` 自然就等於 `document.body.scrollHeight` 的極限,使用者捲到真正的頁面底部時動畫剛好也定格完成,不會有多餘的可捲動空白。這個特性已用 Playwright 精確驗證過(`pin 的 end` 與 `maxScroll` 兩個數字完全相等)。
- **一個 ScrollTrigger 的 `end` 如果依賴「後面還有多少內容可以繼續捲」,要確認那段內容真的夠長,不然 end 條件永遠達不到、動畫會卡在半途。** 踩過的坑:原本 Resume 淡出的 `end` 設在 `'bottom top'`(內容捲到視窗頂端才算數),但底下接的 `<footer>` 遠矮於一個視窗高度,頁面實際可捲動的距離根本不夠長,導致動畫永遠卡在半淡出的中間狀態。修法是把 `end`/`endTrigger` 綁在**保證捲得到的參考點**(例如頁面最底部元素的 `'bottom bottom'`),不要綁在一個可能捲不到的位置。
- **背景圖層(`.dot-grid`/`.dot-grid-dark` 圓點網格)、跑馬燈、跟疊在它們上面的內容文字,是三個獨立圖層,調整可讀性時不要混在一起處理。** 曾經為了讓 Resume 文字在跑馬燈背景下更清楚,直接在文字容器上加一層 `bg-black/60` 半透明遮罩——結果因為這層遮罩蓋住了下面**所有**東西(跑馬燈跟圓點背景都在它下面),圓點背景也跟著被誤傷變淡。正確做法是只調暗需要變淡的那個圖層本身(例如把跑馬燈**容器自己的** `opacity` 用同一條 timeline 往下調,不要蓋一層遮罩去間接影響它),圓點背景維持在自己的 CSS 屬性上,不受任何 timeline 影響。
- **元素從一種版面邏輯(如橫向多欄分散)動畫過渡到另一種版面邏輯(如垂直堆疊靠左)時,不要整個容器共用同一個位移——容器內每個子元素各自的移動距離通常都不一樣(有的要左移很多、有的只要下移一點),要各自獨立的 x/y tween。** 落點座標不要用猜的或寫死的 px,改成在 DOM 裡放一個永遠 `opacity:0`、`aria-hidden="true"` 的隱藏「範本」,照目標版面的最終樣子排好(這個範本本身也同時用來在目標容器裡佔版面空間,讓後面的內容自然被推到正確位置),再用 `getBoundingClientRect()` 量測每個動畫元素跟它在範本裡對應元素的座標差,當作 tween 的目標值。量測前記得先把來源元素自己的 x/y 重設回 0 再量、量完再還原,不然「量測當下剛好動畫跑到一半」會讓算出來的差值疊加舊的位移量,越量越偏。
- **落點座標的 tween 用函式(`x: () => computeDelta().x`)而不是量一次就寫死的數字,並且在 `ScrollTrigger.create()` 加 `invalidateOnRefresh: true`。** 這樣視窗尺寸改變、版面跟著重排時,GSAP 會在下一次 refresh 重新呼叫這個函式拿新的距離,不會停留在舊尺寸量出來的錯誤位移量。
- **`prefers-reduced-motion: reduce` 的 fallback 不能只是「什麼都不做」,要確認拿掉動畫之後版面本身還是合理的。** 這個專案的 pin+cross-fade 效果依賴多個圖層互相疊在同一塊區域(用 `position:absolute` + `autoAlpha:0` 初始隱藏),如果 reduced-motion 版本什麼都不改,使用者會看到「本來該淡入淡出的內容,現在直接卡死疊在最上層」或「該顯示的內容永遠透明」這類殘留狀態。做法是額外寫一個 `mm.add('(prefers-reduced-motion: reduce)', ...)` 分支,把疊層的元素改回 `position:relative`(讓瀏覽器用一般文件流依序排列)、該顯示的直接設 `autoAlpha:1`,任何「只服務動畫、不服務 fallback 版面」的隱藏範本/占位元素也要在這個分支裡收掉它佔的空間(`height:0`/`marginBottom:0`),不然 fallback 版面會多出一段莫名其妙的空白。

## 首頁 WORKS/BLOG/PLAY 分頁切換

底部浮動 nav 的 WORKS、BLOG、PLAY,**是同一個 `#worksGrid` 容器的三種資料來源切換,不是頁面之間的路由跳轉**——概念上比照 Instagram 個人主頁貼文/珍藏分頁切換的體驗,不是點連結跳到 `blog.html`。HOME/ABOUT 維持原本各自的捲動行為(HOME 捲回 Hero 頂端、ABOUT 捲到 About 區塊「完成態」),只有 WORKS/BLOG/PLAY 屬於這套機制。

**WORKS 跟 PLAY 是同一份「作品」內容依類型拆成兩個分頁,不是兩種不同性質的資料**(這點跟 BLOG 不一樣,BLOG 是完全獨立的文章系統)——PLAY 收 Motion Graphic / Graphic Design 這兩類偏視覺/動態的作品(The Criterion Channel Brand Identity、Cyber Spell: Discord、Psycho Thrills、The Serious Business of Comedy、LDN 24),WORKS 留偏 UX/產品/互動裝置類的作品(VisionControl.AI、MPAA、OkoEcho、A Message To The End.、MahJong Ledger)。兩份清單分別是 `data/data-works.js` 的 `WORKS_DATA`/`PLAY_DATA` 兩個陣列,同一個檔案,格式完全一樣。新作品要放哪個分頁,依它的 `category` 貼近哪一邊決定,不是固定規則——之後如果分類界線變模糊,再跟 Tim 確認要不要調整某個作品的分頁歸屬。

**運作方式**(`js/works-grid.js` 的 `initWorksGrid()`):
- 底部 nav 的 WORKS/BLOG/PLAY 連結加 `data-tab-link="<tab key>"`,由 `initWorksGrid()` 統一攔截 click(`preventDefault()`),原地換 `#worksGrid` 的內容 + `#worksHeader` 的標題文字,**不會觸發真正的頁面導覽/reload**。
- 三個分頁共用同一份卡片樣板(`buildWorkCard()`),`tabs.<key>.items` 統一是 `{ title, category, href, thumbnail? }` 格式(`thumbnail` 可省略,沒有縮圖時卡片維持 `bg-card` 色塊當佔位框)。WORKS/PLAY 直接吃 `data/data-works.js` 的對應陣列;BLOG 的原始資料(`data/data-blog.js` 的 `BLOG_POSTS`)存的是完整文章內容給 `blog-post.html` 用(見「Blog 文章系統」),不是這種卡片形狀,`index.html` 呼叫 `initWorksGrid()` 前用 `.map()` 現算出卡片形狀的清單再傳進去。
- `tabs.<key>.numbered: true` 時,卡片標題前面會加兩位數流水號(01./02./...),編號依 `items` 陣列目前的排列順序即時算出來,不需要寫死在資料裡——目前只有 Blog 分頁在用。
- 內容切換用 GSAP `autoAlpha` 淡出→換內容→淡入,時長 300ms——沿用這個頁面卡片 hover(`duration-300`)、底部 nav 淡入淡出(`transition duration-300`)已經定案的節奏,不是另外挑一個新數字。
- **網址會用 `history.pushState` 更新 hash**(WORKS 是預設分頁,網址不帶 hash;BLOG 是 `#blog`,PLAY 是 `#play`)——這個過程不觸發真正的頁面導覽,純粹是 JS 讀取這個狀態去決定顯示哪個資料集。這樣重新整理或分享連結都能正確停在對應分頁;也監聽了 `popstate`,瀏覽器上一頁/下一頁一樣會正確換回對應分頁的內容,不會出現「網址列顯示的分頁跟畫面對不起來」的情況。
- 點擊 WORKS/BLOG/PLAY 後會順便 `scrollIntoView` 捲回 `#works` 容器——使用者點了是想看到對應內容,如果人還停留在頁面其他區塊(例如 About),內容換了但畫面沒捲過去,等於看不到剛剛切換的結果。
- **卡片本身會隨捲動進場**(2026-08-26 加):`applyTab()` 換完內容後呼叫 `wireCardReveal()`,用 `gsap.set(cards, { autoAlpha: 0, y: 24 })` 把卡片先藏起來,再用 `ScrollTrigger.batch(cards, { start: 'top 90%', onEnter: ... })` 讓捲進視窗的那一批卡片一起用 stagger(`stagger: 0.08`)淡入 + 上移歸位——用 `ScrollTrigger.batch()` 而不是自己手寫 IntersectionObserver 判斷延遲時間,同一批進入視窗的卡片自動群組、自動算 stagger。只給 `onEnter`(沒有 `onLeaveBack`),所以是「捲入視窗淡入一次就定格」,不是每次捲出去再捲回來都重新淡出淡入。切換分頁時舊卡片被整批換掉,`wireCardReveal()` 一開始會先 `kill()` 掉上一輪殘留的 ScrollTrigger 實例再重建,不會累積殘留;因為 `ScrollTrigger.batch()` 建立當下就會檢查「這批卡片現在是不是已經在觸發區內」,所以切換分頁當下如果新卡片剛好已經在可視範圍(常見情況——使用者通常就是在看著 `#works` 的時候點的 tab),會立刻觸發淡入,不會卡在「藏起來但沒有任何東西會讓它出現」的狀態。`prefers-reduced-motion: reduce` 時直接 `gsap.set(cards, { autoAlpha: 1, y: 0 })`,不建立任何 ScrollTrigger,卡片維持一般文件流直接顯示。

**`#works` 有 `min-h-screen`(見 `index.html`),不是靠內容自然撐出高度。** WORKS/PLAY 各 5 張卡片、BLOG 目前只有 1 篇文章,三個分頁的內容量差很多,沒有這個下限的話,內容少的分頁高度會矮到同一個視窗裡同時看到上方 Hero 或下方 About(黑底)的殘留背景——不管是使用者自然往下捲動經過這個區塊,還是點 tab 切換過去,都要維持「這個區塊至少填滿一個視窗高度」的視覺慣例。

**點擊 WORKS/BLOG/PLAY 的捲動時機刻意等內容真的換完才觸發,不是點擊當下立刻捲。** 踩過的坑:舊寫法在點擊當下就同步呼叫 `scrollIntoView`,這時 DOM 還是切換前的舊內容、高度也還是舊的;瀏覽器據此鎖定一個捲動終點、開始 smooth-scroll,但 300ms 後 GSAP 淡出的 `onComplete` 才真的把內容換成另一個分頁的資料,文件高度瞬間變動,原本鎖定的捲動終點超出新的可捲動範圍,瀏覽器只能把捲動位置夾到新的上限——結果精確停在「比 `#works` 頂部還淺一點」的位置,螢幕上緣因此露出 Hero 尾端(圓點背景/版本號列)。修法是把 `scrollIntoView` 的呼叫時機移到 `applyTab()`(內容真正換完)之後,不是點擊的那一刻,這樣捲動目標從一開始就是最終正確的高度,不會被中途變動的文件高度打斷。

**內容切換也會呼叫 `ScrollTrigger.refresh()`。** 切換分頁改變 `#works` 的實際高度,連帶改變 `#about` 在文件裡的絕對位置,但 ScrollTrigger 快取的 trigger 起訖位置不會自動偵測這種非 resize 觸發的版面變動——不 refresh 的話,`js/hero-scroll-fade.js` 那個 pin 住 `#about` 的 ScrollTrigger 會繼續沿用切換前、已經對不準的位置,造成 pin 觸發時機跟實際畫面對不上。

**之後如果要新增第四個分頁(或幫某個分頁加子分類)**,延續同一套模式:`tabs` 物件多加一個 key,`items` 是 `{ title, tags, href, thumbnail? }` 格式(直接來自資料檔,或像 Blog 一樣從別的資料形狀 `.map()` 出來都可以),不需要改 `buildWorkCard()` 或分頁切換邏輯本身。

## 頁面載入動畫:圓點網格脈動(`js/page-loader.js`)

**三個共用殼(`index.html`/`case-study.html`/`blog-post.html`)都套用同一套進站/進入作品頁的載入動畫,不是各自寫一份。** 這是為了解決「點進頁面時內容還沒加載完整,直接看到半成品畫面」的體感問題——蓋一層 overlay 擋住底下還在初始化的內容(字型切換、跑馬燈/hero-glitch 這類 GSAP 動畫初始化、圖片/影片還沒到位造成的版面跳動),等內容真的準備好才掀開,而不是讓使用者看著頁面「組裝」的過程。

**視覺是圓點網格脈動,不是純 CSS 的 `.dot-grid`。** 兩者刻意用不同技術:`.dot-grid` 是 `background-image: radial-gradient(...)` 做的裝飾背景,沒辦法逐點控制;載入動畫需要每一顆圓點各自的 stagger 位移/縮放才能做出「從中心往外脈動」的效果,所以 `js/page-loader.js` 用 JS 動態生成一批 `<span class="loader-dot">` 節點(間距 48px,比裝飾用的 24px 更疏,避免節點數量太多拖慢效能),透過 `gsap.utils.distribute` 系統性地做 `grid: [rows, cols]` 的 stagger,不是隨機亂數。視覺上仍讀作同一套「圓點網格」語言,只是密度不同——這是刻意的取捨,不是不一致。

**三個殼的標記與初始化寫法完全一樣**(`<body>` 最上面):
```html
<div id="pageLoader" class="fixed inset-0 z-[9999] bg-cream flex items-center justify-center" aria-hidden="true">
  <div class="loader-dots"></div>
</div>
<script src="js/page-loader.js"></script>
<script>window.__pageLoader = initPageLoader();</script>
```
`initPageLoader()` 立刻鎖住捲動(`<html>` 加 `loading-lock` class,見 `css/style.css`)、生成圓點、開始脈動循環,回傳 `{ markReady() }`。**`blog-post.html` 原本沒有載入 GSAP**(純文字版面用不到),這次為了套用共用的載入動畫補上了 `<script src="https://unpkg.com/gsap@3/dist/gsap.min.js"></script>`。

**每個殼各自決定「內容真正就緒」的時機,呼叫 `window.__pageLoader.markReady()`——這是唯一每個頁面需要客製化的地方:**
- `index.html`:等 `document.fonts.ready` + `window.load`(所有圖片/影片 metadata 載完)兩者都完成。
- `case-study.html`:由 `js/case-study-loader.js` 的 `notifyReady()` 呼叫——不管最後是成功渲染、找不到作品(`?work=` 缺漏或對應資料檔不存在)、還是資料檔載入失敗,三條路徑都要呼叫,不然使用者會卡在載入畫面出不去;呼叫時機是 `renderCaseStudyPage()` 執行完(同步)之後,再等 `document.fonts.ready`。
- `blog-post.html`:`renderBlogPost()` 執行完(同步)之後,同樣再等 `document.fonts.ready`。

**`markReady()` 呼叫的當下不代表立刻隱藏。** `initPageLoader()` 內部會取「最短顯示時間」(預設 500ms,避免載入太快時動畫一閃而過像故障)跟「內容真的就緒」兩者較晚的那個,同時有一個「最長等待時間」的保險(預設 4000ms)——不管 `markReady()` 有沒有被呼叫到(例如某個資源意外卡住、程式碼有 bug 忘記呼叫),到時間一定會強制隱藏,不會讓使用者永遠卡住。隱藏動畫是圓點先各自縮小淡出(同樣用 `grid` stagger,從中心往外收)、整個 overlay 才淡出,結束後 `display:none` 移出版面並移除 `loading-lock`。

**`prefers-reduced-motion: reduce` 時跳過脈動循環跟位移類動畫**,圓點直接固定在中間亮度、隱藏時只做單純的 overlay 淡出——呼應全站其他動畫元件已經定案的 reduced-motion 處理原則(見「首頁捲動敘事」一節的對應說明),不是這裡另外發明一套。

**這套機制目前只服務「整頁導覽」(進站、進入 case study、進入 blog 文章),不套用在首頁 WORKS/BLOG/PLAY 分頁切換上**——那是同一個 `#worksGrid` 容器的資料來源切換(見上一節),不是真正的頁面導覽,本來就沒有「內容還沒加載完整」的問題,已經有自己的 GSAP `autoAlpha` 交叉淡出邏輯,不需要疊加這層 overlay。

## Responsive 斷點:兩套系統,不要混用

全站目前有兩組彼此獨立的 breakpoint 邏輯,新頁面要先分清楚自己屬於哪一種,不要混用:

1. **卡片 grid(首頁 All Works)**:用 `sm:`/`lg:` 做「欄數」漸進(1→2→3 欄),斷點在標準的 640px/1024px。
2. **Case study 版面(左欄側欄 + 右欄內容)**:預設(手機/平板)整個垂直堆疊成單欄——`intro-col` 是滿寬的一般區塊,右欄自然往下接,整頁跟著瀏覽器捲動。只有到 `lg:`(**1024px**)以上才切成「左欄固定寬度側欄 + 右欄自己捲動」的桌面版面。**這裡刻意選 `lg:` 不是 `md:`——Tailwind 的 `md:` 剛好等於 768px,如果用 `md:`,那平板尺寸會直接落在切換點上變成桌面側欄版,擠壓內容;`lg:` 才能確保手機到平板這段範圍都維持單欄。** 新增任何 case-study 版面的斷點(手風琴的 `max-height` 捲動優先權、intro-col 的寬度/border/`mt-auto`)一律用 `lg:`,不要臨時改用 `md:`。

驗證斷點有沒有生效,不要只看畫面「看起來」對不對——直接用 Playwright 量 `getComputedStyle(el).flexDirection` 或 `getBoundingClientRect()`,在斷點前一個像素(如 1023px)跟斷點本身(1024px)各測一次,確認切換的臨界點精確。

## 元件慣例

- **卡片(All Works grid)**:縮圖滿版貼齊卡片邊緣,不用邊框線,不留內距(2026-08-26 拿掉原本 `p-[clamp(1.25rem,3.5vw,3rem)]` 那層「相框」留白——Tim 明確表示不要圖片周圍那圈留白像裱框,圖片要 fill 整個容器)。縮圖容器直接是 `relative aspect-[4/3] rounded-xl overflow-hidden bg-card`——只有一層圓角(`rounded-xl`),不是舊版「外層相框 `rounded-xl` + 內層縮圖 `rounded`」兩層圓角疊在一起,因為現在只剩一層 div。`bg-card` 這個底色只在沒有 `thumbnail`(還沒準備素材)時才看得到,當佔位色塊用。圖片預設 `object-contain`,不裁切(Blog 分頁的卡片是刻意的例外,改用 `object-cover` 裁切填滿,理由見「Blog 文章系統」)——拿掉外層留白不等於改成裁切,`object-contain` 這條規則沒有變,只是原圖如果不是剛好 4:3,仍可能在 `aspect-[4/3]` 容器內留一點點內部信封留白,跟拿掉的那層外部相框留白是兩回事,不要混為一談。Hover 效果:卡片微放大(`scale-[1.01]`)+ 圖片變暗疊層,兩者都是 `transition` 300ms,現在套在縮圖容器本身(不是外層已經拿掉的相框 div)。**2026-08-26 也改成大方展示版面**(呼應 Tim 提供的參考截圖):標題不再跟分類同一排左右分佔,改成標題自己獨立一行(`line-clamp-2`,超過兩行截斷加「...」),下面接一整排可以自然換行的膠囊狀標籤(`flex flex-wrap gap-2`,每個 `border border-black/15 rounded-full px-3 py-1 font-geistmono text-[11px] sm:text-xs text-muted`)。標籤資料來自 `item.tags`(陣列,WORKS/PLAY 用,見 `data/data-works.js`);Blog 卡片沒有改成陣列,沿用舊的單一 `item.category`(借放日期),`buildWorkCard()` 裡用 `item.tags || (item.category ? [item.category] : [])` 統一成陣列處理,兩種資料格式共用同一份渲染邏輯,不是各自客製一份。搭配這次改版,`#worksGrid` 也從最多 3 欄改成最多 2 欄(見上面「版面與間距」),卡片本身跟著變大。
- **卡片縮圖可以是影片**:`thumbnail` 給 `.mp4`/`.mov`/`.webm` 路徑時,`buildWorkCard()` 自動渲染 `<video muted loop playsinline>` 取代 `<img>`,不需要在資料裡另外宣告類型(副檔名已經夠明確)。互動依裝置有沒有 hover 能力分兩種(`js/works-grid.js` 的 `wireHoverVideos()`,每次 `applyTab()` 換內容後重新綁一次,因為卡片是整批用 `innerHTML` 重新產生的新 DOM 節點):有 hover 的裝置(滑鼠)是移進卡片播放、移開暫停,預設靜止在第一影格,跟靜態縮圖的視覺一致,只有 hover 才會動;沒有 hover 的裝置(手機/平板觸控)改用 `IntersectionObserver`,卡片捲進視窗才播放、捲出視窗暫停——**這不是錦上添花,是修一個實際的顯示 bug**:觸控裝置沒有 `mouseenter` 事件,如果沿用桌面那套邏輯,縮圖會永遠停在空白畫面(iOS Safari 對從沒播放過的 `<video>` 常常連第一影格都不解碼),直到使用者點擊卡片離開頁面前都看不到內容。`prefers-reduced-motion` 時觸控裝置改成只在捲進視窗時跳到一個極小的時間點解碼出單一影格,不自動循環播放。`muted` 是瀏覽器允許 JS 呼叫 `play()` 的前提(未靜音的影片瀏覽器會擋自動播放,即使是使用者主動 hover 觸發的)。**影片檔案的編碼格式要用 H.264,不是 HEVC/H.265**——Mac 原生螢幕錄影/QuickTime 匯出常常預設用 HEVC(尤其 Apple Silicon,檔案比較小),但 Chromium 核心的瀏覽器(Chrome、Edge、大部分電腦/手機瀏覽器)不支援解碼 HEVC,只有 Safari 天生吃這個格式——這個坑已經在 `data-a-message-to-the-end.js` 的一支 `.mov` 上踩過:影片能載入、時長讀得到、聲音正常播放,但畫面完全是空的(`videoWidth`/`videoHeight` 回報 0),因為瀏覽器解不出視訊軌。新增任何影片素材前,先用 Playwright 檢查 `video.videoWidth > 0`(不是只看有沒有 404 或 `readyState`),不要只在 Mac/Safari 上肉眼確認就當作沒問題。
- **Case-study 標題列**:共用 `.col-header`(定義在 `css/style.css`)——固定 96px 高 + 垂直置中,這樣不同區塊不管裡面放純文字還是文字+按鈕,高度天生一致,底下內容才能自然對齊,不需要事後調整某一個的 margin 去湊。**這是這個專案最重要的一條系統規則,之後任何多欄/多區塊版面都要延續這個「固定高度共用標題列」的做法,不要回頭去個別調整每個的 padding。**
- **手風琴(Overview + sections)**:互斥展開(一次最多一個開著,允許全部收合),用 GSAP `gsap.to(el, {height: 'auto' 或 0})` 做展開/收合動畫——GSAP 原生支援 animate 到 `'auto'`,不需要手動量測高度或另外裝 plugin。Case study 頁面的邏輯統一寫在 `js/case-study-template.js` 的 `initAccordions()`,新增區塊不需要另外寫開關邏輯,資料物件的 `sections` 陣列會自動被納入同一套互斥邏輯。**不屬於 case study 資料格式的手風琴(例如首頁 Resume 區塊)改用 `js/accordion.js` 的通用版 `initAccordion(ids, options)`**——同一套「互斥展開 + `height:auto`」邏輯,但不綁 case study 的資料物件,靠 `#accordionHeader-<id>`/`#accordionContent-<id>` 命名慣例運作,呼叫時傳一組 id 陣列跟 `{ defaultOpenId }`。兩份手風琴邏輯目前刻意分開(一個服務 case study 的資料驅動渲染、一個服務手寫 HTML 的通用場景),新增手風琴前先判斷屬於哪一種情境,不要把 `initAccordion` 硬套進 case study 樣板、或反過來把 case study 邏輯搬進手寫頁面。
- **手風琴內容區的最大高度,有 media 的區塊用動態量測的 `--accordion-max-h-<id>` CSS 變數(每個區塊各自一個,不共用),純文字區塊直接用寫死的 `calc(100vh-192px)`。** 兩者分開處理是刻意的,不是不一致:有 media 的區塊需要「固定高度」(不是 max-height)才能讓左右分欄的 `h-full` 鏈正常運作(見 `buildTwoColumnShell()` 的完整說明),這個固定值只能用 JS 動態量測,因為每個區塊自己的素材長寬比不一樣;純文字區塊只是單欄 `max-height`,沒有 `h-full` 鏈的問題,直接用 CSS 公式最簡單、也不用等 JS 執行。`js/case-study-template.js` 的 `initMediaColumnHeights()` 對每個有 media 的區塊,量它自己所有媒體項目渲染高度的最大值,加上圓點指示器的高度(如果有兩張以上圖片、需要顯示圓點的話),再夾一個 `window.innerHeight - 192` 的視窗上限,動態設成這個區塊自己的 CSS 變數(fallback 600px,只在第一次 paint、素材還沒量完時短暫生效)。**圓點需要的高度是讓整個框變高去容納,不是從圖片的份額裡扣掉**——圖片一律維持原始尺寸,不因為加了圓點就被縮小。這個 max-height 同時解決**捲動優先權**:內容裝在帶 `overflow-y-auto` 的容器裡,瀏覽器原生的 nested scroll chaining 行為會自動先捲內部內容、捲到底再接手捲整個頁面,不需要用 GSAP ScrollTrigger/Observer 或任何 JS 判斷「捲到底了沒」——這是刻意選擇原生行為而不是重新實作,更穩定也更不容易在觸控板上出現卡頓。這個限制只在 `lg:` 生效,是因為手機/平板版本整頁本來就是自然捲動,不需要也不應該有巢狀捲動。
- **邊框/分隔線顏色慣例**:`border-black/10` 用在「分隔線」性質的地方(欄位之間、標題列底下的 hairline);`border-black/15` 用在「元件自己的邊框」(浮動 nav 的外框、圓形收合按鈕、虛線佔位框)。兩者色階很接近但用途不同,新增邊框前先想清楚是分隔還是元件邊框,對應套用。
- **邊界保護**:`css/style.css` 裡的 `html, body { overflow-x: hidden; max-width: 100% }` 是全站唯一、統一的橫向捲動防護,不要在個別頁面/元素上另外加 `overflow-x-hidden`。任何「巨大展示字級的容器」或「寬度會動態改變的 flex 欄位」都要記得加 `min-w-0`——flexbox 預設不會讓 flex item 縮小到比它內容的自然最小寬度還小,沒加這個常常會在內容變長/欄位變窄時把畫面撐出邊界。這個坑目前已經在兩個不相關的地方各踩過一次(巨大展示字、收合按鈕),遇到任何「寬度會變的 flex 子元素」都要主動加,不要等它爆版才修。

## 驗證方式

改完視覺/互動相關的東西,不要只看程式碼就回報完成——用 Playwright(`npx playwright install chromium` 若尚未安裝)實際開瀏覽器截圖、量測 DOM 座標(尤其是「對齊」類的需求,肉眼看螢幕截圖常常判斷不準,要 `getBoundingClientRect()` 實際量)、檢查 console error、檢查 `document.documentElement.scrollWidth` 有沒有超過 `clientWidth`(橫向捲動)。

## Push 前一定要先更新這份文件

**Tim 每次要求 push 到 GitHub 之前,先檢查這次改動有沒有新增/修改設計規則、檔案結構、元件慣例——有的話先更新 CLAUDE.md 反映最新狀態,確認內容跟實際程式碼一致之後,才執行 commit + push。** 不要 push 完才回頭補文件,也不要略過這一步直接 push。如果這次改動單純是內容調整、沒有動到任何系統性規則,就不需要為了湊而硬改文件,但要主動確認過一次,不是預設跳過。

**同一時間也要更新 Obsidian 裡的工作日誌**:`C:\Users\tim\OneDrive\黑曜石工作室 OneDrive\01. 作品\01. 專案\03. Personal Website\03. 每日進度紀錄.md`(2026-08-30 發現 vault 頂層資料夾已經從 `02. 作品` 改編號成 `01. 作品`,這裡的路徑跟著更新,之後如果 vault 結構又調整,同樣要回來修這裡)。把這次 push 之前做的工作、遇到的問題、怎麼解決的,照這份日誌原本的第一人稱、Day-by-day 的寫法補上去。順序是:更新 CLAUDE.md → 更新這份日誌 → commit → push。
