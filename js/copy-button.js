// 通用的「點擊複製到剪貼簿」按鈕工具——按鈕本身要有兩個子節點各自標記
// data-copy-icon-default / data-copy-icon-success(通常是兩個 <svg>,
// 一個是複製圖示、一個是複製成功的打勾),呼叫 initCopyButton(button,
// getText) 之後,點擊按鈕會複製 getText() 回傳的文字,成功時把
// default 圖示換成 success 圖示,一段時間後自動換回來——邏輯只寫一份,
// 不是每個需要「複製到剪貼簿」的地方各自重寫一份切換圖示的判斷。
function initCopyButton(button, getText, options) {
  if (!button || typeof navigator === 'undefined' || !navigator.clipboard) return;

  const opts = options || {};
  const feedbackDuration = opts.feedbackDuration || 1800;
  const defaultIcon = button.querySelector('[data-copy-icon-default]');
  const successIcon = button.querySelector('[data-copy-icon-success]');
  let resetTimer = null;

  button.addEventListener('click', () => {
    const text = typeof getText === 'function' ? getText() : getText;
    navigator.clipboard.writeText(text).then(() => {
      if (defaultIcon) defaultIcon.classList.add('hidden');
      if (successIcon) successIcon.classList.remove('hidden');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        if (defaultIcon) defaultIcon.classList.remove('hidden');
        if (successIcon) successIcon.classList.add('hidden');
      }, feedbackDuration);
    });
  });
}
