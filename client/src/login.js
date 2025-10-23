const form = document.getElementById("loginForm");
const messageBox = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/authorize/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    // defensive: ensure valid JSON
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Login response was not JSON:", text);
      messageBox.innerText = "❌ Unexpected server response. Check server console.";
      return;
    }

    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    }

    if (data.success) {
      // store token
      if (data.token) localStorage.setItem("token", data.token);

      // decode token to get user ID
      const decoded = parseJwt(data.token);
      if (decoded && decoded.id) {
        localStorage.setItem("userId", decoded.id);
      }

      // store selectedLanguage
      const user = data.user || {};
      if (user.selectedLanguage) {
        localStorage.setItem("selectedLanguage", user.selectedLanguage);
      }

      console.log("Stored userId:", localStorage.getItem("userId"));
      console.log("Stored selectedLanguage:", localStorage.getItem("selectedLanguage"));

      messageBox.innerText = "✅ Login Successfull, Redirecting...";

      // redirect after login
      const onboardingFlag = user.onboardingComplete ?? user.OnboardingComplete ?? false;
      setTimeout(() => {
        if (onboardingFlag) {
          window.location.href = "./Dashboard.html";
        } else {
          window.location.href = "./onboardingProcess/onboarding1.html";
        }
      }, 700);
    } else {
      messageBox.innerText = "❌ " + (data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    messageBox.innerText = "❌ Error connecting to server";
  }
});
