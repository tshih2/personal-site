// Case study 資料範本——複製這個檔案改名成 data-<作品名>.js,
// 把下面的空值填上真實內容,再照 vision-control.html 複製一份殼
// (換 <title> 跟載入的 data 檔名,並依作品名稱取一個對應的檔名)即可套用 case-study-template.js 的樣板。
// 完整格式說明見 case-study-template.js 檔案開頭的註解。

const CASE_STUDY_DATA = {
  // 左欄大標題,例如 'Vision Control'
  title: '',

  // 標題下方的分類標籤,例如 'AI Technology'、'Motion Graphic'
  category: '',

  // 左欄的介紹段落,一段文字(不是陣列)
  intro: '',

  // 左欄底部的作者/meta 資訊,例如 'CREATED BY TIM SHIH — SPRINT 2024'
  author: '',

  // 「← BACK」連結目標,通常不用改,預設就是回首頁
  backHref: 'index.html',

  // 中欄 Overview 的媒體堆疊,由上到下依序顯示,想放幾張都可以。
  // 三種項目類型,依需要混用:
  //   { type: 'image', src: '路徑', alt: '替代文字' }       — 真的圖片
  //   { type: 'video', src: '路徑' }                        — 影片(會自動加 controls)
  //   { type: 'placeholder', label: '顯示文字' }            — 還沒有素材時的佔位框
  media: [
    { type: 'placeholder', label: '' },
  ],

  // Overview 右側的描述文字,陣列裡每一個字串是獨立一段,段數不限
  overview: {
    paragraphs: [
      '',
    ],
  },

  // 底下的手風琴區塊,由上到下依序顯示,標題跟數量都自由——
  // 不是只能用 User Research / Process / Reflection 這三個名字
  sections: [
    { title: '', content: '' },
    { title: '', content: '' },
    { title: '', content: '' },
  ],
};
