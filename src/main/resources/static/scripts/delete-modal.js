(function () {
  "use strict";

  let deleteModal = null;
  let deleteForm = null;
  let deleteOverlay = null;

  function initDeleteModal() {
    if (!document.getElementById("deleteModal")) {
      const modalHTML = `
        <div id="deleteModal" class="hidden">
          <div class="modal-overlay" id="deleteModalOverlay">
            <div class="modal" style="max-width: 400px;">
              <div class="modal-header">
                <h3 id="deleteModalTitle">Confirm Delete</h3>
                <button class="modal-close delete-modal-close" type="button">
                  &times;
                </button>
              </div>
              <div class="modal-body">
                <p id="deleteModalMessage">Are you sure you want to delete this item?</p>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                  This action cannot be undone.
                </p>
              </div>
              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-secondary delete-modal-close"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  id="deleteConfirmBtn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    deleteModal = document.getElementById("deleteModal");
    deleteOverlay = document.getElementById("deleteModalOverlay");
    const closeBtns = document.querySelectorAll(".delete-modal-close");
    const confirmBtn = document.getElementById("deleteConfirmBtn");

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", closeDeleteModal);
    });

    if (deleteOverlay) {
      deleteOverlay.addEventListener("click", function (e) {
        if (e.target.id === "deleteModalOverlay") {
          closeDeleteModal();
        }
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        if (deleteForm) {
          deleteForm.submit();
        }
      });
    }
  }

  function openDeleteModal(form, message, title) {
    if (!deleteModal) {
      initDeleteModal();
    }

    deleteForm = form;
    const messageEl = document.getElementById("deleteModalMessage");
    const titleEl = document.getElementById("deleteModalTitle");

    if (message && messageEl) {
      messageEl.textContent = message;
    }
    if (title && titleEl) {
      titleEl.textContent = title;
    }

    deleteModal.classList.remove("hidden");
  }

  function closeDeleteModal() {
    if (deleteModal) {
      deleteModal.classList.add("hidden");
      deleteForm = null;
    }
  }

  function initDeleteForms(formClass, itemName) {
    const deleteForms = document.querySelectorAll("." + formClass);
    deleteForms.forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const message = `Are you sure you want to delete this ${itemName}?`;
        openDeleteModal(form, message, "Confirm Delete");
      });
    });
  }

  window.DeleteModal = {
    init: initDeleteModal,
    open: openDeleteModal,
    close: closeDeleteModal,
    initDeleteForms: initDeleteForms,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeleteModal);
  } else {
    initDeleteModal();
  }
})();
