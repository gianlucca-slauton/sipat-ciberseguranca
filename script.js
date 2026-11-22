'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      menuToggle.textContent = '☰';
    });
  });
}

const checklistItems = [...document.querySelectorAll('[data-check]')];
const progressNumber = document.querySelector('#progress-number');
const progressFill = document.querySelector('#progress-fill');
const progressTrack = document.querySelector('.progress-track');
const checklistMessage = document.querySelector('#checklist-message');
const resetChecklist = document.querySelector('#reset-checklist');

function updateChecklist() {
  const completed = checklistItems.filter((item) => item.checked).length;
  const total = checklistItems.length;
  const percentage = total ? (completed / total) * 100 : 0;

  if (progressNumber) progressNumber.textContent = `${completed}/${total}`;
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(completed));
  if (checklistMessage) {
    checklistMessage.textContent = completed === 0
      ? 'Você ainda não marcou nenhum item.'
      : completed === total
        ? 'Checklist concluído! Obrigado por cuidar da segurança do posto.'
        : `${total - completed} item(ns) ainda precisam ser conferidos.`;
  }
}

checklistItems.forEach((item) => item.addEventListener('change', updateChecklist));
if (resetChecklist) {
  resetChecklist.addEventListener('click', () => {
    checklistItems.forEach((item) => { item.checked = false; });
    updateChecklist();
  });
}
updateChecklist();

const quizForm = document.querySelector('#quiz-form');
const quizResult = document.querySelector('#quiz-result');
const resetQuiz = document.querySelector('#reset-quiz');
const answerKey = {
  q1: {
    correct: 'b',
    explanation: 'Correto: ransomware é um malware que bloqueia ou criptografa dados e exige resgate.'
  },
  q2: {
    correct: 'a',
    explanation: 'Correto: segundo a reportagem, acredita-se que o acesso ocorreu após os criminosos adivinharem a senha de um funcionário.'
  },
  q3: {
    correct: 'c',
    explanation: 'Correto: a KNP perdeu os dados, faliu e cerca de 700 pessoas perderam seus empregos.'
  },
  q4: {
    correct: 'a',
    explanation: 'Correto: backups protegidos e testes de restauração ajudam a recuperar a operação sem depender do pagamento do resgate.'
  },
  q5: {
    correct: 'c',
    explanation: 'Correto: ao terminar, faça logout, feche os arquivos e não deixe documentos em locais públicos.'
  }
};

if (quizForm) {
  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!quizForm.reportValidity()) return;

    const answers = new FormData(quizForm);
    let score = 0;

    Object.entries(answerKey).forEach(([questionName, data]) => {
      const selected = answers.get(questionName);
      const feedback = quizForm.querySelector(`[data-feedback="${questionName}"]`);
      const labels = [...quizForm.querySelectorAll(`input[name="${questionName}"]`)]
        .map((input) => input.closest('label'));

      labels.forEach((label) => label.classList.remove('is-correct', 'is-wrong'));
      const correctInput = quizForm.querySelector(`input[name="${questionName}"][value="${data.correct}"]`);
      const selectedInput = quizForm.querySelector(`input[name="${questionName}"][value="${selected}"]`);
      const correctLabel = correctInput ? correctInput.closest('label') : null;
      const selectedLabel = selectedInput ? selectedInput.closest('label') : null;

      if (selected === data.correct) {
        score += 1;
        if (selectedLabel) selectedLabel.classList.add('is-correct');
        if (feedback) {
          feedback.textContent = data.explanation;
          feedback.className = 'answer-feedback correct';
        }
      } else {
        if (selectedLabel) selectedLabel.classList.add('is-wrong');
        if (correctLabel) correctLabel.classList.add('is-correct');
        if (feedback) {
          feedback.textContent = `Resposta correta: ${data.correct.toUpperCase()}. ${data.explanation}`;
          feedback.className = 'answer-feedback wrong';
        }
      }
    });

    if (quizResult) {
      const message = score === 5
        ? 'Excelente! Você demonstrou que entendeu os principais cuidados.'
        : score >= 3
          ? 'Bom trabalho! Revise as explicações das questões que errou.'
          : 'Vale revisar o conteúdo e tentar novamente. A prevenção depende de informação.';
      quizResult.innerHTML = `<strong>Você acertou ${score} de 5.</strong><p>${message}</p>`;
      quizResult.hidden = false;
      quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

if (resetQuiz && quizForm) {
  resetQuiz.addEventListener('click', () => {
    window.setTimeout(() => {
      quizForm.querySelectorAll('[data-feedback]').forEach((feedback) => {
        feedback.textContent = '';
        feedback.className = 'answer-feedback';
      });
      quizForm.querySelectorAll('label').forEach((label) => label.classList.remove('is-correct', 'is-wrong'));
      if (quizResult) quizResult.hidden = true;
    }, 0);
  });
}

document.getElementById("copyright-year").textContent =
    new Date().getFullYear();