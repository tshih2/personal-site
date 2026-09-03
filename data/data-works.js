// 首頁 [ ALL WORKS ] / [ PLAY ] 兩個分頁的資料清單——搭配 js/works-grid.js
// 使用。欄位:title(卡片標題)、tags(分類標籤陣列,至少一個)、href
// (點擊連結目標,還沒有對應頁面時用 '#')、thumbnail(縮圖路徑,可
// 省略,沒有縮圖時卡片會維持 bg-card 色塊當佔位框,不會報錯或留白)。
//
// tags 是陣列(不是單一 category 字串)——2026-08-26 改成大卡片版面時
// 一併調整,每個作品現在顯示多個膠囊狀標籤(分類 + 平台/技術),不是
// 只有一個分類文字。
//
// PLAY 分頁收 Motion Graphic / Graphic Design 這兩類作品(跟 WORKS
// 分頁其餘偏 UX/產品/互動裝置的作品區隔開),資料格式跟 WORKS_DATA
// 完全一樣,只是拆成獨立的陣列給 index.html 的 initWorksGrid() 當
// 另一個 tab 的 items。
const WORKS_DATA = [
  { title: 'KINDRED', tags: ['PRODUCT DESIGN','UI / UX',], href: 'case-study.html?work=kindred', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/HERO_POSTER/BRAND%20POSTER%20_%201_2.png' },
  { title: 'OkoEcho', tags: ['Product Design','UI / UX', 'SUSTAINABILITY'], href: 'case-study.html?work=oko-echo', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design MockUp/01.png' },  
  { title: 'The Mary Pickford Arts Alliance', tags: ['PRODUCT DESIGN', 'UI / UX','AI-ASSITED COLLABORATION'], href: 'case-study.html?work=mpaa-new', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MPAA_Sources/Cover/New_Cover.png' },
  { title: 'VisionControl.AI', tags: ['PRODUCT DESIGN','UI / UX','GENERATIVE AI', 'CREATIVE TECHNOLOGY'], href: 'case-study.html?work=vision-control-rewritten', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/vision-control-new/NewCover.png' },
  { title: 'A Message To The End.', tags: ['INTERACTION DESIGN', 'PHYSICAL COMPUTING','INTERACTIVE INSTALLATION'], href: 'case-study.html?work=a-message-to-the-end', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Cover/MessageToTheEnd.mp4' },
  { title: 'MahJong Ledger', tags: ['PRODUCT DESIGN', 'WEB APP', 'RAPID PROTOTYPING'], href: 'case-study.html?work=mahjong', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MahJong/Video/MahJongDemo.mp4' },
];

const PLAY_DATA = [
  { title: 'The Criterion Channel Brand Identity', tags: ['Motion Graphic', 'Branding'], href: 'case-study.html?work=criterion-channel', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/CriterionChannel_Sources/Motion/Criterion Channel.mp4' },
  { title: 'Cyber Spell: Discord', tags: ['Motion Graphic', 'Discord'], href: 'case-study.html?work=cyber-spell-discord', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/Discord_Sources/Motion/Cyber_Spell_Discord.mp4' },
  { title: 'Psycho Thrills', tags: ['Graphic Design', 'Print'], href: 'case-study.html?work=psycho-thrills', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/PsychoThriller_Sources/Cover/Poster_Close-up_4.jpg' },
  { title: 'The Serious Business of Comedy', tags: ['Graphic Design', 'Editorial'], href: 'case-study.html?work=serious-business-of-comedy', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/Comedy_Sources/Cover/Magazine_Cover.png' },
  { title: 'LDN 24', tags: ['Graphic Design', 'Print'], href: 'case-study.html?work=ldn-24', thumbnail: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/Typography Conference/Cover/B&W_Ver.jpg' },
];
