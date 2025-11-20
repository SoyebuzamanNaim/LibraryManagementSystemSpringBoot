let allPublications = [];
let currentPage = 1;
let editingPublicationId = null;
const pageSize = 10;

function loadPublications() {
  allPublications = window.LMS.Publications.getAll();
  applyFilters();
}

function applyFilters() {
  const searchInput =
    document.getElementById("topbarSearch") ||
    document.getElementById("searchInput");
  const searchTerm = (searchInput ? searchInput.value : "").toLowerCase();
  let filtered = allPublications;

  if (searchTerm) {
    filtered = allPublications.filter(
      (pub) =>
        pub.name.toLowerCase().includes(searchTerm) ||
        (pub.address && pub.address.toLowerCase().includes(searchTerm))
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

function renderTable(publications) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address", hideOnMobile: true },
  ];

  const actions = [
    {
      label: "Edit",
      class: "btn-secondary",
      onclick: "editPublication",
    },
    {
      label: "Delete",
      class: "btn-danger",
      onclick: "deletePublication",
    },
  ];

  window.LMS.Table.createTable(
    "tableContainer",
    publications,
    columns,
    actions
  );
}

function changePage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAddPublicationModal() {
  editingPublicationId = null;
  document.getElementById("publicationModalTitle").textContent =
    "Add Publication";
  document.getElementById("publicationSubmitBtn").textContent =
    "Add Publication";
  document.getElementById("publicationForm").reset();
  document.getElementById("publicationModal").classList.remove("hidden");
}

function editPublication(btn, publication) {
  editingPublicationId = publication.id;
  document.getElementById("publicationModalTitle").textContent =
    "Edit Publication";
  document.getElementById("publicationSubmitBtn").textContent =
    "Update Publication";

  document.getElementById("publicationName").value = publication.name || "";
  document.getElementById("publicationAddress").value =
    publication.address || "";

  document.getElementById("publicationModal").classList.remove("hidden");
}

function deletePublication(btn, publication) {
  window.LMS.UI.confirmDelete(
    `Are you sure you want to delete "${publication.name}"?`,
    () => {
      const result = window.LMS.Publications.delete(publication.id);
      if (result === true) {
        window.LMS.UI.showToast("Publication deleted successfully", "success");
        loadPublications();
      } else if (result && result.error) {
        window.LMS.UI.showToast(result.error, "error");
      } else {
        window.LMS.UI.showToast("Failed to delete publication", "error");
      }
    }
  );
}

function closePublicationModal() {
  document.getElementById("publicationModal").classList.add("hidden");
  document.getElementById("publicationForm").reset();
  editingPublicationId = null;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  loadPublications();

  const debouncedSearch = window.LMS.UI.debounce(applyFilters, 300);
  const topbarSearch = document.getElementById("topbarSearch");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", () => {
      currentPage = 1;
      debouncedSearch();
    });
  }

  document.getElementById("publicationForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("publicationName").value.trim(),
      address: document.getElementById("publicationAddress").value.trim(),
    };

    if (!formData.name) {
      window.LMS.UI.showToast("Name is required", "error");
      return;
    }

    let result;
    if (editingPublicationId) {
      result = window.LMS.Publications.update(editingPublicationId, formData);
      if (result) {
        window.LMS.UI.showToast("Publication updated successfully", "success");
      } else {
        window.LMS.UI.showToast("Failed to update publication", "error");
        return;
      }
    } else {
      result = window.LMS.Publications.create(formData);
      if (result) {
        window.LMS.UI.showToast("Publication added successfully", "success");
      } else {
        window.LMS.UI.showToast("Failed to add publication", "error");
        return;
      }
    }

    closePublicationModal();
    loadPublications();
  });

  const openModalButton = document.getElementById("openPublicationModalBtn");
  if (openModalButton) {
    openModalButton.addEventListener("click", showAddPublicationModal);
  }

  document
    .querySelectorAll(".publication-modal-close")
    .forEach((btn) => btn.addEventListener("click", closePublicationModal));

  document
    .getElementById("publicationModalOverlay")
    .addEventListener("click", (e) => {
      if (e.target.id === "publicationModalOverlay") {
        closePublicationModal();
      }
    });
});
