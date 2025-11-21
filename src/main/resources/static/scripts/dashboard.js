document.addEventListener("DOMContentLoaded", () => {



  // Update stats
  function updateStats() {
    const books = window.LMS.Books.getAll();
    const students = window.LMS.Students.getAll();
    const allotments = window.LMS.Allotments.getAll();
    const overdue = window.LMS.Allotments.getOverdue();

    const totalBooks = books.length;
    const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const activeAllotments = allotments.filter((a) => !a.returnedAt).length;

    document.getElementById("totalBooks").textContent = totalBooks;
    document.getElementById("availableBooks").textContent = availableBooks;
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("activeAllotments").textContent = activeAllotments;
    document.getElementById("overdueBooks").textContent = overdue.length;
  }

  // Load history
  function loadHistory() {
    const history = window.LMS.Storage.getHistory();
    const recent = history.slice(0, 10);
    const container = document.getElementById("historyContainer");

    if (recent.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><p>No recent activity</p></div>';
      return;
    }

    container.innerHTML = recent
      .map(
        (item) => `
          <div class="history-item">
            <div class="history-item-header">
              <span class="history-action">${window.LMS.UI.escapeHtml(
                item.action
              )}</span>
              <span class="history-time">${window.LMS.UI.escapeHtml(
                window.LMS.UI.formatDate(item.timestamp)
              )}</span>
            </div>
            <div class="history-details">
              <strong>${window.LMS.UI.escapeHtml(
                item.actor
              )}</strong>: ${window.LMS.UI.escapeHtml(item.details)}
            </div>
          </div>
        `
      )
      .join("");
  }

  updateStats();
  loadHistory();

  // Initialize quick search with enhanced dropdown
  window.LMS.QuickSearch.init("dashboardSearch");
});
