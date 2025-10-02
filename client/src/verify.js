const form = document.getElementById("verifyForm");
const otpInput = document.getElementById("otp");
const messageBox = document.getElementById("verifyMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const otp = otpInput.value;

  try {
    const res = await fetch("/api/authorize/verify-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important so the backend sees the cookie with userId
      body: JSON.stringify({ otp }),
    });

    const data = await res.json();

    if (data.success) {
      messageBox.innerText = "✅ " + data.message;
      // redirect to login
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1500);
    } else {
      messageBox.innerText = "❌ " + (data.message || "Verification failed");
    }
  } catch (err) {
    console.error(err);
    messageBox.innerText = "❌ Error connecting to server";
  }
});
