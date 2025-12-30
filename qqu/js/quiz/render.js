import { $, } from "../core/dom.js";
import { state } from "../core/state.js";

export function renderQuestion() {
  const q = state.quiz.questions[state.idx];

  $('#qIndex').textContent =
    `Câu ${state.idx + 1}/${state.quiz.questions.length}`;
  $('#qText').innerHTML = q.text;

  if (window.MathJax) MathJax.typesetPromise();

  const box = $('#qChoices');
  box.innerHTML = '';
  $('#explain').textContent = '';

  q.choices.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'choice';

    if (state.answers[state.idx].value === i)
      div.classList.add('active');

    div.innerHTML = `
      <input type="radio" name="opt" ${state.answers[state.idx].value === i ? 'checked' : ''}>
      <label>${c}</label>
    `;

    div.onclick = () => {
  state.answers[state.idx].value = i;

  document
    .querySelectorAll('.choice')
    .forEach(c => c.classList.remove('active'));

  div.classList.add('active');
};


    box.appendChild(div);
  });

  $('#btnPrev').disabled = state.idx === 0;
}
