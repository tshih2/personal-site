/*
 * Blog 文章頁樣板。
 * 吃 data-blog.js 的 BLOG_POSTS 陣列,依網址 ?slug= 找到對應那篇文章
 * 的資料,動態生成單欄的文章閱讀版面。跟 case-study-template.js 一樣
 * 走「資料/樣板分離」——只有一個 blog-post.html 殼,不是每篇文章各自
 * 一個 html 檔案,使用者點進某篇文章時才從陣列裡找出那篇的資料來渲染,
 * 不會把全部文章內容一次性載入到頁面。
 *
 * 用法:
 *   <div id="app"></div>
 *   <script src="js/blog-post-template.js"></script>
 *   <script src="data/data-blog.js"></script>
 *   <script>renderBlogPost(BLOG_POSTS, '#app');</script>
 *
 * 資料物件格式見 data/data-blog.js 檔案開頭的註解。
 *
 * 網址識別碼用 query string(?slug=xxx),不是 hash——首頁的 #blog 這個
 * hash 已經是 WORKS/BLOG 分頁狀態在用了(見 js/works-grid.js),跟「這篇
 * 文章是哪一篇」是兩件不同的事,分開機制比較不會混淆。
 *
 * **文章內頁是純文字版面,不渲染任何圖片/影片**——這是刻意的規則,不是
 * 還沒做完。coverImage 欄位只用在首頁 Blog 分頁卡片的縮圖,不會出現在
 * 文章內頁本身;content 陣列目前只支援 paragraph/heading/quote 三種
 * 區塊,沒有 image/video 類型。之後新增文章時,不要把封面圖或影片連結
 * 塞進 content 裡——這個樣板不會渲染它們。
 */

function renderBlogPost(posts, mountSelector) {
  const mount = document.querySelector(mountSelector);
  if (!mount) {
    throw new Error(`renderBlogPost: 找不到掛載點 "${mountSelector}"`);
  }

  const slug = new URLSearchParams(location.search).get('slug');
  const post = posts.find((p) => p.slug === slug);

  mount.innerHTML = post ? buildPost(post) : buildNotFound();
}

function buildPost(post) {
  return `
    <div class="max-w-2xl mx-auto px-6 py-16 lg:py-24">
      <a href="index.html#blog" class="font-geistmono text-xs text-muted hover:text-ink transition-colors">← BACK</a>

      <h1 class="mt-10 font-unbounded font-extrabold text-[2rem] sm:text-[2.75rem] leading-[1.1] tracking-[-0.034em]">${post.title}</h1>
      <div class="mt-6 flex items-center gap-3 font-geistmono text-xs text-muted">
        <span>${post.author}</span>
        <span>·</span>
        <span>${post.date}</span>
      </div>

      <div class="mt-12">
        ${post.content.map(buildContentBlock).join('\n')}
      </div>
    </div>
  `;
}

// 內文區塊——段落/標題/引言,種類自由混用、數量不限。刻意沒有
// image/video 類型(見檔案開頭註解「文章內頁是純文字版面」)。paragraph
// 是預設 fallback(未知的 type 也當段落處理,不會整頁壞掉)。字體/顏色
// 沿用 case-study-template.js 的 buildParagraphs() 同一套 token(font-geist
// text-xs text-muted),維持全站「同一個角色用同一套答案」的慣例——
// 小標題(heading)目前沒有現成的角色可以直接借,用 font-geist
// font-semibold text-sm text-ink 跟本文拉開一階區隔,不用 Unbounded
// (那是給「巨大展示標題」的角色,小標題字級不到那個量級)。
function buildContentBlock(block) {
  switch (block.type) {
    case 'heading':
      return `<h2 class="mt-12 font-geist font-semibold text-sm text-ink">${block.text}</h2>`;
    case 'quote':
      return `<blockquote class="mt-8 border-l-2 border-black/15 pl-6 font-geist italic text-xs leading-[1.8] text-ink">${block.text}</blockquote>`;
    case 'paragraph':
    default:
      return `<p class="mt-6 font-geist text-xs leading-[1.8] text-muted">${block.text}</p>`;
  }
}

function buildNotFound() {
  return `
    <div class="max-w-2xl mx-auto px-6 py-24 text-center">
      <p class="font-geistmono text-xs text-muted">找不到這篇文章。</p>
      <a href="index.html#blog" class="mt-6 inline-block font-geistmono text-xs text-ink hover:text-muted transition-colors">← BACK TO BLOG</a>
    </div>
  `;
}
