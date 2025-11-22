document.addEventListener("DOMContentLoaded", () => {
  // Activities are now loaded from server via Thymeleaf
  // No need to load from localStorage anymore

  // Initialize quick search with enhanced dropdown
  if (window.LMS && window.LMS.QuickSearch) {
    window.LMS.QuickSearch.init("dashboardSearch");
  }
});
