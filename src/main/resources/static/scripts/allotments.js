let allAllotments = [];
let currentPage = 1;
const pageSize = 10;

function loadAllotments() {
  allAllotments = window.LMS.Allotments.getAll();
  const books = window.LMS.Books.getAll();
  const students = window.LMS.Students.getAll();

  // Enhance allotments with book and student names
  allAllotments = allAllotments.map((allotment) => {
    const book = books.find((b) => b.id == allotment.bookId);
    const student = students.find((s) => s.id == allotment.studentId);
    const dueDate = new Date(allotment.dueAt);
    const now = new Date();
    const isOverdue = !allotment.returnedAt && dueDate < now;

    // Calculate fine (stored fine or current fine for overdue)
    let fineAmount = allotment.fineAmount || 0;
    if (!allotment.returnedAt && isOverdue) {
      fineAmount = window.LMS.Allotments.calculateFine(allotment);
    }

    return {
      ...allotment,
      bookTitle: book ? book.title : "Unknown",
      studentName: student ? student.name : "Unknown",
      isOverdue,
      fineAmount,
    };
  });

  applyFilters();
}

function applyFilters() {
  const searchInput =
    document.getElementById("topbarSearch") ||
    document.getElementById("searchInput");
  const searchTerm = (searchInput ? searchInput.value : "").toLowerCase();
  const filterValue = document.getElementById("filterSelect").value;
  let filtered = allAllotments;

  if (searchTerm) {
    filtered = filtered.filter(
      (allotment) =>
        allotment.bookTitle.toLowerCase().includes(searchTerm) ||
        allotment.studentName.toLowerCase().includes(searchTerm)
    );
  }

  if (filterValue === "active") {
    filtered = filtered.filter((a) => !a.returnedAt);
  } else if (filterValue === "overdue") {
    filtered = filtered.filter((a) => a.isOverdue);
  } else if (filterValue === "returned") {
    filtered = filtered.filter((a) => a.returnedAt);
  }

  // Sort by newest first
  filtered.sort((a, b) => new Date(b.allottedAt) - new Date(a.allottedAt));

  const pagination = window.LMS.Table.paginate(filtered, currentPage, pageSize);
  renderTable(pagination.data);
  window.LMS.Table.createPagination(
    "paginationContainer",
    pagination,
    changePage
  );
}

function renderTable(allotments) {
  const columns = [
    {
      key: "bookTitle",
      label: "Book",
    },
    {
      key: "studentName",
      label: "Student",
    },
    {
      key: "allottedAt",
      label: "Allotted Date",
      hideOnMobile: true,
      render: (value) => window.LMS.UI.formatDate(value),
    },
    {
      key: "dueAt",
      label: "Due Date",
      render: (value, item) => {
        const dateStr = window.LMS.UI.formatDateOnly(value);
        if (item.isOverdue) {
          return `<span style="color: var(--danger);">${dateStr}</span>`;
        }
        return dateStr;
      },
    },
    {
      key: "returnedAt",
      label: "Returned Date",
      hideOnMobile: true,
      render: (value) => (value ? window.LMS.UI.formatDate(value) : "-"),
    },
    {
      key: "status",
      label: "Status",
      render: (value, item) => {
        if (item.returnedAt) {
          return '<span class="badge badge-success">Returned</span>';
        } else if (item.isOverdue) {
          return '<span class="badge badge-danger">Overdue</span>';
        } else {
          return '<span class="badge badge-info">Active</span>';
        }
      },
    },
    {
      key: "fineAmount",
      label: "Fine",
      hideOnMobile: true,
      render: (value, item) => {
        // Show fine if overdue or returned with fine
        if (value && value > 0) {
          // If returned with fine, show in red
          if (item.returnedAt && item.fineAmount) {
            return `<span style="color: var(--danger); font-weight: 600;">${value} taka</span>`;
          }
          // If overdue but not returned, show estimated fine in warning color
          if (item.isOverdue && !item.returnedAt) {
            return `<span style="color: var(--warning); font-weight: 600;">${value} taka</span>`;
          }
          return `<span style="color: var(--danger); font-weight: 600;">${value} taka</span>`;
        }
        return "-";
      },
    },
  ];

  const actions = [
    {
      label: "Return",
      class: "btn-success",
      onclick: "returnBook",
      condition: (item) => !item.returnedAt,
    },
  ];

  window.LMS.Table.createTable("tableContainer", allotments, columns, actions);
}

function changePage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnBook(btn, allotment) {
  window.LMS.UI.confirmDelete(
    `Mark "${allotment.bookTitle}" as returned?`,
    () => {
      const result = window.LMS.Allotments.returnBook(allotment.id);
      if (result && !result.error) {
        window.LMS.UI.showToast("Book returned successfully", "success");
        loadAllotments();
      } else {
        window.LMS.UI.showToast(
          result?.error || "Failed to return book",
          "error"
        );
      }
    }
  );
}

function showAllotModal() {
  const modal = document.getElementById("allotModal");
  const overlay = modal.querySelector(".modal-overlay");

  // Load books (only available ones)
  const books = window.LMS.Books.getAll().filter((b) => b.availableCopies > 0);
  const bookSelect = document.getElementById("allotBookId");
  bookSelect.innerHTML = '<option value="">Select Book</option>';
  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = book.id;
    option.textContent = `${book.title} (${book.availableCopies} available)`;
    bookSelect.appendChild(option);
  });

  // Load students
  const students = window.LMS.Students.getAll();
  const studentSelect = document.getElementById("allotStudentId");
  studentSelect.innerHTML = '<option value="">Select Student</option>';
  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} (${student.roll})`;
    studentSelect.appendChild(option);
  });

  // Set default due date (30 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  document.getElementById("allotDueDate").value = dueDate
    .toISOString()
    .split("T")[0];

  modal.classList.remove("hidden");
}

function closeAllotModal() {
  document.getElementById("allotModal").classList.add("hidden");
  document.getElementById("allotForm").reset();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  loadAllotments();

  const debouncedSearch = window.LMS.UI.debounce(applyFilters, 300);
  const topbarSearch = document.getElementById("topbarSearch");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", () => {
      currentPage = 1;
      debouncedSearch();
    });
  }

  document.getElementById("filterSelect").addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
  });

  // Allot form submission
  document.getElementById("allotForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const bookId = document.getElementById("allotBookId").value;
    const studentId = document.getElementById("allotStudentId").value;
    const dueDate = document.getElementById("allotDueDate").value;

    if (!bookId || !studentId || !dueDate) {
      window.LMS.UI.showToast("Please fill all fields", "error");
      return;
    }

    // Check if due date is in the past
    if (new Date(dueDate) < new Date()) {
      window.LMS.UI.showToast("Due date cannot be in the past", "error");
      return;
    }

    const result = window.LMS.Allotments.create({
      bookId,
      studentId,
      dueAt: new Date(dueDate).toISOString(),
    });

    if (result && !result.error) {
      window.LMS.UI.showToast("Book allotted successfully", "success");
      closeAllotModal();
      loadAllotments();
    } else {
      window.LMS.UI.showToast(result?.error || "Failed to allot book", "error");
    }
  });

  const openModalButton = document.getElementById("openAllotModalBtn");
  if (openModalButton) {
    openModalButton.addEventListener("click", showAllotModal);
  }

  document
    .querySelectorAll(".allot-modal-close")
    .forEach((btn) => btn.addEventListener("click", closeAllotModal));

  // Close modal on overlay click
  document
    .getElementById("allotModalOverlay")
    .addEventListener("click", (e) => {
      if (e.target.id === "allotModalOverlay") {
        closeAllotModal();
      }
    });
});
