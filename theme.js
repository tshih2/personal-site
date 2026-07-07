/*
 * 全站共用的 Tailwind 設計 token。
 * index.html 跟 work-detail.html 都載入這個檔案,
 * 兩頁共用同一份顏色/字體定義,不再各自維護一份容易失準的複製。
 */
window.SITE_THEME = {
  theme: {
    extend: {
      colors: {
        ink: '#111111',      // 主要文字(標題、內文主色)
        muted: '#706F6A',    // 次要文字(說明、meta 資訊)
        label: '#878787',    // Section 標籤/小型 eyebrow 文字
        cream: '#F9F7F2',    // 暖米白:Hero / Case study 背景
        stone: '#F2F2F0',    // 中性灰白:一般頁面內容區背景
        card: '#F9F9F9',     // 卡片色塊底色
      },
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
        archivo: ['"Archivo Black"', 'sans-serif'],
        geistmono: ['"Geist Mono"', 'monospace'],
        geist: ['Geist', 'sans-serif'],
      },
    },
  },
};
