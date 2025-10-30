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
      // 🧹 Clear old session data before storing new
      localStorage.clear();

      // store token
      if (data.token) localStorage.setItem("token", data.token);

      // decode token to get user ID
      const decoded = parseJwt(data.token);
      if (decoded && decoded.id) {
        localStorage.setItem("userId", decoded.id);
      }

      // store selectedLanguage (if available)
      const user = data.user || {};
      if (user.selectedLanguage) {
        localStorage.setItem("selectedLanguage", user.selectedLanguage);
      }

      // store email
      if (user.email) {
        localStorage.setItem("email", user.email);
      }

      // store username
      if (user.username) {
        localStorage.setItem("username", user.username);
      }

      console.log("Stored userId:", localStorage.getItem("userId"));
      console.log("Stored selectedLanguage:", localStorage.getItem("selectedLanguage"));
      console.log("Stored email:", localStorage.getItem("email"));

      messageBox.innerText = "✅ Login Successful, Redirecting...";

      // redirect after login
      const onboardingFlag = user.onboardingComplete ?? user.OnboardingComplete ?? false;
      setTimeout(() => {
        if (onboardingFlag) {
          window.location.href = "../dashboardFolder/dashboard.html";
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
