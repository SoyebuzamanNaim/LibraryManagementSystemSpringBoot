let allBooks = [];
let currentPage = 1;
const pageSize = 10;

function loadBooks() {
  allBooks = window.LMS.Books.getAll();
  const publications = window.LMS.Publications.getAll();
  const vendors = window.LMS.Vendors.getAll();

  // Enhance books with publication and vendor names
  allBooks = allBooks.map((book) => ({
    ...book,
    publicationName:
      publications.find((p) => p.id == book.publicationId)?.name || "-",
    vendorName: vendors.find((v) => v.id == book.vendorId)?.name || "-",
    authorsString: Array.isArray(book.authors)
      ? book.authors.join(", ")
      : book.authors || "-",
  }));

  applyFilters();
}

function applyFilters() {
  const searchInput =
    document.getElementById("topbarSearch") ||
    document.getElementById("searchInput");
  const searchTerm = (searchInput ? searchInput.value : "").toLowerCase();
  let filtered = allBooks;

  // Update result count
  const totalCount = filtered.length;

  if (searchTerm) {
    filtered = allBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.authorsString.toLowerCase().includes(searchTerm) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchTerm))
    );
  }

  const sortValue = document.getElementById("sortSelect").value;
  filtered.sort((a, b) => {
    switch (sortValue) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "author-asc":
        return a.authorsString.localeCompare(b.authorsString);
      case "created-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "created-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const pagination = window.LMS.Table.paginate(filtered, currentPage, pageSize);

  // Update count display
  const countElement = document.getElementById("bookCount");
  if (countElement) {
    const totalCount = filtered.length;
    countElement.textContent = ` (${totalCount} ${
      totalCount === 1 ? "book" : "books"
    })`;
  }

  renderTable(pagination.data);
  window.LMS.Table.createPagination(
    "paginationContainer",
    pagination,
    changePage
  );
}

function renderTable(books) {
  const columns = [
    { key: "title", label: "Title" },
    { key: "authorsString", label: "Authors" },
    { key: "isbn", label: "ISBN", hideOnMobile: true },
    { key: "publicationName", label: "Publication", hideOnMobile: true },
    { key: "totalCopies", label: "Total", hideOnMobile: true },
    {
      key: "availableCopies",
      label: "Available",
      render: (value, item) => {
        const available = item.availableCopies || 0;
        const total = item.totalCopies || 0;
        const percentage =
          total > 0 ? ((available / total) * 100).toFixed(0) : 0;
        return `<span class="${
          percentage > 50
            ? "badge-success"
            : percentage > 20
            ? "badge-warning"
            : "badge-danger"
        } badge">${available} / ${total}</span>`;
      },
    },
  ];

  const actions = [
    {
      label: "View",
      class: "btn-secondary",
      onclick: "viewBook",
    },
    {
      label: "Edit",
      class: "btn-secondary",
      onclick: "editBook",
    },
    {
      label: "Delete",
      class: "btn-danger",
      onclick: "deleteBook",
    },
  ];

  window.LMS.Table.createTable("tableContainer", books, columns, actions);
}

function changePage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function viewBook(btn, book) {
  const publication = window.LMS.Publications.getById(book.publicationId);
  const vendor = window.LMS.Vendors.getById(book.vendorId);

  const content = `
        <h3>${window.LMS.UI.escapeHtml(book.title)}</h3>
        <p><strong>Authors:</strong> ${window.LMS.UI.escapeHtml(
          book.authorsString
        )}</p>
        <p><strong>ISBN:</strong> ${window.LMS.UI.escapeHtml(
          book.isbn || "-"
        )}</p>
        <p><strong>Publication:</strong> ${window.LMS.UI.escapeHtml(
          publication ? publication.name : "-"
        )}</p>
        <p><strong>Vendor:</strong> ${window.LMS.UI.escapeHtml(
          vendor ? vendor.name : "-"
        )}</p>
        <p><strong>Total Copies:</strong> ${book.totalCopies || 0}</p>
        <p><strong>Available Copies:</strong> ${book.availableCopies || 0}</p>
        <p><strong>Categories:</strong> ${window.LMS.UI.escapeHtml(
          Array.isArray(book.categories)
            ? book.categories.join(", ")
            : book.categories || "-"
        )}</p>
        <p><strong>Purchase Date:</strong> ${window.LMS.UI.escapeHtml(
          book.purchaseDate
            ? window.LMS.UI.formatDateOnly(book.purchaseDate)
            : "-"
        )}</p>
        <p><strong>Price:</strong> $${window.LMS.UI.escapeHtml(
          book.price || "0.00"
        )}</p>
      `;

  window.LMS.UI.showModal("Book Details", content, null, true);
}

function editBook(btn, book) {
  window.location.href = `/edit-book?id=${book.id}`;
}

function deleteBook(btn, book) {
  window.LMS.UI.confirmDelete(
    `Are you sure you want to delete "${book.title}"?`,
    () => {
      const result = window.LMS.Books.delete(book.id);
      if (result === true) {
        window.LMS.UI.showToast("Book deleted successfully", "success");
        loadBooks();
      } else if (result && result.error) {
        window.LMS.UI.showToast(result.error, "error");
      } else {
        window.LMS.UI.showToast("Failed to delete book", "error");
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  loadBooks();

  const debouncedSearch = window.LMS.UI.debounce(applyFilters, 300);
  const topbarSearch = document.getElementById("topbarSearch");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", () => {
      currentPage = 1;
      debouncedSearch();
    });
  }

  document.getElementById("sortSelect").addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
  });
});
