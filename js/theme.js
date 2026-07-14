/*
 * 全站共用的 Tailwind 設計 token。
 * index.html 跟 vision-control.html 都載入這個檔案,
 * 兩頁共用同一份顏色/字體定義,不再各自維護一份容易失準的複製。
 */
window.SITE_THEME = {
  // js/hero-glitch.js 會在執行期用 classList.add/remove 動態切換
  // font-unbounded / font-geistmono——Play CDN 平常靠 MutationObserver
  // 就能抓到動態加上的 class,但這裡明確 safelist 兩個 class 保險,
  // 避免任何情境下被當成「未使用」而沒生成對應樣式。
  safelist: ['font-unbounded', 'font-geistmono'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',      // 主要文字(標題、內文主色)
        muted: '#706F6A',    // 次要文字(說明、meta 資訊)
        label: '#878787',    // Section 標籤/小型 eyebrow 文字
        cream: '#F9F7F2',    // 暖米白:Hero / Case study 背景
        stone: '#F2F2F0',    // 中性灰白:一般頁面內容區背景
        card: '#F9F9F9',     // 卡片色塊底色
        glitchCyan: '#49C7D3', // 「系統故障」美學專用:巨大展示字錯位色偏的青色層,見 css/style.css 的 .glitch-text
        glitchRed: '#E16C67',  // 「系統故障」美學專用:巨大展示字錯位色偏的紅色層,見 css/style.css 的 .glitch-text
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
