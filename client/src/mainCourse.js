const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");
const API_URL = "http://localhost:4000/api/progress/";

if (!userId || !token) {
    alert("Missing user session. Please login again.");
}

// Normalize displayed names to match MongoDB course names
function normalizeName(name) {
    const map = {
        "JavaScript": "Javascript",
        "C# (C-Sharp)": "C#",
        "Python Challenge": "Python",
    };
    return map[name] || name.trim();
}

// Generic fetch handler for JSON with fallback
async function safeFetch(url, options = {}) {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return res.json();
    } else {
        const text = await res.text();
        throw new Error("Expected JSON but got HTML: " + text.slice(0, 200));
    }
}

async function loadCourses() {
    try {
        const data = await safeFetch(`${API_URL}${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!data.success) return console.warn("Failed to fetch user progress:", data.message);

        const userProgress = data.progress || {};
        const courseCards = document.querySelectorAll(".course-card");

        courseCards.forEach((card) => {
            const title = card.querySelector("h3")?.innerText?.trim();
            if (!title) return;

            const btn = card.querySelector(".btn.start");
            const normalized = normalizeName(title);
            const isRegistered = userProgress.hasOwnProperty(normalized);

            if (isRegistered) {
                // Already registered → Continue course
                btn.textContent = "Continue Course";
                btn.classList.add("continue");

                btn.onclick = async (e) => {
                    e.preventDefault();

                    try {
                        const data = await safeFetch(`${API_URL}switchCourse`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({ userId, courseName: normalized }),
                        });

                        if (!data.success) return alert(data.message || "Failed to switch course");

                        localStorage.setItem("selectedLanguage", normalized);
                        window.location.href = "../mainProcess/stages.html";
                    } catch (err) {
                        console.error("Switch course error:", err);
                        alert("Failed to switch course. Check console.");
                    }
                };
            } else {
                // Not yet registered → Start course
                btn.textContent = "Start Course";
                btn.classList.remove("continue");

                btn.onclick = async (e) => {
                    e.preventDefault();

                    try {
                        const data = await safeFetch(`${API_URL}registerCourse`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({ userId, courseName: normalized }),
                        });

                        if (!data.success) return alert(data.message || "Failed to register course");

                        localStorage.setItem("selectedLanguage", normalized);
                        window.location.href = "../mainProcess/stages.html";
                    } catch (err) {
                        console.error("Register course error:", err);
                        alert("Failed to register course. Check console.");
                    }
                };
            }
        });
    } catch (err) {
        console.error("Error loading courses:", err);
        alert("Something went wrong while loading courses. Check console.");
    }
}

loadCourses();
