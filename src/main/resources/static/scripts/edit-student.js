document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  // Get student ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get("id");

  if (!studentId) {
    window.LMS.UI.showToast("Student ID not found", "error");
    setTimeout(() => (window.location.href = "/students"), 1000);
    return;
  }

  const student = window.LMS.Students.getById(studentId);
  if (!student) {
    window.LMS.UI.showToast("Student not found", "error");
    setTimeout(() => (window.location.href = "/students"), 1000);
    return;
  }

  // Populate form
  document.getElementById("name").value = student.name || "";
  document.getElementById("roll").value = student.roll || "";
  document.getElementById("email").value = student.email || "";
  document.getElementById("phone").value = student.phone || "";
  document.getElementById("department").value = student.department || "";

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

    // Check for duplicate roll number (except current student)
    const students = window.LMS.Students.getAll();
    if (students.some((s) => s.roll === formData.roll && s.id != studentId)) {
      document.getElementById("rollError").textContent =
        "Roll number already exists";
      return;
    }

    // Update student
    try {
      window.LMS.Students.update(studentId, formData);
      window.LMS.UI.showToast("Student updated successfully", "success");
      setTimeout(() => {
        window.location.href = "/students";
      }, 500);
    } catch (error) {
      window.LMS.UI.showToast("Failed to update student", "error");
    }
  });
});
