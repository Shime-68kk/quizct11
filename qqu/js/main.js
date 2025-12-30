import { $, } from "./core/dom.js";
import { initLoader } from "./quiz/loader.js";
import { startQuiz } from "./quiz/engine.js";
import { initTheme } from "./ui/theme.js";

window.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
});

$('#btnStart').onclick = startQuiz;
