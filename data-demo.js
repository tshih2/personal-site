// 示範用假資料——刻意跟 Vision Control 用不同的標題、分類、
// 媒體數量(3 張佔位圖,不是 1 張真圖+1 張佔位)、手風琴數量
// (4 個,不是 3 個)跟名字,證明同一套樣板可以套用在不同內容上。
const CASE_STUDY_DATA = {
  title: 'Nebula Dashboard',
  category: 'Data Visualization',
  intro: '一個幫團隊即時掌握產品指標的儀表板設計案例，示範資料如何餵進同一套 case study 樣板。',
  author: 'CREATED BY TIM SHIH — SPRING 2025',
  backHref: 'index.html',

  media: [
    { type: 'placeholder', label: 'SCREENSHOT 01' },
    { type: 'placeholder', label: 'SCREENSHOT 02' },
    { type: 'placeholder', label: 'SCREENSHOT 03' },
  ],

  overview: {
    paragraphs: [
      '這是示範用的假資料，證明中欄的媒體項目跟這段描述文字都是從資料物件動態產生的，不是寫死在 HTML 裡。',
    ],
  },

  sections: [
    { title: 'Discovery', content: '示範用佔位文字——探索階段的內容放這裡。' },
    { title: 'Design System', content: '示範用佔位文字——設計系統的內容放這裡。' },
    { title: 'Testing', content: '示範用佔位文字——測試階段的內容放這裡。' },
    { title: 'Outcome', content: '示範用佔位文字——成果與影響放這裡，這是第四個手風琴區塊，證明數量可以跟 Vision Control 的三個不一樣。' },
  ],
};
