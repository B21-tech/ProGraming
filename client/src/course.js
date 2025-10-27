// Previous button
document.getElementById("prevBtn").onclick = function() {
  window.location.href = "onboarding3.html";
};

// Progress bar
const currentStep = 3;
const totalSteps = 3;
const progress = (currentStep / totalSteps) * 100;
document.getElementById("progressBar").style.width = progress + "%";

// Next button and language selection
const nextBtn = document.getElementById("nextBtn");
const languages = document.querySelectorAll(".language");
let selectedLanguage = null;

// Handle language selection
languages.forEach(language => {
  language.addEventListener("click", () => {
    languages.forEach(b => b.classList.remove("selected"));
    language.classList.add("selected");

    selectedLanguage = language.textContent.trim();

    // Enable the Next button
    nextBtn.removeAttribute("disabled");
    nextBtn.style.backgroundColor = "#FBBC04";
    nextBtn.style.pointerEvents = "auto";
    nextBtn.style.opacity = "1";
  });
});

// Handle Next button click
nextBtn.onclick = async function() {
  if (!selectedLanguage) {
    alert("Please select a language first.");
    return;
  }

  try {
    const response = await fetch('/api/authorize/onboarding', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ selectedLanguage })
    });

    const data = await response.json();

    if (data.success) {
      // ✅ Redirect only after saving to DB
      window.location.href = "../dashboardFolder/dashboard.html";
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error occurred. Please try again.");
  }
};

