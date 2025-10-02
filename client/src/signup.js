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

    const data = await res.json();

    if (data.success) {
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
