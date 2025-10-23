const API_URL = "http://localhost:4000/api/stages/";
const userId = localStorage.getItem("userId");
const selectedLanguage = localStorage.getItem("selectedLanguage");
const token = localStorage.getItem("token");

async function loadStages() {
  if (!userId || !selectedLanguage || !token) {
    return alert("Missing user session. Please login again.");
  }

  try {
    console.log("Requesting stages for:", selectedLanguage, "user:", userId);

    const res = await fetch(`${API_URL}course/${selectedLanguage}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    console.log("fetch /api/stages response:", data);

    if (!res.ok || !data.success) {
      return alert(data.message || "Failed to load stages.");
    }

    const { allStages, allLevels, getUserProgress } = data;
    const { completedStages = [], currentStage = null } = getUserProgress;

    const container = document.getElementById("stageContainer");
    const title = document.getElementById("courseTitle");

    title.textContent = `${selectedLanguage} Course`;
    container.innerHTML = "";

    // Loop through levels
    allLevels.forEach(level => {
      const levelDiv = document.createElement("div");
      levelDiv.className = "level";

      const levelTitle = document.createElement("h2");
      levelTitle.innerText = level.name;
      levelDiv.appendChild(levelTitle);

      // Filter stages for this level
      const stagesInLevel = allStages.filter(stage => stage.level === level._id);

      stagesInLevel.forEach(stage => {
        const stageDiv = document.createElement("div");

        const unlocked =
          completedStages.includes(stage._id) || // completed
          stage._id === currentStage ||           // current stage
          allLevels.some(level => level.stages[0] === stage._id); // first stage of any level

        stageDiv.className = "stage" + (unlocked ? "" : " locked");
        stageDiv.innerText = stage.name + (unlocked ? "" : " 🔒");

        stageDiv.onclick = () => {
          if (unlocked) {
            localStorage.setItem("currentStageId", stage._id);
            localStorage.setItem("currentStageName", stage.name);
            window.location.href = "quiz.html";
          } else {
            alert("🔒 This stage is locked. Complete previous stages to unlock it!");
          }
        };

        levelDiv.appendChild(stageDiv);
      });

      container.appendChild(levelDiv);
    });

  } catch (err) {
    console.error("Error loading stages:", err);
    alert("Something went wrong while loading stages. Check console.");
  }
}

loadStages();


