// Case study 資料範本——複製這個檔案改名成 data-<作品 slug>.js,
// 把下面的空值填上真實內容,不需要另外建立 html 殼,透過
// case-study.html?work=<作品 slug> 就能存取(見 CLAUDE.md「Case study
// 樣板系統」的「共用殼:case-study.html?work=」)。
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

  // Overview 區塊。content 是陣列,每一個字串是獨立一段(可以包含
  // <strong>子標題</strong>、<br><br> 分段),段數不限。media 可省略——
  // 完全沒有素材時整段會自動變成純文字單欄版面。
  overview: {
    content: [
      '',
    ],

    // 有素材的話依序放進來,想放幾項都可以。三種項目類型,依需要混用:
    //   { type: 'image', src: '路徑', alt: '替代文字' }       — 真的圖片
    //   { type: 'video', src: '路徑' }                        — 影片(會自動加 controls)
    //   { type: 'placeholder', label: '顯示文字' }            — 還沒有素材時的佔位框
    //
    // 媒體欄會自動變成獨立捲動的區域(桌面版套用 scroll-snap,滑鼠滾輪/
    // 觸控可以直接在媒體欄裡切換上一張/下一張),圖片維持原始寬度/長寬比
    // 顯示,不裁切、不縮小。兩張以上會自動加一列底部圓點指示器,反映
    // 媒體欄目前捲到第幾張,點擊可以跳轉。
    //
    // 建議每張圖都準備桌面版跟手機版兩份素材(手機版通常需要更方正/
    // 直向的裁切,桌面版的橫向裁切在窄螢幕上常常擠壓到看不清楚內容)。
    // 有準備兩版的話,src 改成 { desktop: '桌面版路徑', mobile: '手機版
    // 路徑' } 物件,樣板會依 lg: 斷點自動切換顯示,不需要額外設定。沒有
    // 準備手機版(例如純裝飾性素材,或還沒來得及做)時,src 給純字串就
    // 好,兩種斷點會顯示同一張圖,不是強制規定。
    media: [
      { type: 'placeholder', label: '' },
    ],
  },

  // 底下的手風琴區塊,由上到下依序顯示,標題跟數量都自由——
  // 不是只能用 User Research / Process / Reflection 這三個名字。
  // content/media 格式跟上面 overview 完全一樣,media 一樣可省略。
  sections: [
    { title: '', content: [''] },
    { title: '', content: [''] },
    { title: '', content: [''] },
  ],
};
