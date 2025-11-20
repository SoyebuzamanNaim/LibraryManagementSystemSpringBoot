document.addEventListener("DOMContentLoaded", () => {
  // Redirect if already logged in
  if (window.LMS.Auth.isAuthenticated()) {
    window.location.href = "/dashboard";
    return;
  }

  // Check if admin exists
  const users = window.LMS.Storage.getUsers();
  const admin = users.find((u) => u.role === "admin");

  if (!admin || !admin.passwordHash) {
    document.getElementById("firstRunMessage").classList.remove("hidden");
  }

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      window.LMS.UI.showToast("Please enter username and password", "error");
      return;
    }

    const result = await window.LMS.Auth.login(username, password);

    if (result.success) {
      window.LMS.UI.showToast("Login successful", "success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } else {
      window.LMS.UI.showToast(result.message || "Login failed", "error");
    }
  });
});
