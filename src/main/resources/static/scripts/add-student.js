document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear errors
    document
      .querySelectorAll(".form-error")
      .forEach((el) => (el.textContent = ""));

    const formData = {
      name: document.getElementById("name").value.trim(),
      roll: document.getElementById("roll").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      department: document.getElementById("department").value.trim(),
      subscriptionId: null,
    };

    // Validation
    let hasError = false;

    if (!formData.name) {
      document.getElementById("nameError").textContent = "Name is required";
      hasError = true;
    }

    if (!formData.roll) {
      document.getElementById("rollError").textContent =
        "Roll number is required";
      hasError = true;
    }

    if (formData.email) {
      const emailError = window.LMS.Validators.email(formData.email);
      if (emailError) {
        document.getElementById("emailError").textContent = emailError;
        hasError = true;
      }
    }

    if (hasError) return;

    // Check for duplicate roll number
    const students = window.LMS.Students.getAll();
    if (students.some((s) => s.roll === formData.roll)) {
      document.getElementById("rollError").textContent =
        "Roll number already exists";
      return;
    }

    // Create student
    try {
      window.LMS.Students.create(formData);
      window.LMS.UI.showToast("Student added successfully", "success");
      setTimeout(() => {
        window.location.href = "/students";
      }, 500);
    } catch (error) {
      window.LMS.UI.showToast("Failed to add student", "error");
    }
  });
});
