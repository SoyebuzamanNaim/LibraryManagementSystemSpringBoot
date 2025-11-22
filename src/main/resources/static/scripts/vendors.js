// Modal handling
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("vendorModal");
  const openBtn = document.getElementById("openVendorModalBtn");
  const closeBtns = document.querySelectorAll(".vendor-modal-close");
  const overlay = document.getElementById("vendorModalOverlay");
  const form = document.getElementById("vendorForm");

  function openModal() {
    modal.classList.remove("hidden");
    document.getElementById("vendorModalTitle").textContent = "Add Vendor";
    document.getElementById("vendorSubmitBtn").textContent = "Add Vendor";
    form.action = "/vendors";
    form.reset();
    document.getElementById("vendorId").value = "";
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
      if (e.target.id === "vendorModalOverlay") {
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
        window.location.href = "/vendors";
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
    window.DeleteModal.initDeleteForms("delete-vendor-form", "vendor");
  }
});

function editVendor(id, name, email, phone, address) {
  const modal = document.getElementById("vendorModal");
  const form = document.getElementById("vendorForm");
  document.getElementById("vendorModalTitle").textContent = "Edit Vendor";
  document.getElementById("vendorSubmitBtn").textContent = "Update Vendor";
  document.getElementById("vendorId").value = id;
  document.getElementById("vendorName").value = name || "";
  document.getElementById("vendorEmail").value = email || "";
  document.getElementById("vendorPhone").value = phone || "";
  document.getElementById("vendorAddress").value = address || "";
  form.action = "/vendors/update";
  modal.classList.remove("hidden");
}

// Handle edit button clicks
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-vendor-btn")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name") || "";
    const email = e.target.getAttribute("data-email") || "";
    const phone = e.target.getAttribute("data-phone") || "";
    const address = e.target.getAttribute("data-address") || "";
    editVendor(id, name, email, phone, address);
  }
});
