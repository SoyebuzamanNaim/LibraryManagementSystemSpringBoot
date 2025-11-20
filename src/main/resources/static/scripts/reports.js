let currentReport = null;
let currentReportData = [];

function updateStats() {
  const overdue = window.LMS.Allotments.getOverdue();
  const allotments = window.LMS.Allotments.getAll();
  const books = window.LMS.Books.getAll();
  const subscriptions = window.LMS.Subscriptions.getAll();

  document.getElementById("overdueCount").textContent = overdue.length;
  document.getElementById("currentAllotmentsCount").textContent =
    allotments.filter((a) => !a.returnedAt).length;
  document.getElementById("purchaseCount").textContent = books.length;
  document.getElementById("subscriptionsCount").textContent =
    subscriptions.filter((s) => s.active).length;
}

function generateOverdueReport() {
  currentReport = "overdue";
  const overdue = window.LMS.Allotments.getOverdue();
  const books = window.LMS.Books.getAll();
  const students = window.LMS.Students.getAll();

  currentReportData = overdue.map((allotment) => {
    const book = books.find((b) => b.id == allotment.bookId);
    const student = students.find((s) => s.id == allotment.studentId);
    const daysOverdue = Math.floor(
      (new Date() - new Date(allotment.dueAt)) / (1000 * 60 * 60 * 24)
    );
    const fineAmount = window.LMS.Allotments.calculateFine(allotment);

    return {
      "Book Title": book ? book.title : "Unknown",
      "Student Name": student ? student.name : "Unknown",
      "Student Roll": student ? student.roll : "-",
      "Allotted Date": window.LMS.UI.formatDateOnly(allotment.allottedAt),
      "Due Date": window.LMS.UI.formatDateOnly(allotment.dueAt),
      "Days Overdue": daysOverdue,
      "Fine (Taka)": fineAmount > 0 ? fineAmount : "-",
    };
  });

  displayReport("Overdue Books Report", currentReportData, [
    { key: "Book Title", label: "Book Title" },
    { key: "Student Name", label: "Student Name" },
    { key: "Student Roll", label: "Student Roll" },
    { key: "Allotted Date", label: "Allotted Date" },
    { key: "Due Date", label: "Due Date" },
    { key: "Days Overdue", label: "Days Overdue" },
    { key: "Fine (Taka)", label: "Fine (Taka)" },
  ]);
}

function generateCurrentAllotmentsReport() {
  currentReport = "currentAllotments";
  const allotments = window.LMS.Allotments.getAll().filter(
    (a) => !a.returnedAt
  );
  const books = window.LMS.Books.getAll();
  const students = window.LMS.Students.getAll();

  currentReportData = allotments.map((allotment) => {
    const book = books.find((b) => b.id == allotment.bookId);
    const student = students.find((s) => s.id == allotment.studentId);
    const dueDate = new Date(allotment.dueAt);
    const isOverdue = dueDate < new Date();
    const fineAmount = isOverdue
      ? window.LMS.Allotments.calculateFine(allotment)
      : 0;

    return {
      "Book Title": book ? book.title : "Unknown",
      "Student Name": student ? student.name : "Unknown",
      "Student Roll": student ? student.roll : "-",
      "Allotted Date": window.LMS.UI.formatDateOnly(allotment.allottedAt),
      "Due Date": window.LMS.UI.formatDateOnly(allotment.dueAt),
      Status: isOverdue ? "Overdue" : "Active",
      "Fine (Taka)": fineAmount > 0 ? fineAmount : "-",
    };
  });

  displayReport("Current Allotments Report", currentReportData, [
    { key: "Book Title", label: "Book Title" },
    { key: "Student Name", label: "Student Name" },
    { key: "Student Roll", label: "Student Roll" },
    { key: "Allotted Date", label: "Allotted Date" },
    { key: "Due Date", label: "Due Date" },
    { key: "Status", label: "Status" },
    { key: "Fine (Taka)", label: "Fine (Taka)" },
  ]);
}

