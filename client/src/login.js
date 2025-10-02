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

        const data = await res.json();
        if (data.success) {
            messageBox.innerText = "✅ Login successful! Redirecting…";
            setTimeout(() => {
                window.location.href = "./onboardingProcess/onboarding1.html";
            }, 1500);
        }
        else {
            messageBox.innerText = "❌ " + (data.message || "Login failed");
        }
    } catch (err) {
        console.error(err);
        messageBox.innerText = "❌ Error connecting to server";
    }
});