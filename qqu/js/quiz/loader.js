import { $, } from "../core/dom.js";
import { state } from "../core/state.js";
import { setupQuiz } from "./engine.js";

export function handleData(data) {
  state.allQuizzes = Array.isArray(data) ? data : [data];

  if (state.allQuizzes.length > 1) {
    $('#quizSelectGroup').style.display = 'grid';
    $('#quizSelect').innerHTML = state.allQuizzes
      .map((q, i) => `<option value="${i}">${q.title || 'Đề ' + (i + 1)}</option>`)
      .join('');
  }
  setupQuiz(0);
}

export function initLoader() {
  fetch('data.json')
    .then(r => r.json())
    .then(handleData)
    .catch(() => $('#statusMessage').textContent = "Hãy nạp file JSON.");
}
