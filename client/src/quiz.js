const stageId = localStorage.getItem("currentStageId");
const stageName = localStorage.getItem("currentStageName");
const container = document.getElementById("questionContainer");
const stageTitle = document.getElementById("stageTitle");
const nextBtn = document.getElementById("nextBtn");

stageTitle.innerText = stageName;

let questions = [];
let currentIndex = 0;
let score = 0;

async function loadQuestions() {
  const res = await fetch(`http://localhost:4000/api/questions/${stageId}`);
  const data = await res.json();
  if (!data.success) return alert(data.message);
  questions = data.questions;
  showQuestion();
}

function showQuestion() {
  container.innerHTML = "";
  if (currentIndex >= questions.length) {
    container.innerHTML = `<h2>Quiz Finished! Score: ${score}/${questions.length}</h2>`;
    nextBtn.style.display = "none";
    return;
  }

  const q = questions[currentIndex];
  const qEl = document.createElement("div");
  qEl.innerHTML = `<h3>${q.text}</h3>`;
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      if (opt === q.correctAnswer) score++;
      currentIndex++;
      showQuestion();
    };
    qEl.appendChild(btn);
  });
  container.appendChild(qEl);
}

loadQuestions();
