let allStudents = [];
let currentPage = 1;
const pageSize = 10;

function loadStudents() {
  allStudents = window.LMS.Students.getAll();
  applyFilters();
}

function applyFilters() {
  const searchInput =
    document.getElementById("topbarSearch") ||
    document.getElementById("searchInput");
  const searchTerm = (searchInput ? searchInput.value : "").toLowerCase();
  let filtered = allStudents;

  if (searchTerm) {
    filtered = allStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm) ||
        (student.roll && student.roll.toLowerCase().includes(searchTerm)) ||
        (student.email && student.email.toLowerCase().includes(searchTerm))
    );
  }

  const pagination = window.LMS.Table.paginate(filtered, currentPage, pageSize);

  // Update count display
  const countElement = document.getElementById("studentCount");
  if (countElement) {
    const totalCount = filtered.length;
    countElement.textContent = ` (${totalCount} ${
      totalCount === 1 ? "student" : "students"
    })`;
  }

  renderTable(pagination.data);
  window.LMS.Table.createPagination(
    "paginationContainer",
    pagination,
    changePage
  );
}

function renderTable(students) {
  const columns = [
    { key: "roll", label: "Roll Number" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email", hideOnMobile: true },
    { key: "phone", label: "Phone", hideOnMobile: true },
    { key: "department", label: "Department", hideOnMobile: true },
    {
      key: "subscriptionId",
      label: "Subscription",
      render: (value, item) => {
        if (!value) return '<span class="badge badge-warning">None</span>';
        const subscription = window.LMS.Subscriptions.getById(value);
        if (subscription && subscription.active) {
          return '<span class="badge badge-success">Active</span>';
        }
        return '<span class="badge badge-danger">Inactive</span>';
      },
    },
  ];

  const actions = [
    {
      label: "View",
      class: "btn-secondary",
      onclick: "viewStudent",
    },
    {
      label: "Edit",
      class: "btn-secondary",
      onclick: "editStudent",
    },
    {
      label: "Delete",
      class: "btn-danger",
      onclick: "deleteStudent",
    },
  ];

  window.LMS.Table.createTable("tableContainer", students, columns, actions);
}

function changePage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function viewStudent(btn, student) {
  const subscription = student.subscriptionId
    ? window.LMS.Subscriptions.getById(student.subscriptionId)
    : null;

  const subscriptionBadge = subscription
    ? subscription.active
      ? '<span class="badge badge-success">Active</span>'
      : '<span class="badge badge-danger">Inactive</span>'
    : "None";

  const content = `
        <h3>${window.LMS.UI.escapeHtml(student.name)}</h3>
        <p><strong>Roll Number:</strong> ${window.LMS.UI.escapeHtml(
          student.roll || "-"
        )}</p>
        <p><strong>Email:</strong> ${window.LMS.UI.escapeHtml(
          student.email || "-"
        )}</p>
        <p><strong>Phone:</strong> ${window.LMS.UI.escapeHtml(
          student.phone || "-"
        )}</p>
        <p><strong>Department:</strong> ${window.LMS.UI.escapeHtml(
          student.department || "-"
        )}</p>
        <p><strong>Subscription:</strong> ${subscriptionBadge}</p>
        <p><strong>Created:</strong> ${window.LMS.UI.escapeHtml(
          window.LMS.UI.formatDate(student.createdAt)
        )}</p>
      `;

  window.LMS.UI.showModal("Student Details", content, null, true);
}

function editStudent(btn, student) {
  window.location.href = `/edit-student?id=${student.id}`;
}

function deleteStudent(btn, student) {
  window.LMS.UI.confirmDelete(
    `Are you sure you want to delete "${student.name}"?`,
    () => {
      const result = window.LMS.Students.delete(student.id);
      if (result === true) {
        window.LMS.UI.showToast("Student deleted successfully", "success");
        loadStudents();
      } else if (result && result.error) {
        window.LMS.UI.showToast(result.error, "error");
      } else {
        window.LMS.UI.showToast("Failed to delete student", "error");
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  loadStudents();

  const debouncedSearch = window.LMS.UI.debounce(applyFilters, 300);
  const topbarSearch = document.getElementById("topbarSearch");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", () => {
      currentPage = 1;
      debouncedSearch();
    });
  }
});
