# Tim Shih Portfolio — 專案設計系統

純 HTML/CSS/JS(Tailwind CDN + GSAP),沒有框架、沒有 build step。這份文件記錄目前已定案的設計系統,之後任何新頁面/新元件都應該延續這套規則,除非 Tim 明確要求改變。

## 檔案結構

- `index.html` — 首頁(Hero + All Works grid + Footer)
- `case-study-template.js` — **Case study 頁面的樣板引擎**,吃一個資料物件、動態生成整個三欄版面(見下面「Case study 樣板系統」)
- `data-vision-control.js` — Vision Control 這個作品的資料物件
- `data-demo.js` — 示範用假資料,證明樣板可以套用在不同內容上,不是正式作品,新增其他作品時可以參考它的結構
- `work-detail.html` — Vision Control 的 case study 頁,是一個薄殼:只負責載入 `case-study-template.js` + `data-vision-control.js`,呼叫 `renderCaseStudyPage()`
- `work-detail-demo.html` — 套用 `data-demo.js` 的展示頁,驗證樣板通用性用,不是要上線的正式頁面
- `theme.js` — **所有頁面共用的 Tailwind 設計 token(顏色 + 字體家族)**,新頁面一律載入這個檔案,不要自己重新定義一份顏色/字體
- `style.css` — 全站共用的少量原生 CSS(目前只有:防止橫向捲動的 `html,body` 規則、case-study 標題列共用的 `.col-header`)
- `script.js` — 首頁 Hero 即時時鐘

## Case study 樣板系統

**新增一個作品的 case study 頁,不要複製貼上 `work-detail.html` 改內容——寫一個新的 `data-<作品名>.js`,照 `case-study-template.js` 檔案開頭註解的資料格式填,然後複製 `work-detail.html` 當殼(只換 `<title>` 跟載入的 data 檔名),讓 `renderCaseStudyPage()` 去生成整個頁面。**

資料物件至少要有:`title`、`category`、`intro`、`author`、`backHref`、`media`(陣列,任意數量的圖片/影片/佔位項目)、`overview.paragraphs`(陣列,任意段數)、`sections`(陣列,任意數量的 `{title, content}`,這些就是底下的手風琴區塊,不是寫死 User Research/Process/Reflection 這幾個名字)。

版面邏輯(三欄結構、OVERVIEW 跟手風琴共用的展開/收合互動、hairline、`.col-header` 固定高度對齊)全部在 `case-study-template.js` 裡,不要因為某個作品需要客製化就把邏輯抄一份出去修改——如果樣板真的無法表達某個作品需要的東西,先跟 Tim 討論要不要擴充資料格式(例如加一個新的 media type),而不是繞過樣板直接寫死 HTML。

