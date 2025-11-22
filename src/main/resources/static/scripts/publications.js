// Modal handling
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("publicationModal");
  const openBtn = document.getElementById("openPublicationModalBtn");
  const closeBtns = document.querySelectorAll(".publication-modal-close");
  const overlay = document.getElementById("publicationModalOverlay");
  const form = document.getElementById("publicationForm");

  function openModal() {
    modal.classList.remove("hidden");
    document.getElementById("publicationModalTitle").textContent =
      "Add Publication";
    document.getElementById("publicationSubmitBtn").textContent =
      "Add Publication";
    form.action = "/publications";
    form.reset();
    document.getElementById("publicationId").value = "";
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
      if (e.target.id === "publicationModalOverlay") {
        closeModal();
      }
    });
  }

  // Search functionality - submit form on Enter key or when cleared
  const searchInput = document.getElementById("topbarSearch");
  const searchForm = searchInput?.closest("form");
  if (searchInput && searchForm) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchForm.submit();
      }
    });

    // Submit when search is cleared
    searchInput.addEventListener("input", function () {
      if (this.value.trim() === "") {
        window.location.href = "/publications";
      }
    });
  }

  // Mobile search functionality
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

  // Initialize delete confirmation modal
  if (window.DeleteModal) {
    window.DeleteModal.initDeleteForms(
      "delete-publication-form",
      "publication"
    );
  }
});

function editPublication(id, name, address) {
  const modal = document.getElementById("publicationModal");
  const form = document.getElementById("publicationForm");
  document.getElementById("publicationModalTitle").textContent =
    "Edit Publication";
  document.getElementById("publicationSubmitBtn").textContent =
    "Update Publication";
  document.getElementById("publicationId").value = id;
  document.getElementById("publicationName").value = name || "";
  document.getElementById("publicationAddress").value = address || "";
  form.action = "/publications/" + id + "/update";
  modal.classList.remove("hidden");
}

// Handle edit button clicks
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-publication-btn")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name") || "";
    const address = e.target.getAttribute("data-address") || "";
    editPublication(id, name, address);
  }
});
