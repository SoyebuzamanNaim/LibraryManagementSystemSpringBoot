let allSubscriptions = [];
let currentPage = 1;
let editingSubscriptionId = null;
const pageSize = 10;

function loadSubscriptions() {
  allSubscriptions = window.LMS.Subscriptions.getAll();
  const students = window.LMS.Students.getAll();

  // Enhance subscriptions with student names
  allSubscriptions = allSubscriptions.map((subscription) => {
    const student = students.find((s) => s.id == subscription.studentId);
    return {
      ...subscription,
      studentName: student ? student.name : "Unknown",
      studentRoll: student ? student.roll : "-",
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
  let filtered = allSubscriptions;

  if (searchTerm) {
    filtered = filtered.filter(
      (subscription) =>
        subscription.studentName.toLowerCase().includes(searchTerm) ||
        subscription.studentRoll.toLowerCase().includes(searchTerm)
    );
  }

  if (filterValue === "active") {
    filtered = filtered.filter((s) => s.active);
  } else if (filterValue === "inactive") {
    filtered = filtered.filter((s) => !s.active);
  }

  const pagination = window.LMS.Table.paginate(filtered, currentPage, pageSize);
  renderTable(pagination.data);
  window.LMS.Table.createPagination(
    "paginationContainer",
    pagination,
    changePage
  );
}

function renderTable(subscriptions) {
  const columns = [
    {
      key: "studentName",
      label: "Student",
      render: (value, item) => `${value} (${item.studentRoll})`,
    },
    { key: "type", label: "Type", hideOnMobile: true },
    {
      key: "startDate",
      label: "Start Date",
      hideOnMobile: true,
      render: (value) => window.LMS.UI.formatDateOnly(value),
    },
    {
      key: "endDate",
      label: "End Date",
      hideOnMobile: true,
      render: (value) => window.LMS.UI.formatDateOnly(value),
    },
    {
      key: "active",
      label: "Status",
      render: (value) =>
        value
          ? '<span class="badge badge-success">Active</span>'
          : '<span class="badge badge-danger">Inactive</span>',
    },
  ];

  const actions = [
    {
      label: "Edit",
      class: "btn-secondary",
      onclick: "editSubscription",
    },
    {
      label: "Delete",
      class: "btn-danger",
      onclick: "deleteSubscription",
    },
  ];

  window.LMS.Table.createTable(
    "tableContainer",
    subscriptions,
    columns,
    actions
  );
}

function changePage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAddSubscriptionModal() {
  editingSubscriptionId = null;
  document.getElementById("subscriptionModalTitle").textContent =
    "Add Subscription";
  document.getElementById("subscriptionSubmitBtn").textContent =
    "Add Subscription";
  document.getElementById("subscriptionForm").reset();

  // Load students
  const students = window.LMS.Students.getAll();
  const studentSelect = document.getElementById("subscriptionStudentId");
  studentSelect.innerHTML = '<option value="">Select Student</option>';
  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} (${student.roll})`;
    studentSelect.appendChild(option);
  });

  // Set default dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);
  document.getElementById("subscriptionStartDate").value = startDate
    .toISOString()
    .split("T")[0];
  document.getElementById("subscriptionEndDate").value = endDate
    .toISOString()
    .split("T")[0];
  document.getElementById("subscriptionActive").checked = true;

  document.getElementById("subscriptionModal").classList.remove("hidden");
}

function editSubscription(btn, subscription) {
  editingSubscriptionId = subscription.id;
  document.getElementById("subscriptionModalTitle").textContent =
    "Edit Subscription";
  document.getElementById("subscriptionSubmitBtn").textContent =
    "Update Subscription";

  // Load students
  const students = window.LMS.Students.getAll();
  const studentSelect = document.getElementById("subscriptionStudentId");
  studentSelect.innerHTML = '<option value="">Select Student</option>';
  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} (${student.roll})`;
    if (student.id == subscription.studentId) option.selected = true;
    studentSelect.appendChild(option);
  });

  document.getElementById("subscriptionType").value = subscription.type || "";
  document.getElementById("subscriptionStartDate").value =
    subscription.startDate || "";
  document.getElementById("subscriptionEndDate").value =
    subscription.endDate || "";
  document.getElementById("subscriptionActive").checked =
    subscription.active !== undefined ? subscription.active : true;

  document.getElementById("subscriptionModal").classList.remove("hidden");
}

function deleteSubscription(btn, subscription) {
  window.LMS.UI.confirmDelete(
    `Are you sure you want to delete subscription for ${subscription.studentName}? This action cannot be undone.`,
    () => {
      const result = window.LMS.Subscriptions.delete(subscription.id);
      if (result) {
        window.LMS.UI.showToast("Subscription deleted successfully", "success");

        // Update student's subscriptionId if needed
        const student = window.LMS.Students.getById(subscription.studentId);
        if (student && student.subscriptionId == subscription.id) {
          window.LMS.Students.update(student.id, {
            subscriptionId: null,
          });
        }

        loadSubscriptions();
      } else {
        window.LMS.UI.showToast("Failed to delete subscription", "error");
      }
    }
  );
}

function closeSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.add("hidden");
  document.getElementById("subscriptionForm").reset();
  editingSubscriptionId = null;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  loadSubscriptions();

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

  const openModalButton = document.getElementById("openSubscriptionModalBtn");
  if (openModalButton) {
    openModalButton.addEventListener("click", showAddSubscriptionModal);
  }

  document
    .querySelectorAll(".subscription-modal-close")
    .forEach((btn) => btn.addEventListener("click", closeSubscriptionModal));

  document
    .getElementById("subscriptionForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        studentId: document.getElementById("subscriptionStudentId").value,
        type: document.getElementById("subscriptionType").value,
        startDate: document.getElementById("subscriptionStartDate").value,
        endDate: document.getElementById("subscriptionEndDate").value,
        active: document.getElementById("subscriptionActive").checked,
      };

      if (
        !formData.studentId ||
        !formData.type ||
        !formData.startDate ||
        !formData.endDate
      ) {
        window.LMS.UI.showToast("Please fill all required fields", "error");
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        window.LMS.UI.showToast("End date must be after start date", "error");
        return;
      }

      let result;
      if (editingSubscriptionId) {
        result = window.LMS.Subscriptions.update(
          editingSubscriptionId,
          formData
        );
        if (result) {
          window.LMS.UI.showToast(
            "Subscription updated successfully",
            "success"
          );

          // Update student's subscriptionId if active
          if (formData.active) {
            const student = window.LMS.Students.getById(formData.studentId);
            if (student) {
              window.LMS.Students.update(student.id, {
                subscriptionId: result.id,
              });
            }
          }
        } else {
          window.LMS.UI.showToast("Failed to update subscription", "error");
          return;
        }
      } else {
        result = window.LMS.Subscriptions.create(formData);
        if (result) {
          window.LMS.UI.showToast("Subscription added successfully", "success");

          // Update student's subscriptionId if active
          if (formData.active) {
            const student = window.LMS.Students.getById(formData.studentId);
            if (student) {
              window.LMS.Students.update(student.id, {
                subscriptionId: result.id,
              });
            }
          }
        } else {
          window.LMS.UI.showToast("Failed to add subscription", "error");
          return;
        }
      }

      closeSubscriptionModal();
      loadSubscriptions();
    });

  document
    .getElementById("subscriptionModalOverlay")
    .addEventListener("click", (e) => {
      if (e.target.id === "subscriptionModalOverlay") {
        closeSubscriptionModal();
      }
    });
});
