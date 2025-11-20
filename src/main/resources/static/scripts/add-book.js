document.addEventListener("DOMContentLoaded", () => {
  if (!window.LMS.Auth.requireAuth()) return;

  // Load publications and vendors
  const publications = window.LMS.Publications.getAll();
  const vendors = window.LMS.Vendors.getAll();

  const publicationSelect = document.getElementById("publicationId");
  publications.forEach((pub) => {
    const option = document.createElement("option");
    option.value = pub.id;
    option.textContent = pub.name;
    publicationSelect.appendChild(option);
  });

  const vendorSelect = document.getElementById("vendorId");
  vendors.forEach((vendor) => {
    const option = document.createElement("option");
    option.value = vendor.id;
    option.textContent = vendor.name;
    vendorSelect.appendChild(option);
  });

  // Set default available copies to match total copies
  document.getElementById("totalCopies").addEventListener("input", (e) => {
    const total = parseInt(e.target.value) || 0;
    const available = document.getElementById("availableCopies");
    if (!available.value) {
      available.value = total;
    }
  });

  document.getElementById("bookForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear errors
    document
      .querySelectorAll(".form-error")
      .forEach((el) => (el.textContent = ""));

    const formData = {
      title: document.getElementById("title").value.trim(),
      authors: document
        .getElementById("authors")
        .value.split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      publicationId: document.getElementById("publicationId").value,
      vendorId: document.getElementById("vendorId").value,
      isbn: document.getElementById("isbn").value.trim(),
      totalCopies: document.getElementById("totalCopies").value,
      availableCopies: document.getElementById("availableCopies").value,
      categories: document
        .getElementById("categories")
        .value.split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      purchaseDate: document.getElementById("purchaseDate").value || null,
      price: document.getElementById("price").value || null,
    };

    // Validation
    let hasError = false;

    if (!formData.title) {
      document.getElementById("titleError").textContent = "Title is required";
      hasError = true;
    }

    if (!formData.authors || formData.authors.length === 0) {
      document.getElementById("authorsError").textContent =
        "At least one author is required";
      hasError = true;
    }

    if (!formData.publicationId) {
      document.getElementById("publicationIdError").textContent =
        "Publication is required";
      hasError = true;
    }

    if (!formData.vendorId) {
      document.getElementById("vendorIdError").textContent =
        "Vendor is required";
      hasError = true;
    }

    const totalCopies = parseInt(formData.totalCopies);
    const availableCopies = parseInt(formData.availableCopies);

    if (!totalCopies || totalCopies < 1) {
      document.getElementById("totalCopiesError").textContent =
        "Total copies must be at least 1";
      hasError = true;
    }

    if (availableCopies < 0 || availableCopies > totalCopies) {
      document.getElementById(
        "availableCopiesError"
      ).textContent = `Available copies must be between 0 and ${totalCopies}`;
      hasError = true;
    }

    if (hasError) return;

    // Create book
    try {
      window.LMS.Books.create(formData);
      window.LMS.UI.showToast("Book added successfully", "success");
      setTimeout(() => {
        window.location.href = "/books";
      }, 500);
    } catch (error) {
      window.LMS.UI.showToast("Failed to add book", "error");
    }
  });
});
