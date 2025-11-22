// Modal handling for allotments
function showAllotModal() {
  const modal = document.getElementById("allotModal");
  if (!modal) return;

  // Set default due date to 14 days from now (max loan period)
  const dueDateInput = document.getElementById("allotDueDate");
  if (dueDateInput) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const year = dueDate.getFullYear();
    const month = String(dueDate.getMonth() + 1).padStart(2, "0");
    const day = String(dueDate.getDate()).padStart(2, "0");
    const hours = String(dueDate.getHours()).padStart(2, "0");
    const minutes = String(dueDate.getMinutes()).padStart(2, "0");
    dueDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  modal.classList.remove("hidden");
}

function closeAllotModal() {
  const modal = document.getElementById("allotModal");
  if (modal) {
    modal.classList.add("hidden");
  }
  const form = document.getElementById("allotForm");
  if (form) {
    form.reset();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Open modal button
  const openModalButton = document.getElementById("openAllotModalBtn");
  if (openModalButton) {
    openModalButton.addEventListener("click", showAllotModal);
  }

  // Close modal buttons
  document
    .querySelectorAll(".allot-modal-close")
    .forEach((btn) => btn.addEventListener("click", closeAllotModal));

  // Close modal on overlay click
  const overlay = document.getElementById("allotModalOverlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === "allotModalOverlay") {
        closeAllotModal();
      }
    });
  }

  // Mobile search functionality
  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const mobileSearchOverlay = document.getElementById("mobileSearchOverlay");
  const closeMobileSearch = document.getElementById("closeMobileSearch");
  const mobileSearchInput = document.getElementById("mobileSearchInput");

  if (mobileSearchBtn && mobileSearchOverlay) {
    mobileSearchBtn.addEventListener("click", () => {
      mobileSearchOverlay.classList.remove("hidden");
      if (mobileSearchInput) {
        mobileSearchInput.focus();
      }
    });
  }

  if (closeMobileSearch && mobileSearchOverlay) {
    closeMobileSearch.addEventListener("click", () => {
      mobileSearchOverlay.classList.add("hidden");
    });
  }

  // Submit mobile search on Enter
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const form = mobileSearchInput.closest("form");
        if (form) {
          form.submit();
        }
      }
    });
  }
});
