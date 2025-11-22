document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  const user = window.LMS.Auth.getCurrentUser();
  if (!user) {
    window.LMS.UI.showToast("User not found", "error");
    window.location.href = "/login";
    return;
  }

  // Populate profile form
  document.getElementById("username").value = user.username || "";
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";

  // Profile update form
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      document
        .querySelectorAll(".form-error")
        .forEach((el) => (el.textContent = ""));

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();

      let hasError = false;

      if (!name) {
        document.getElementById("nameError").textContent = "Name is required";
        hasError = true;
      }

      if (email) {
        const emailError = window.LMS.Validators.email(email);
        if (emailError) {
          document.getElementById("emailError").textContent = emailError;
          hasError = true;
        }
      }

      if (hasError) return;

      // Update user
      const users = window.LMS.Storage.getUsers();
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        window.LMS.Storage.setUsers(users);
        window.LMS.Auth.logHistory(
          "Profile Updated",
          `Updated profile information`
        );
        window.LMS.UI.showToast("Profile updated successfully", "success");
      } else {
        window.LMS.UI.showToast("Failed to update profile", "error");
      }
    });

  // Password change form
  document
    .getElementById("passwordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      document
        .querySelectorAll(".form-error")
        .forEach((el) => (el.textContent = ""));

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      let hasError = false;

      if (!currentPassword) {
        document.getElementById("currentPasswordError").textContent =
          "Current password is required";
        hasError = true;
      }

      if (!newPassword || newPassword.length < 6) {
        document.getElementById("newPasswordError").textContent =
          "New password must be at least 6 characters";
        hasError = true;
      }

      if (newPassword !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent =
          "Passwords do not match";
        hasError = true;
      }

      if (hasError) return;

      // Verify current password
      const isValid = await window.LMS.Auth.verifyPassword(
        currentPassword,
        user.passwordHash
      );
      if (!isValid) {
        document.getElementById("currentPasswordError").textContent =
          "Current password is incorrect";
        return;
      }

      // Update password
      const newHash = await window.LMS.Auth.hashPassword(newPassword);
      const users = window.LMS.Storage.getUsers();
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].passwordHash = newHash;
        window.LMS.Storage.setUsers(users);
        window.LMS.Auth.logHistory(
          "Password Changed",
          "Password changed successfully"
        );
        window.LMS.UI.showToast("Password changed successfully", "success");
        document.getElementById("passwordForm").reset();
      } else {
        window.LMS.UI.showToast("Failed to change password", "error");
      }
    });

  window.LMS.QuickSearch.init("topbarSearch");
});
