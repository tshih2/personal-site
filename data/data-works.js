// 首頁 [ ALL WORKS ] 分頁的資料清單——搭配 js/works-grid.js 使用。
// 欄位:title(卡片標題)、category(分類標籤)、href(點擊連結目標,
// 還沒有對應頁面時用 '#')、thumbnail(縮圖路徑,可省略,沒有縮圖時
// 卡片會維持 bg-card 色塊當佔位框,不會報錯或留白)。
const WORKS_DATA = [
  { title: 'VisionControl.AI', category: 'Generative AI', href: 'vision-control-rewritten.html', thumbnail: 'Img/VisionControl_Sources/vision-control-new/03-hero-thumbnail.png' },
  { title: 'The Mary Pickford Arts Alliance', category: 'Product Design', href: 'mpaa.html', thumbnail: 'Img/MPAA_Sources/Cover/Mpaa_Cover.png' },
  { title: '專案名稱 03', category: 'Graphic Design', href: '#' },
  { title: '專案名稱 04', category: '3D Render', href: '#' },
  { title: '專案名稱 05', category: 'Case Study', href: '#' },
  { title: '專案名稱 06', category: 'UI / UX', href: '#' },
  { title: '專案名稱 07', category: 'Motion Graphic', href: '#' },
  { title: '專案名稱 08', category: 'Graphic Design', href: '#' },
  { title: '專案名稱 09', category: '3D Render', href: '#' },
  { title: '專案名稱 10', category: 'Case Study', href: '#' },
  { title: '專案名稱 11', category: 'UI / UX', href: '#' },
  { title: '專案名稱 12', category: 'Motion Graphic', href: '#' },
  { title: '專案名稱 13', category: 'Graphic Design', href: '#' },
];
