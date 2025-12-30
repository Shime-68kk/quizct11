import { $, } from "../core/dom.js";
import { state } from "../core/state.js";
import { renderQuestion } from "./render.js";
import { startTimer } from "./timer.js";

export function setupQuiz(index) {
  state.quiz = JSON.parse(JSON.stringify(state.allQuizzes[index]));
  $('#timeLimit').value = Math.round((state.quiz.timeLimit || 0) / 60);
  $('#statusMessage').innerHTML =
    `Đã nạp: <b>${state.quiz.title}</b>. Bấm Bắt đầu!`;
}

export function startQuiz() {
  if ($('#shuffle').checked)
    state.quiz.questions.sort(() => Math.random() - 0.5);

  state.answers = state.quiz.questions.map(() => ({ value: null }));
  state.idx = 0;

  $('#screenIntro').style.display = 'none';
  $('#screenQuiz').style.display = 'block';

  renderQuestion();
  startTimer();
}
