const themeBtn = document.getElementById('toggleTheme');

export function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
  themeBtn.onclick = toggleTheme;
}

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
}
