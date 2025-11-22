document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("subscriptionModal");
  const openBtn = document.getElementById("openSubscriptionModalBtn");
  const closeBtns = document.querySelectorAll(".subscription-modal-close");
  const overlay = document.getElementById("subscriptionModalOverlay");
  const form = document.getElementById("subscriptionForm");

  function openModal() {
    modal.classList.remove("hidden");
    document.getElementById("subscriptionModalTitle").textContent =
      "Add Subscription";
    document.getElementById("subscriptionSubmitBtn").textContent =
      "Add Subscription";
    form.action = "/subscriptions";
    form.reset();
    document.getElementById("subscriptionId").value = "";
    document.getElementById("subscriptionActive").checked = true;
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
      if (e.target.id === "subscriptionModalOverlay") {
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
        window.location.href = "/subscriptions";
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
    window.DeleteModal.initDeleteForms(
      "delete-subscription-form",
      "subscription"
    );
  }
});

function editSubscription(id, studentId, type, startDate, endDate, active) {
  const modal = document.getElementById("subscriptionModal");
  const form = document.getElementById("subscriptionForm");
  document.getElementById("subscriptionModalTitle").textContent =
    "Edit Subscription";
  document.getElementById("subscriptionSubmitBtn").textContent =
    "Update Subscription";
  document.getElementById("subscriptionId").value = id;
  document.getElementById("subscriptionStudentId").value = studentId || "";
  document.getElementById("subscriptionType").value = type || "";
  document.getElementById("subscriptionStartDate").value = startDate || "";
  document.getElementById("subscriptionEndDate").value = endDate || "";
  document.getElementById("subscriptionActive").checked =
    active === true || active === "true";
  form.action = "/subscriptions/update";
  modal.classList.remove("hidden");
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-subscription-btn")) {
    const id = e.target.getAttribute("data-id");
    const studentId = e.target.getAttribute("data-student-id") || "";
    const type = e.target.getAttribute("data-type") || "";
    const startDate = e.target.getAttribute("data-start-date") || "";
    const endDate = e.target.getAttribute("data-end-date") || "";
    const active = e.target.getAttribute("data-active") === "true";
    editSubscription(id, studentId, type, startDate, endDate, active);
  }
});
