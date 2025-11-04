const stageId = localStorage.getItem("currentStageId");
const stageName = localStorage.getItem("currentStageName");
const container = document.getElementById("questionContainer");
const stageTitle = document.getElementById("stageTitle");
const nextBtn = document.getElementById("nextBtn");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupBtn = document.getElementById("popupBtn");

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

stageTitle.innerText = stageName || "Stage";

let questions = [];
let currentIndex = 0;
let score = 0;
let hasAnswered = false;

async function loadQuestions() {
  try {
    const res = await fetch(`http://localhost:4000/api/questions/${stageId}`);
    const data = await res.json();
    if (!data.success) return showPopup("Error", data.message || "Failed to load questions", "error");

    questions = data.questions || [];
    showQuestion();
  } catch (err) {
    console.error(err);
    showPopup("Error", "Failed to load questions. Please try again.", "error");
  }
}

function showQuestion() {
  container.innerHTML = "";
  nextBtn.style.display = "none";
  hasAnswered = false;

  if (currentIndex >= questions.length) {
    container.innerHTML = `<h2 style="margin:0 0 16px;">🎯 Quiz Finished!<br>Your Score: ${score}/${questions.length}</h2>`;
    completeStage(score, questions.length);
    return;
  }

  const q = questions[currentIndex];

  // Question text
  const questionEl = document.createElement("h2");
  questionEl.id = "questionText";
  questionEl.textContent = q.text;
  container.appendChild(questionEl);

  // Options grid
  const optionsGrid = document.createElement("div");
  optionsGrid.className = "options-grid";
  container.appendChild(optionsGrid);

  // Explanation (dynamic per question)
  const explanationEl = document.createElement("div");
  explanationEl.className = "explanation hidden";
  explanationEl.id = `explanation-${currentIndex}`;
  container.appendChild(explanationEl);

  q.options.forEach((opt) => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = opt;

    btn.onclick = () => {
      if (hasAnswered) return;
      hasAnswered = true;

      // Mark correct or wrong and show explanation
      if (opt === q.correctAnswer) {
        btn.classList.add("correct");
        score++;
        explanationEl.innerHTML = `✅ <strong>Correct!</strong><br><small>${q.explanation || ""}</small>`;
      } else {
        btn.classList.add("wrong");
        explanationEl.innerHTML = `❌ <strong>Incorrect.</strong> The correct answer was <b>${q.correctAnswer}</b>.<br><small>${q.explanation || ""}</small>`;
      }

      // Disable all options visually / interaction
      const allOptions = optionsGrid.querySelectorAll(".option");
      allOptions.forEach((o) => {
        o.style.pointerEvents = "none";
        // optionally dim non-selected options
        if (!o.classList.contains("correct") && !o.classList.contains("wrong")) {
          o.style.opacity = "0.9";
        }
      });

      // Reveal explanation and next button
      explanationEl.classList.remove("hidden");
      nextBtn.style.display = "block";
    };

    optionsGrid.appendChild(btn);
  });
}

nextBtn.onclick = () => {
  // hide explanation and move to next
  const explanationEl = document.querySelector(".explanation");
  if (explanationEl) explanationEl.classList.add("hidden");
  currentIndex++;
  showQuestion();
};

// Confetti setup
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

function startConfetti() {
  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight - window.innerHeight,
    size: Math.random() * 6 + 2,
    speed: Math.random() * 3 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
  }));

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p) => {
      p.y += p.speed;
      if (p.y > window.innerHeight) p.y = -10;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();

  setTimeout(() => {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 5000);
}

// Enhanced completeStage
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
    if (!data.success) return alert("❌ Could not complete stage: " + data.message);

    // Modal elements
    const modal = document.getElementById("completionModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const animationContainer = document.getElementById("animationContainer"); // For confetti or sad emoji
    const xpBar = document.getElementById("xpBar");
    const levelBanner = document.getElementById("levelUpBanner");
    const nextBtn = document.getElementById("nextStageBtn");
    const backBtn = document.getElementById("backToStages");
    const sadSound = document.getElementById("sadSound");
    const cheerSound = document.getElementById("cheerSound");

    animationContainer.innerHTML = ""; // Reset previous animations
    modal.classList.remove("hidden");

    const percent = (score / total) * 100;

    if (data.unlocked) {
      // Success path
      modalTitle.textContent = "🎉 Stage Complete!";
      modalMessage.textContent = `You unlocked the next stage! Score: ${score}/${total}`;
      nextBtn.style.display = "inline-block";

      // Start confetti
      startConfetti();

      // Play cheer sound
      if (cheerSound) cheerSound.play();

      // Animate XP bar
      let progress = 0;
      const xpTarget = Math.min(percent, 100);
      const xpInterval = setInterval(() => {
        if (progress >= xpTarget) {
          clearInterval(xpInterval);
          levelBanner.classList.remove("hidden");
        } else {
          progress++;
          xpBar.style.width = progress + "%";
        }
      }, 20);

    } else {
      modalTitle.textContent = "😔 Stage Incomplete";
      modalMessage.textContent = `You scored ${score}/${total}. You need 60% to unlock the next stage. You can do it! 💪`;

      nextBtn.style.display = "none"; // Hide next stage button

      const sadEmoji = document.createElement("div");
      sadEmoji.textContent = "💔";
      sadEmoji.style.display = "inline-block";
      sadEmoji.style.animation = "shake 0.5s ease-in-out 3";
      animationContainer.appendChild(sadEmoji);

      // Play sad sound
      if (sadSound) sadSound.play();
    }

    // Next Stage button
    nextBtn.onclick = () => {
      modal.classList.add("hidden");
      if (data.unlocked) {
        localStorage.setItem("currentStageId", data.nextStageId);
        localStorage.setItem("currentStageName", data.nextStageName);
        location.reload();
      }
    };

    // Back to stages
    backBtn.onclick = () => {
      modal.classList.add("hidden");
      window.location.href = "../mainProcess/stages.html";
    };

  } catch (err) {
    console.error(err);
    alert("❌ Error completing stage: " + err.message);
  }
}

// Shake animation via CSS
const style = document.createElement("style");
style.textContent = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(style);


// 🪄 Popup system
function showPopup(title, message, type = "success") {
  if (!popup) {
    alert(title + "\n\n" + message);
    return;
  }

  popup.classList.remove("hidden");
  popupTitle.textContent = title;
  popupMessage.textContent = message;

  if (type === "success") popupTitle.style.color = "#16a34a";
  else if (type === "neutral") popupTitle.style.color = "#3b82f6";
  else popupTitle.style.color = "#ef4444";

  popupBtn.onclick = () => {
    popup.classList.add("hidden");
    window.location.href = "../mainProcess/stages.html";
  };
}

loadQuestions();
