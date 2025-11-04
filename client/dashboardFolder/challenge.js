const popup = document.getElementById("typingPopup");
const openBtn = document.getElementById("cta");
const closeBtn = document.getElementById("closePopup");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");

const snippetDisplay = document.getElementById("snippetDisplay");
const userInput = document.getElementById("userInput");
const timeDisplay = document.getElementById("time");
const accuracyDisplay = document.getElementById("accuracy");

let startTime, timerInterval;
let currentSnippet = "";

// Simple code snippets
const snippets = [
  "for(let i=0; i<5; i++){ console.log(i); }",
  "const sum = (a,b) => a + b;",
  "let count = 0; while(count < 3){ count++; }",
  "if(user && user.isLoggedIn){ showDashboard(); }"
];

// Open popup
openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resetChallenge();
  popup.classList.remove("hidden");
});

// Close popup
closeBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  stopChallenge();
});

// Start challenge
startBtn.addEventListener("click", () => {
  currentSnippet = snippets[Math.floor(Math.random() * snippets.length)];
  snippetDisplay.textContent = currentSnippet;
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();

  startBtn.classList.add("hidden");
  submitBtn.classList.remove("hidden");

  let time = 0;
  timerInterval = setInterval(() => {
    time++;
    timeDisplay.textContent = time;
  }, 1000);

  startTime = Date.now();
});

// Finish challenge
submitBtn.addEventListener("click", async () => {
  clearInterval(timerInterval);
  userInput.disabled = true;

  const typed = userInput.value.trim();
  const correctChars = [...typed].filter((c, i) => c === currentSnippet[i]).length;
  const accuracy = Math.round((correctChars / currentSnippet.length) * 100);
  accuracyDisplay.textContent = accuracy + "%";

  // XP reward logic
  let earnedXP = 0;
  if (accuracy >= 90) earnedXP = 25;
  else if (accuracy >= 70) earnedXP = 15;
  else if (accuracy >= 50) earnedXP = 5;

  if (earnedXP > 0) {
    await fetch("http://localhost:4000/api/addXP", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ amount: earnedXP }),
    });
    alert(`🎉 Great job! You earned ${earnedXP} XP!`);
  }
  else{
    alert("💔 Don't give up! Keep Practicing to earn XP points!");
  }

  popup.classList.add("hidden");
  startBtn.classList.remove("hidden");
  submitBtn.classList.add("hidden");
  resetChallenge();
});

// restart and stop challenge
function stopChallenge(){
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetChallenge(){
  stopChallenge();
  userInput.value = "";
  userInput.disabled = true;
  timeDisplay.textContent = "0";
  accuracyDisplay.textContent = "0%";
  snippetDisplay.textContent = "Press start to begin!";
  startBtn.classList.remove("hidden");
  submitBtn.classList.add("hidden");
}
