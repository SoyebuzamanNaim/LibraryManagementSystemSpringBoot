let allVendors = [];
let currentPage = 1;
let editingVendorId = null;
const pageSize = 10;

function loadVendors() {
  allVendors = window.LMS.Vendors.getAll();
  applyFilters();
}

function applyFilters() {
  const searchInput =
    document.getElementById("topbarSearch") ||
    document.getElementById("searchInput");
  const searchTerm = (searchInput ? searchInput.value : "").toLowerCase();
  let filtered = allVendors;

  if (searchTerm) {
    filtered = allVendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm) ||
        (vendor.contact && vendor.contact.toLowerCase().includes(searchTerm)) ||
        (vendor.phone && vendor.phone.toLowerCase().includes(searchTerm))
    );
  }

  const pagination = window.LMS.Table.paginate(filtered, currentPage, pageSize);
  renderTable(pagination.data);
  window.LMS.Table.createPagination(
    "paginationContainer",
    pagination,
    changePage
  );
}

function renderTable(vendors) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "contact", label: "Contact Person", hideOnMobile: true },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address", hideOnMobile: true },
  ];

  const actions = [
    {
      label: "Edit",
      class: "btn-secondary",
      onclick: "editVendor",
    },
    {
      label: "Delete",
      class: "btn-danger",
      onclick: "deleteVendor",
    },
  ];

  window.LMS.Table.createTable("tableContainer", vendors, columns, actions);
}

function changePage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAddVendorModal() {
  editingVendorId = null;
  document.getElementById("vendorModalTitle").textContent = "Add Vendor";
  document.getElementById("vendorSubmitBtn").textContent = "Add Vendor";
  document.getElementById("vendorForm").reset();
  document.getElementById("vendorModal").classList.remove("hidden");
}

function editVendor(btn, vendor) {
  editingVendorId = vendor.id;
  document.getElementById("vendorModalTitle").textContent = "Edit Vendor";
  document.getElementById("vendorSubmitBtn").textContent = "Update Vendor";

  document.getElementById("vendorName").value = vendor.name || "";
  document.getElementById("vendorContact").value = vendor.contact || "";
  document.getElementById("vendorPhone").value = vendor.phone || "";
  document.getElementById("vendorAddress").value = vendor.address || "";

  document.getElementById("vendorModal").classList.remove("hidden");
}

function deleteVendor(btn, vendor) {
  window.LMS.UI.confirmDelete(
    `Are you sure you want to delete "${vendor.name}"?`,
    () => {
      const result = window.LMS.Vendors.delete(vendor.id);
      if (result === true) {
        window.LMS.UI.showToast("Vendor deleted successfully", "success");
        loadVendors();
      } else if (result && result.error) {
        window.LMS.UI.showToast(result.error, "error");
      } else {
        window.LMS.UI.showToast("Failed to delete vendor", "error");
      }
    }
  );
}

function closeVendorModal() {
  document.getElementById("vendorModal").classList.add("hidden");
  document.getElementById("vendorForm").reset();
  editingVendorId = null;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  loadVendors();

  const debouncedSearch = window.LMS.UI.debounce(applyFilters, 300);
  const topbarSearch = document.getElementById("topbarSearch");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", () => {
      currentPage = 1;
      debouncedSearch();
    });
  }

  document.getElementById("vendorForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("vendorName").value.trim(),
      contact: document.getElementById("vendorContact").value.trim(),
      phone: document.getElementById("vendorPhone").value.trim(),
      address: document.getElementById("vendorAddress").value.trim(),
    };

    if (!formData.name) {
      window.LMS.UI.showToast("Name is required", "error");
      return;
    }

    let result;
    if (editingVendorId) {
      result = window.LMS.Vendors.update(editingVendorId, formData);
      if (result) {
        window.LMS.UI.showToast("Vendor updated successfully", "success");
      } else {
        window.LMS.UI.showToast("Failed to update vendor", "error");
        return;
      }
    } else {
      result = window.LMS.Vendors.create(formData);
      if (result) {
        window.LMS.UI.showToast("Vendor added successfully", "success");
      } else {
        window.LMS.UI.showToast("Failed to add vendor", "error");
        return;
      }
    }

    closeVendorModal();
    loadVendors();
  });

  const openModalButton = document.getElementById("openVendorModalBtn");
  if (openModalButton) {
    openModalButton.addEventListener("click", showAddVendorModal);
  }

  document
    .querySelectorAll(".vendor-modal-close")
    .forEach((btn) => btn.addEventListener("click", closeVendorModal));

  document
    .getElementById("vendorModalOverlay")
    .addEventListener("click", (e) => {
      if (e.target.id === "vendorModalOverlay") {
        closeVendorModal();
      }
    });
});
