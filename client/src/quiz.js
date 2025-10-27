const stageId = localStorage.getItem("currentStageId");
const stageName = localStorage.getItem("currentStageName");
const container = document.getElementById("questionContainer");
const stageTitle = document.getElementById("stageTitle");
const nextBtn = document.getElementById("nextBtn");

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

stageTitle.innerText = stageName;

let questions = [];
let currentIndex = 0;
let score = 0;
let hasAnswered = false;

async function loadQuestions() {
  const res = await fetch(`http://localhost:4000/api/questions/${stageId}`);
  const data = await res.json();
  if (!data.success) return alert(data.message);

  questions = data.questions;
  showQuestion();
}

function showQuestion() {
  container.innerHTML = "";
  nextBtn.style.display = "none";
  hasAnswered = false;

  if (currentIndex >= questions.length) {
    container.innerHTML = `<h2>Quiz Finished! 🎯 Your Score: ${score}/${questions.length}</h2>`;
    nextBtn.style.display = "none";
    completeStage(score, questions.length);
    return;
  }

  const q = questions[currentIndex];
  const qEl = document.createElement("div");
  qEl.innerHTML = `<h3>${q.text}</h3>`;

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.classList.add("option-btn");

    btn.onclick = () => {
      if (hasAnswered) return; // Prevent double-clicks
      hasAnswered = true;

      const explanationEl = document.createElement("p");
      explanationEl.classList.add("explanation");

      if (opt === q.correctAnswer) {
        btn.classList.add("correct");
        score++;
        explanationEl.innerHTML = `✅ Correct! <br><small>${q.explanation || ""}</small>`;
      } else {
        btn.classList.add("wrong");
        explanationEl.innerHTML = `❌ Incorrect. The correct answer was <b>${q.correctAnswer}</b>. <br><small>${q.explanation || ""}</small>`;
      }

      // Disable all buttons after answering
      const allBtns = qEl.querySelectorAll("button");
      allBtns.forEach((b) => (b.disabled = true));

      qEl.appendChild(explanationEl);
      nextBtn.style.display = "block";
    };

    qEl.appendChild(btn);
  });

  container.appendChild(qEl);
}

nextBtn.onclick = () => {
  currentIndex++;
  showQuestion();
};

// Function to complete stage
async function completeStage(score, total) {
  try {
    const res = await fetch(`http://localhost:4000/api/progress/complete/${userId}/${stageId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score, total }),
    });

    const data = await res.json();

    if (!data.success) {
      return alert("❌ Could not complete stage: " + data.message);
    }

    if (data.unlocked) {
      alert("🎉 Stage completed! Next stage unlocked.");
    } else {
      alert("✅ Stage completed, but you need 60% to unlock the next stage.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error completing stage: " + err.message);
  }
}

loadQuestions();
