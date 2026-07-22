// 首頁 [ ALL WORKS ] 分頁的資料清單——搭配 js/works-grid.js 使用。
// 欄位:title(卡片標題)、category(分類標籤)、href(點擊連結目標,
// 還沒有對應頁面時用 '#')、thumbnail(縮圖路徑,可省略,沒有縮圖時
// 卡片會維持 bg-card 色塊當佔位框,不會報錯或留白)。
const WORKS_DATA = [
  { title: 'VisionControl.AI', category: 'Generative AI', href: 'case-study.html?work=vision-control-rewritten', thumbnail: 'Img/VisionControl_Sources/vision-control-new/03-hero-thumbnail.png' },
  { title: 'The Mary Pickford Arts Alliance', category: 'Product Design', href: 'case-study.html?work=mpaa-new', thumbnail: 'Img/MPAA_Sources/Cover/Mpaa_Cover.png' },
  { title: 'A Message To The End.', category: 'Interactive Installation', href: 'case-study.html?work=a-message-to-the-end', thumbnail: 'Img/A Message To The End/Cover/MessageToTheEnd.mp4' },
  { title: 'The Criterion Channel Brand Identity', category: 'Motion Graphic', href: 'case-study.html?work=criterion-channel', thumbnail: 'Img/CriterionChannel_Sources/Motion/Criterion Channel.mp4' },
  { title: 'Cyber Spell: Discord', category: 'Motion Graphic', href: 'case-study.html?work=cyber-spell-discord', thumbnail: 'Img/Discord_Sources/Motion/Cyber_Spell_Discord.mp4' },
  { title: 'Psycho Thrills', category: 'Graphic Design', href: 'case-study.html?work=psycho-thrills', thumbnail: 'Img/PsychoThriller_Sources/Cover/Poster_Close-up_4.jpg' },
  { title: 'The Serious Business of Comedy', category: 'Graphic Design', href: 'case-study.html?work=serious-business-of-comedy', thumbnail: 'Img/Comedy_Sources/Cover/Magazine_Cover.png' },
  { title: 'LDN 24', category: 'Graphic Design', href: 'case-study.html?work=ldn-24', thumbnail: 'Img/Typography Conference/Cover/B&W_Ver.jpg' },
];
