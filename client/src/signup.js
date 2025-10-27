const form = document.getElementById("signupForm");
const messageBox = document.getElementById("signupMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/authorize/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
      credentials: "include" // send JWT cookie
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Register response was not JSON:", text);
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


      messageBox.innerText = "✅ Signup successful! Please check your email to verify your account.";
      setTimeout(() => {
        window.location.href = "./verifyPass.html"; // redirect to login
      }, 2000);
    } else {
      messageBox.innerText = "❌ Signup failed";
    }
  } catch (err) {
    console.error(err);
    messageBox.innerText = "❌ Error connecting to server";
  }
});
