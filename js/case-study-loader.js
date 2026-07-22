/*
 * Case study 頁面的共用殼載入器——搭配 case-study.html(靠網址參數
 * ?work=<作品 slug> 決定顯示哪個作品)使用,讓新增一個作品的 case
 * study 頁不需要再建立獨立的 html 檔案,只需要一份
 * data/data-<作品 slug>.js。
 *
 * 用法:
 *   case-study.html?work=criterion-channel
 *   → 動態插入 <script src="data/data-criterion-channel.js">,該檔案
 *     宣告的 CASE_STUDY_DATA 載入完成後呼叫 renderCaseStudyPage()。
 *
 * 每個作品的資料檔各自宣告自己的 `const CASE_STUDY_DATA = {...}`
 * (見 js/case-study-template.js 檔案開頭的完整欄位說明)——同一個網頁
 * 同一時間只會動態插入一個資料檔的 <script>(依網址參數決定是哪一個),
 * 不會有多個 CASE_STUDY_DATA 同時宣告在同一個頁面裡撞名的問題。
 *
 * 全部四個作品(VisionControl.AI/MPAA/Criterion Channel/Cyber Spell:
 * Discord)都已經統一用這個共用殼,沒有任何作品還在用各自獨立的 html
 * 殼——新增作品一律延續這個模式,不要再建立 `<作品>.html` 這種檔案。
 */
(function () {
  const app = document.getElementById('app');
  if (!app) return;

  function buildNotFound() {
    return `
      <div class="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center">
        <p class="font-geistmono text-xs text-muted">找不到這個作品。</p>
        <a href="index.html" class="font-geistmono text-xs text-ink hover:text-muted transition-colors">← BACK TO HOME</a>
      </div>
    `;
  }

  const work = new URLSearchParams(location.search).get('work');
  if (!work) {
    app.innerHTML = buildNotFound();
    return;
  }

  const script = document.createElement('script');
  script.src = `data/data-${work}.js`;
  script.onload = () => {
    if (typeof CASE_STUDY_DATA === 'undefined') {
      app.innerHTML = buildNotFound();
      return;
    }
    document.title = `${CASE_STUDY_DATA.title} | Tim Shih`;
    renderCaseStudyPage(CASE_STUDY_DATA, '#app');
  };
  script.onerror = () => {
    app.innerHTML = buildNotFound();
  };
  document.head.appendChild(script);
})();
