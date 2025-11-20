document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS || !window.LMS.Auth) {
    window.location.href = "/login";
    return;
  }

  if (window.LMS.Auth.isAuthenticated()) {
    window.location.href = "/dashboard";
  } else {
    window.location.href = "/login";
  }
});
