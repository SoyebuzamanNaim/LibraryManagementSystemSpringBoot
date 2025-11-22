document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("bookModal");
  const openBtn = document.getElementById("openBookModalBtn");
  const closeBtns = document.querySelectorAll(".book-modal-close");
  const overlay = document.getElementById("bookModalOverlay");
  const form = document.getElementById("bookForm");

  function openModal() {
    modal.classList.remove("hidden");
    document.getElementById("bookModalTitle").textContent = "Add Book";
    document.getElementById("bookSubmitBtn").textContent = "Add Book";
    form.action = "/books";
    form.reset();
    document.getElementById("bookId").value = "";
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
      if (e.target.id === "bookModalOverlay") {
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
        window.location.href = "/books";
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
    window.DeleteModal.initDeleteForms("delete-book-form", "book");
  }

  // View modal close handlers
  const viewModalCloseBtns = document.querySelectorAll(
    ".view-book-modal-close"
  );
  viewModalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", closeViewModal);
  });

  const viewModalOverlay = document.getElementById("viewBookModalOverlay");
  if (viewModalOverlay) {
    viewModalOverlay.addEventListener("click", function (e) {
      if (e.target.id === "viewBookModalOverlay") {
        closeViewModal();
      }
    });
  }
});

function closeViewModal() {
  const modal = document.getElementById("viewBookModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function viewBook(
  id,
  title,
  authors,
  isbn,
  publicationId,
  vendorId,
  totalCopies,
  availableCopies,
  categories,
  purchaseDate,
  price,
  createdAt
) {
  const modal = document.getElementById("viewBookModal");
  if (modal) {
    document.getElementById("viewBookTitle").textContent = title || "-";
    document.getElementById("viewBookAuthors").textContent = authors || "-";
    document.getElementById("viewBookIsbn").textContent = isbn || "-";

    // Get publication name from select dropdown
    const publicationSelect = document.getElementById("bookPublicationId");
    let publicationName = "-";
    if (publicationId && publicationSelect) {
      const publicationOption = Array.from(publicationSelect.options).find(
        (opt) => opt.value === publicationId
      );
      if (publicationOption) {
        publicationName = publicationOption.textContent;
      }
    }
    document.getElementById("viewBookPublication").textContent =
      publicationName;

    // Get vendor name from select dropdown
    const vendorSelect = document.getElementById("bookVendorId");
    let vendorName = "-";
    if (vendorId && vendorSelect) {
      const vendorOption = Array.from(vendorSelect.options).find(
        (opt) => opt.value === vendorId
      );
      if (vendorOption) {
        vendorName = vendorOption.textContent;
      }
    }
    document.getElementById("viewBookVendor").textContent = vendorName;

    document.getElementById("viewBookTotalCopies").textContent =
      totalCopies || "0";
    document.getElementById("viewBookAvailableCopies").textContent =
      availableCopies || "0";
    document.getElementById("viewBookCategories").textContent =
      categories || "-";
    document.getElementById("viewBookPurchaseDate").textContent =
      purchaseDate || "-";
    document.getElementById("viewBookPrice").textContent = price
      ? `$${price}`
      : "-";
    document.getElementById("viewBookCreatedAt").textContent = createdAt || "-";
    modal.classList.remove("hidden");
  }
}

function editBook(
  id,
  title,
  authors,
  publicationId,
  vendorId,
  isbn,
  totalCopies,
  availableCopies,
  categories,
  purchaseDate,
  price
) {
  const modal = document.getElementById("bookModal");
  const form = document.getElementById("bookForm");
  document.getElementById("bookModalTitle").textContent = "Edit Book";
  document.getElementById("bookSubmitBtn").textContent = "Update Book";
  document.getElementById("bookId").value = id;
  document.getElementById("bookTitle").value = title || "";
  document.getElementById("bookAuthors").value = authors || "";
  document.getElementById("bookPublicationId").value = publicationId || "";
  document.getElementById("bookVendorId").value = vendorId || "";
  document.getElementById("bookIsbn").value = isbn || "";
  document.getElementById("bookTotalCopies").value = totalCopies || "";
  document.getElementById("bookAvailableCopies").value = availableCopies || "";
  document.getElementById("bookCategories").value = categories || "";
  document.getElementById("bookPurchaseDate").value = purchaseDate || "";
  document.getElementById("bookPrice").value = price || "";
  form.action = "/books/update";
  modal.classList.remove("hidden");
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-book-btn")) {
    const id = e.target.getAttribute("data-id");
    const title = e.target.getAttribute("data-title") || "";
    // Extract authors and categories from hidden spans in the row
    const row = e.target.closest("tr");
    const authorsSpan = row.querySelector(".book-authors-data");
    const categoriesSpan = row.querySelector(".book-categories-data");
    const authors = authorsSpan ? authorsSpan.textContent.trim() : "";
    const categories = categoriesSpan ? categoriesSpan.textContent.trim() : "";
    const isbn = e.target.getAttribute("data-isbn") || "";
    const publicationId = e.target.getAttribute("data-publication-id") || "";
    const vendorId = e.target.getAttribute("data-vendor-id") || "";
    const totalCopies = e.target.getAttribute("data-total-copies") || "";
    const availableCopies =
      e.target.getAttribute("data-available-copies") || "";
    const purchaseDate = e.target.getAttribute("data-purchase-date") || "";
    const price = e.target.getAttribute("data-price") || "";
    const createdAt = e.target.getAttribute("data-created-at") || "";
    viewBook(
      id,
      title,
      authors,
      isbn,
      publicationId,
      vendorId,
      totalCopies,
      availableCopies,
      categories,
      purchaseDate,
      price,
      createdAt
    );
  }
  if (e.target.classList.contains("edit-book-btn")) {
    const id = e.target.getAttribute("data-id");
    const title = e.target.getAttribute("data-title") || "";
    // Extract authors and categories from hidden spans in the row
    const row = e.target.closest("tr");
    const authorsSpan = row.querySelector(".book-authors-data");
    const categoriesSpan = row.querySelector(".book-categories-data");
    const authors = authorsSpan ? authorsSpan.textContent.trim() : "";
    const categories = categoriesSpan ? categoriesSpan.textContent.trim() : "";
    const publicationId = e.target.getAttribute("data-publication-id") || "";
    const vendorId = e.target.getAttribute("data-vendor-id") || "";
    const isbn = e.target.getAttribute("data-isbn") || "";
    const totalCopies = e.target.getAttribute("data-total-copies") || "";
    const availableCopies =
      e.target.getAttribute("data-available-copies") || "";
    const purchaseDate = e.target.getAttribute("data-purchase-date") || "";
    const price = e.target.getAttribute("data-price") || "";
    editBook(
      id,
      title,
      authors,
      publicationId,
      vendorId,
      isbn,
      totalCopies,
      availableCopies,
      categories,
      purchaseDate,
      price
    );
  }
});