新頁面的 `<head>` 應該固定包含這個載入順序:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="theme.js"></script>
<script>tailwind.config = window.SITE_THEME;</script>
<link rel="stylesheet" href="style.css">
```

## 顏色 token(定義在 `theme.js`)

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
| `font-geistmono` | Geist Mono | **全站唯一的等寬字體。**所有「功能性 UI」文字都用這個:utility bar、index/version 列、nav 連結、section 標籤(如「[ALL WORKS]」「PROJECT」「DESCRIPTION」)、卡片標題、meta 資訊 |
| `font-geist` | Geist(Regular/SemiBold) | 一般內文、段落、次要說明文字 |

Geist Mono 已經統一成全站唯一的等寬字體,不要再用 Tailwind 內建的系統 `font-mono`(Menlo/Consolas 那組)——這是舊版本的過渡狀態,已經定案改掉了。任何「小型 UI 文字/標籤/標題」需要等寬感的地方,一律用 `font-geistmono`。

Unbounded 字重依情境不同:巨大 wordmark(首頁 Hero/Footer)用 `font-black`(900);case-study 標題用 `font-extrabold`(800,刻意降一階,因為在較小的字級下 900 太粗)。新頁面如果也要用 Unbounded 大字,先想清楚字級多大再決定字重,不要預設套 900。

## 字級與字距慣例

- 所有「功能性小字」(label、meta、utility bar)統一用 `text-xs`(12px),不要用 13px 這種不在 Tailwind 預設刻度上的任意值。
- 巨大展示字級(hero wordmark、日期數字)一律用 `clamp()` 做響應式縮放,不要寫死 px。換算公式:`vw 係數 = 目標px ÷ 14.4`(以 1440px 參考寬度反推),`floor` 值抓一個手機上不會爆版的安全下限。
- 字距(letter-spacing)用 em,換算公式是 `字距px ÷ 字級px = em 值`(不是隨便挑一個值)。目前的慣例:
  - Utility bar / index-version 列這類「品牌感」等寬文字:`tracking-[0.167em]`(寬)
  - Case-study 面板裡的功能性標籤(PROJECT、DESCRIPTION、作者資訊):`tracking` 不設(0),因為這是 Tim 對照 Figma 精確數字後的決定
  - 巨大 wordmark:`tracking-[-0.064em]`(負值,展示字級常見的收緊處理)

## 版面與間距

- 任何「大型、桌面基準」的間距數字(如 Figma 給的 120px 留白)都要轉換成 `clamp()`,不要在所有螢幕寬度下寫死同一個 px。小型間距(卡片內距、grid gap、段落間距)可以直接用 Tailwind 預設刻度(`gap-6`、`mt-10` 這種),不需要 clamp。
- 版面寬度不要寫死(不要 `w-[1344px]` 這種),用「總寬度 − 左右邊界」或 `max-w-[...]` + `mx-auto` 表達。
- Grid 欄數要 responsive:手機 1 欄、平板 2 欄、桌面 3 欄。

## 元件慣例

- **卡片(All Works grid)**:色塊呈現、不用邊框線,靠 `bg-card` 淺灰底色跟頁面背景做區隔,不要加 `border`。圓角 `rounded-xl`(容器)+ `rounded`(縮圖)。圖片一律 `object-contain`,不裁切。Hover 效果:卡片微放大(`scale-[1.02]`)+ 圖片變暗疊層,兩者都是 `transition` 300ms。
- **Case-study 標題列**:共用 `.col-header`(定義在 `style.css`)——固定 96px 高 + 垂直置中,這樣不同區塊不管裡面放純文字還是文字+按鈕,高度天生一致,底下內容才能自然對齊,不需要事後調整某一個的 margin 去湊。**這是這個專案最重要的一條系統規則,之後任何多欄/多區塊版面都要延續這個「固定高度共用標題列」的做法,不要回頭去個別調整每個的 padding。**
- **手風琴(Overview + sections)**:互斥展開(一次最多一個開著,允許全部收合),用 GSAP `gsap.to(el, {height: 'auto' 或 0})` 做展開/收合動畫——GSAP 原生支援 animate 到 `'auto'`,不需要手動量測高度或另外裝 plugin。邏輯統一寫在 `case-study-template.js` 的 `initAccordions()`,新增區塊不需要另外寫開關邏輯,資料物件的 `sections` 陣列會自動被納入同一套互斥邏輯。
- **「展開時至少要看到下一個標題」規則**:每個手風琴內容區都套 `max-h-[calc(100vh-192px)] overflow-y-auto`(192px = 自己的標題列 96px + 至少露出下一個標題列 96px)。這個 max-height 同時解決另一件事——**捲動優先權**:內容裝在這層帶 `overflow-y-auto` 的容器裡,瀏覽器原生的 nested scroll chaining 行為會自動先捲內部內容、捲到底再接手捲整個頁面,不需要用 GSAP ScrollTrigger/Observer 或任何 JS 判斷「捲到底了沒」——這是刻意選擇原生行為而不是重新實作,更穩定也更不容易在觸控板上出現卡頓。
- **邊界保護**:`style.css` 裡的 `html, body { overflow-x: hidden; max-width: 100% }` 是全站唯一、統一的橫向捲動防護,不要在個別頁面/元素上另外加 `overflow-x-hidden`。任何「巨大展示字級的容器」或「寬度會動態改變的 flex 欄位」都要記得加 `min-w-0`——flexbox 預設不會讓 flex item 縮小到比它內容的自然最小寬度還小,沒加這個常常會在內容變長/欄位變窄時把畫面撐出邊界。

## 驗證方式

改完視覺/互動相關的東西,不要只看程式碼就回報完成——用 Playwright(`npx playwright install chromium` 若尚未安裝)實際開瀏覽器截圖、量測 DOM 座標(尤其是「對齊」類的需求,肉眼看螢幕截圖常常判斷不準,要 `getBoundingClientRect()` 實際量)、檢查 console error、檢查 `document.documentElement.scrollWidth` 有沒有超過 `clientWidth`(橫向捲動)。
