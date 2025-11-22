document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("studentModal");
  const openBtn = document.getElementById("openStudentModalBtn");
  const closeBtns = document.querySelectorAll(".student-modal-close");
  const overlay = document.getElementById("studentModalOverlay");
  const form = document.getElementById("studentForm");

  function openModal() {
    modal.classList.remove("hidden");
    document.getElementById("studentModalTitle").textContent = "Add Student";
    document.getElementById("studentSubmitBtn").textContent = "Add Student";
    form.action = "/students";
    form.reset();
    document.getElementById("studentId").value = "";
  }

  function closeModal() {
    modal.classList.add("hidden");
    form.reset();
  }

  if (openBtn) {
    openBtn.addEventListener("click", openModal);
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === "studentModalOverlay") {
        closeModal();
      }
    });
  }

  const searchInput = document.getElementById("topbarSearch");
  const searchForm = searchInput?.closest("form");
  if (searchInput && searchForm) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchForm.submit();
      }
    });

    searchInput.addEventListener("input", function () {
      if (this.value.trim() === "") {
        window.location.href = "/students";
      }
    });
  }

  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mobileSearchForm = mobileSearchInput?.closest("form");
  if (mobileSearchInput && mobileSearchForm) {
    mobileSearchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        mobileSearchForm.submit();
      }
    });
  }

  if (window.DeleteModal) {
    window.DeleteModal.initDeleteForms("delete-student-form", "student");
  }

  const viewModalCloseBtns = document.querySelectorAll(
    ".view-student-modal-close"
  );
  viewModalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", closeViewModal);
  });

  const viewModalOverlay = document.getElementById("viewStudentModalOverlay");
  if (viewModalOverlay) {
    viewModalOverlay.addEventListener("click", function (e) {
      if (e.target.id === "viewStudentModalOverlay") {
        closeViewModal();
      }
    });
  }
});

function closeViewModal() {
  const modal = document.getElementById("viewStudentModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function editStudent(id, name, roll, email, phone, department) {
  const modal = document.getElementById("studentModal");
  const form = document.getElementById("studentForm");
  document.getElementById("studentModalTitle").textContent = "Edit Student";
  document.getElementById("studentSubmitBtn").textContent = "Update Student";
  document.getElementById("studentId").value = id;
  document.getElementById("studentName").value = name || "";
  document.getElementById("studentRoll").value = roll || "";
  document.getElementById("studentEmail").value = email || "";
  document.getElementById("studentPhone").value = phone || "";
  document.getElementById("studentDepartment").value = department || "";
  form.action = "/students/update";
  modal.classList.remove("hidden");
}

function viewStudent(id, name, roll, email, phone, department, createdAt) {
  const modal = document.getElementById("viewStudentModal");
  if (modal) {
    document.getElementById("viewStudentName").textContent = name || "-";
    document.getElementById("viewStudentRoll").textContent = roll || "-";
    document.getElementById("viewStudentEmail").textContent = email || "-";
    document.getElementById("viewStudentPhone").textContent = phone || "-";
    document.getElementById("viewStudentDepartment").textContent =
      department || "-";
    document.getElementById("viewStudentCreatedAt").textContent =
      createdAt || "-";
    modal.classList.remove("hidden");
  }
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-student-btn")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name") || "";
    const roll = e.target.getAttribute("data-roll") || "";
    const email = e.target.getAttribute("data-email") || "";
    const phone = e.target.getAttribute("data-phone") || "";
    const department = e.target.getAttribute("data-department") || "";
    const createdAt = e.target.getAttribute("data-created-at") || "";
    viewStudent(id, name, roll, email, phone, department, createdAt);
  }
  if (e.target.classList.contains("edit-student-btn")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name") || "";
    const roll = e.target.getAttribute("data-roll") || "";
    const email = e.target.getAttribute("data-email") || "";
    const phone = e.target.getAttribute("data-phone") || "";
    const department = e.target.getAttribute("data-department") || "";
    editStudent(id, name, roll, email, phone, department);
  }
});