function generatePurchaseHistoryReport() {
  currentReport = "purchaseHistory";
  const books = window.LMS.Books.getAll();
  const publications = window.LMS.Publications.getAll();
  const vendors = window.LMS.Vendors.getAll();

  currentReportData = books.map((book) => {
    const publication = publications.find((p) => p.id == book.publicationId);
    const vendor = vendors.find((v) => v.id == book.vendorId);

    return {
      Title: book.title,
      Authors: Array.isArray(book.authors)
        ? book.authors.join(", ")
        : book.authors || "-",
      ISBN: book.isbn || "-",
      Publication: publication ? publication.name : "-",
      Vendor: vendor ? vendor.name : "-",
      "Total Copies": book.totalCopies || 0,
      "Purchase Date": book.purchaseDate
        ? window.LMS.UI.formatDateOnly(book.purchaseDate)
        : "-",
      Price: book.price ? `$${parseFloat(book.price).toFixed(2)}` : "-",
    };
  });

  displayReport("Purchase History Report", currentReportData, [
    { key: "Title", label: "Title" },
    { key: "Authors", label: "Authors" },
    { key: "ISBN", label: "ISBN" },
    { key: "Publication", label: "Publication" },
    { key: "Vendor", label: "Vendor" },
    { key: "Total Copies", label: "Total Copies" },
    { key: "Purchase Date", label: "Purchase Date" },
    { key: "Price", label: "Price" },
  ]);
}

function generateSubscriptionsReport() {
  currentReport = "subscriptions";
  const subscriptions = window.LMS.Subscriptions.getAll();
  const students = window.LMS.Students.getAll();

  currentReportData = subscriptions.map((subscription) => {
    const student = students.find((s) => s.id == subscription.studentId);

    return {
      "Student Name": student ? student.name : "Unknown",
      "Student Roll": student ? student.roll : "-",
      Type: subscription.type || "-",
      "Start Date": window.LMS.UI.formatDateOnly(subscription.startDate),
      "End Date": window.LMS.UI.formatDateOnly(subscription.endDate),
      Status: subscription.active ? "Active" : "Inactive",
    };
  });

  displayReport("Student Subscriptions Report", currentReportData, [
    { key: "Student Name", label: "Student Name" },
    { key: "Student Roll", label: "Student Roll" },
    { key: "Type", label: "Type" },
    { key: "Start Date", label: "Start Date" },
    { key: "End Date", label: "End Date" },
    { key: "Status", label: "Status" },
  ]);
}

function displayReport(title, data, columns) {
  document.getElementById("reportTitle").textContent = title;
  document.getElementById("exportBtn").style.display = "inline-block";

  if (data.length === 0) {
    document.getElementById("reportContainer").innerHTML = `
          <div class="empty-state">
            <p>No data available for this report</p>
          </div>
        `;
    return;
  }

  window.LMS.Table.createTable("reportContainer", data, columns, null);
}

function exportReport() {
  if (!currentReport || currentReportData.length === 0) {
    window.LMS.UI.showToast("No data to export", "warning");
    return;
  }

  const reportNames = {
    overdue: "Overdue_Books",
    currentAllotments: "Current_Allotments",
    purchaseHistory: "Purchase_History",
    subscriptions: "Subscriptions",
  };

  const filename = `${reportNames[currentReport]}_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  // Convert data to CSV format
  const columns = Object.keys(currentReportData[0]);
  window.LMS.CSV.export(
    currentReportData,
    filename,
    columns.map((key) => ({ key, label: key }))
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  updateStats();

  const buttonMap = [
    ["overdueReportBtn", generateOverdueReport],
    ["currentAllotmentsReportBtn", generateCurrentAllotmentsReport],
    ["purchaseHistoryReportBtn", generatePurchaseHistoryReport],
    ["subscriptionsReportBtn", generateSubscriptionsReport],
  ];

  buttonMap.forEach(([id, handler]) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", handler);
    }
  });

  const exportButton = document.getElementById("exportBtn");
  if (exportButton) {
    exportButton.addEventListener("click", exportReport);
  }

  // Initialize quick search with enhanced dropdown
  window.LMS.QuickSearch.init("topbarSearch");
});
