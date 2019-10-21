const CHARS = 'abcdefghigklmnopqrstuvwxyz'
const NUMS = '0123456789'
const ALL = CHARS + NUMS
// 最简单的 uid 生成器，够用就好
function uid(n) {
  n = n || 6

  if (n < 2) {
    throw new RangeError('n 不能小于 2')
  }

  let repeatStr = ''

  for (let i = 0; i < n - 2; i++) {
    repeatStr += 'z'
  }

  return "xx".concat(repeatStr).replace(/[xz]/g, c => {
    return c === 'x' ? CHARS[Math.random() * 26 | 0] : ALL[Math.random() * 36 | 0];
  })
}

const tabID = window.sessionStorage.tabID && window.sessionStorage.closedLastTab !== 0 ? window.sessionStorage.tabID : window.sessionStorage.tabID = uid(10)
sessionStorage.closedLastTab = 0;

function isTabClosed() {
  window.sessionStorage.closedLastTab = 1;
}

window.addEventListener('unload', isTabClosed);
window.addEventListener('beforeunload', isTabClosed)
export default tabID