/* ============================================
   Library Management System - Global Script
   ============================================ */

(function () {
  "use strict";

  // ============================================
  // Constants
  // ============================================

  const CONSTANTS = {
    HISTORY_MAX_ITEMS: 1000,
    HISTORY_BACKUP_MAX_ITEMS: 100,
    FINE_RATE_DEFAULT: 5,
    FINE_RATE_MIN: 0,
    FINE_RATE_MAX: 1000,
    STORAGE_RETRY_HISTORY_CLEAR_THRESHOLD: 500,
    ID_GENERATION_MAX_ATTEMPTS: 10,
    MOBILE_BREAKPOINT: 768,
    TOAST_DEFAULT_DURATION: 3000,
    FINE_AMOUNT_MAX: 1000000,
    FINE_AMOUNT_MAX_CAPPED: 999999.99,
  };

  // ============================================
  // Storage Module
  // ============================================

  /**
   * Storage module for managing localStorage operations
   * @namespace Storage
   */
  const Storage = {
    keys: {
      USERS: "lib_users",
      BOOKS: "lib_books",
      STUDENTS: "lib_students",
      VENDORS: "lib_vendors",
      PUBLICATIONS: "lib_publications",
      ALLOTMENTS: "lib_allotments",
      SUBSCRIPTIONS: "lib_subscriptions",
      HISTORY: "lib_history",
      SESSION: "lib_session",
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @returns {*|null} Parsed value or null if not found/error
     */
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error("Storage get error:", e);
        return null;
      }
    },

    /**
     * Set item in localStorage with quota error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false otherwise
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        if (
          e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED"
        ) {
          // Try to free up space by clearing old history
          try {
            const history = this.getHistory();
            if (
              history.length > CONSTANTS.STORAGE_RETRY_HISTORY_CLEAR_THRESHOLD
            ) {
              this.setHistory(
                history.slice(
                  0,
                  CONSTANTS.STORAGE_RETRY_HISTORY_CLEAR_THRESHOLD
                )
              );
              // Retry the original operation
              try {
                localStorage.setItem(key, JSON.stringify(value));
                window.LMS?.UI?.showToast(
                  "Storage was nearly full. Old history cleared.",
                  "warning"
                );
                return true;
              } catch (e2) {
                // If retry failed, show error
              }
            }
          } catch (e2) {
            // History clear failed
          }
          window.LMS?.UI?.showToast(
            "Storage is full. Please clear browser data.",
            "error"
          );
          console.error("Storage quota exceeded:", e);
          return false;
        }
        console.error("Storage set error:", e);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error("Storage remove error:", e);
        return false;
      }
    },

    getUsers() {
      return this.get(this.keys.USERS) || [];
    },

    setUsers(users) {
      return this.set(this.keys.USERS, users);
    },

    getBooks() {
      return this.get(this.keys.BOOKS) || [];
    },

    setBooks(books) {
      return this.set(this.keys.BOOKS, books);
    },

    getStudents() {
      return this.get(this.keys.STUDENTS) || [];
    },

    setStudents(students) {
      return this.set(this.keys.STUDENTS, students);
    },

    getVendors() {
      return this.get(this.keys.VENDORS) || [];
    },

    setVendors(vendors) {
      return this.set(this.keys.VENDORS, vendors);
    },

    getPublications() {
      return this.get(this.keys.PUBLICATIONS) || [];
    },

    setPublications(publications) {
      return this.set(this.keys.PUBLICATIONS, publications);
    },

    getAllotments() {
      return this.get(this.keys.ALLOTMENTS) || [];
    },

    setAllotments(allotments) {
      return this.set(this.keys.ALLOTMENTS, allotments);
    },

    getSubscriptions() {
      return this.get(this.keys.SUBSCRIPTIONS) || [];
    },

    setSubscriptions(subscriptions) {
      return this.set(this.keys.SUBSCRIPTIONS, subscriptions);
    },

    getHistory() {
      return this.get(this.keys.HISTORY) || [];
    },

    setHistory(history) {
      return this.set(this.keys.HISTORY, history);
    },

    getSession() {
      return sessionStorage.getItem(this.keys.SESSION);
    },

    setSession(token) {
      sessionStorage.setItem(this.keys.SESSION, token);
    },

    clearSession() {
      sessionStorage.removeItem(this.keys.SESSION);
    },

    seedData() {
      // Check if already seeded
      if (this.getUsers().length > 0) {
        return false;
      }

      // Create default admin user (password will be set on first login)
      const adminId = this.generateId();
      const admin = {
        id: adminId,
        username: "admin",
        passwordHash: "", // Will be set on first login
        name: "Administrator",
        role: "admin",
        createdAt: new Date().toISOString(),
      };

      // Sample books
      const books = [];
      const bookTitles = [
        "Introduction to Algorithms",
        "Clean Code",
        "Design Patterns",
        "The Pragmatic Programmer",
        "JavaScript: The Good Parts",
        "Python Crash Course",
        "HTML & CSS",
        "React: Up and Running",
        "Node.js in Action",
        "Database Systems",
      ];
      const authors = [
        "Thomas H. Cormen",
        "Robert C. Martin",
        "Gang of Four",
        "Andy Hunt",
        "Douglas Crockford",
        "Eric Matthes",
        "Jon Duckett",
        "Stoyan Stefanov",
        "Mike Cantelon",
        "Hector Garcia-Molina",
      ];
      const publicationIds = [1, 2];
      const vendorIds = [1, 2, 3];

      for (let i = 0; i < 10; i++) {
        books.push({
          id: i + 1,
          title: bookTitles[i],
          authors: [authors[i]],
          publicationId: publicationIds[i % 2],
          vendorId: vendorIds[i % 3],
          isbn: `978-0-${1000000000 + i}-${1000 + i}-${10 + i}`,
          totalCopies: Math.floor(Math.random() * 10) + 5,
          availableCopies: Math.floor(Math.random() * 5) + 2,
          categories: ["Computer Science", "Programming"],
          purchaseDate: new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
          price: (Math.random() * 50 + 20).toFixed(2),
          createdAt: new Date().toISOString(),
        });
      }

      // Sample students
      const students = [];
      const studentNames = [
        "John Doe",
        "Jane Smith",
        "Bob Johnson",
        "Alice Williams",
        "Charlie Brown",
      ];
      const departments = [
        "Computer Science",
        "Mathematics",
        "Physics",
        "Engineering",
        "Biology",
      ];

      for (let i = 0; i < 5; i++) {
        students.push({
          id: i + 1,
          name: studentNames[i],
          roll: `STU${String(i + 1).padStart(4, "0")}`,
          email: `${studentNames[i]
            .toLowerCase()
            .replace(" ", ".")}@university.edu`,
          phone: `555-${String(1000 + i).padStart(4, "0")}`,
          department: departments[i],
          subscriptionId: i < 3 ? i + 1 : null,
          createdAt: new Date().toISOString(),
        });
      }

      // Sample vendors
      const vendors = [
        {
          id: 1,
          name: "Academic Books Co.",
          contact: "John Vendor",
          phone: "555-0100",
          address: "123 Book Street, City",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Library Supplies Inc.",
          contact: "Jane Seller",
          phone: "555-0200",
          address: "456 Supply Ave, City",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Educational Resources Ltd.",
          contact: "Bob Manager",
          phone: "555-0300",
          address: "789 Resource Blvd, City",
          createdAt: new Date().toISOString(),
        },
      ];

      // Sample publications
      const publications = [
        {
          id: 1,
          name: "Tech Publications",
          address: "100 Publisher Lane, City",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Academic Press",
          address: "200 Academic Road, City",
          createdAt: new Date().toISOString(),
        },
      ];

      // Sample subscriptions
      const subscriptions = [
        {
          id: 1,
          studentId: 1,
          type: "Annual",
          startDate: new Date(2024, 0, 1).toISOString().split("T")[0],
          endDate: new Date(2024, 11, 31).toISOString().split("T")[0],
          active: true,
        },
        {
          id: 2,
          studentId: 2,
          type: "Semester",
          startDate: new Date(2024, 0, 1).toISOString().split("T")[0],
          endDate: new Date(2024, 5, 30).toISOString().split("T")[0],
          active: true,
        },
        {
          id: 3,
          studentId: 3,
          type: "Annual",
          startDate: new Date(2023, 0, 1).toISOString().split("T")[0],
          endDate: new Date(2023, 11, 31).toISOString().split("T")[0],
          active: false,
        },
      ];

      // Sample allotments
      const allotments = [
        {
          id: 1,
          bookId: 1,
          studentId: 1,
          allottedBy: adminId,
          allottedAt: new Date(2024, 2, 15).toISOString(),
          dueAt: new Date(2024, 3, 15).toISOString(),
          returnedAt: null,
          status: "active",
        },
        {
          id: 2,
          bookId: 2,
          studentId: 2,
          allottedBy: adminId,
          allottedAt: new Date(2024, 1, 10).toISOString(),
          dueAt: new Date(2024, 2, 10).toISOString(),
          returnedAt: new Date(2024, 2, 8).toISOString(),
          status: "returned",
        },
      ];

      // Sample history
      const history = [
        {
          id: 1,
          actor: admin.name,
          action: "System Initialized",
          details: "Library management system initialized with sample data",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          actor: admin.name,
          action: "Book Added",
          details: "Added book: Introduction to Algorithms",
          timestamp: new Date().toISOString(),
        },
      ];

      this.setUsers([admin]);
      this.setBooks(books);
      this.setStudents(students);
      this.setVendors(vendors);
      this.setPublications(publications);
      this.setSubscriptions(subscriptions);
      this.setAllotments(allotments);
      this.setHistory(history);

      return true;
    },

    /**
     * Generate unique ID with collision detection
     * @returns {string} Unique ID string
     * @throws {Error} If unable to generate unique ID after max attempts
     */
    generateId() {
      let id;
      let attempts = 0;

      do {
        id =
          Date.now().toString(36) +
          Math.random().toString(36).slice(2) +
          (typeof performance !== "undefined"
            ? performance.now().toString(36).slice(2)
            : Math.random().toString(36).slice(2));
        attempts++;
      } while (
        this.idExists(id) &&
        attempts < CONSTANTS.ID_GENERATION_MAX_ATTEMPTS
      );

      if (attempts >= CONSTANTS.ID_GENERATION_MAX_ATTEMPTS) {
        throw new Error(
          "Failed to generate unique ID after " +
            CONSTANTS.ID_GENERATION_MAX_ATTEMPTS +
            " attempts"
        );
      }

      return id;
    },

    /**
     * Check if ID exists across all entities
     * @param {string} id - ID to check
     * @returns {boolean} True if ID exists, false otherwise
     */
    idExists(id) {
      const allEntities = [
        ...this.getUsers(),
        ...this.getBooks(),
        ...this.getStudents(),
        ...this.getAllotments(),
        ...this.getVendors(),
        ...this.getPublications(),
        ...this.getSubscriptions(),
      ];
      return allEntities.some((e) => e.id === id || e.id == id);
    },
  };

  // ============================================
  // Auth Module
  // ============================================

  /**
   * Authentication module for user management and session handling
   * @namespace Auth
   */
  const Auth = {
    /**
     * Hash password using SHA-256
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Hex-encoded hash
     */
    async hashPassword(password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    },

    /**
     * Verify password against hash
     * @param {string} password - Plain text password
     * @param {string} hash - Stored password hash
     * @returns {Promise<boolean>} True if password matches
     */
    async verifyPassword(password, hash) {
      const passwordHash = await this.hashPassword(password);
      return passwordHash === hash;
    },

    /**
     * Authenticate user login
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise<Object>} {success: boolean, user?: Object, token?: string, message?: string}
     */
    async login(username, password) {
      const users = Storage.getUsers();
      const user = users.find((u) => u.username === username);

      if (!user) {
        return { success: false, message: "Invalid username or password" };
      }

      // First time login - set password
      if (!user.passwordHash) {
        const hash = await this.hashPassword(password);
        user.passwordHash = hash;
        Storage.setUsers(users);
        const token = Storage.generateId();
        Storage.setSession(token);
        this.logHistory("Login", `User ${username} logged in (first time)`);
        return { success: true, user, token };
      }

      const isValid = await this.verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return { success: false, message: "Invalid username or password" };
      }

      const token = Storage.generateId();
      Storage.setSession(token);
      this.logHistory("Login", `User ${username} logged in`);
      return { success: true, user, token };
    },

    logout() {
      Storage.clearSession();
      window.location.href = "login.html";
    },

    isAuthenticated() {
      return !!Storage.getSession();
    },

    getCurrentUser() {
      if (!this.isAuthenticated()) return null;
      const users = Storage.getUsers();
      // Return first admin user as current user (can be enhanced)
      return users.find((u) => u.role === "admin") || users[0] || null;
    },

    requireAuth() {
      if (!this.isAuthenticated()) {
        window.location.href = "login.html";
        return false;
      }
      return true;
    },

    logHistory(action, details, actor = null) {
      try {
        const user = actor || this.getCurrentUser();
        const history = Storage.getHistory();
        history.unshift({
          id: Storage.generateId(),
          actor: user ? user.name : "System",
          action,
          details,
          timestamp: new Date().toISOString(),
        });

        // Keep only last HISTORY_MAX_ITEMS history items
        if (history.length > CONSTANTS.HISTORY_MAX_ITEMS) {
          history.splice(CONSTANTS.HISTORY_MAX_ITEMS);
        }

        const success = Storage.setHistory(history);
        if (!success) {
          console.error("Failed to save history:", { action, details });
          // Try to save to sessionStorage as backup
          try {
            const backup = sessionStorage.getItem("lib_history_backup") || "[]";
            const backupArray = JSON.parse(backup);
            backupArray.unshift(history[0]);
            // Keep only last HISTORY_BACKUP_MAX_ITEMS items in backup
            if (backupArray.length > CONSTANTS.HISTORY_BACKUP_MAX_ITEMS) {
              backupArray.splice(CONSTANTS.HISTORY_BACKUP_MAX_ITEMS);
            }
            sessionStorage.setItem(
              "lib_history_backup",
              JSON.stringify(backupArray)
            );
          } catch (e) {
            console.error("Failed to save history backup:", e);
          }
        }
      } catch (e) {
        console.error("History logging error:", e);
      }
    },
  };

  // ============================================
  // Validators Module
  // ============================================

  /**
   * Validation module for input validation
   * @namespace Validators
   */
  const Validators = {
    /**
     * Validate required field
     * @param {*} value - Value to validate
     * @param {string} fieldName - Field name for error message
     * @returns {string|null} Error message or null if valid
     */
    required(value, fieldName) {
      if (!value || value.toString().trim() === "") {
        return `${fieldName} is required`;
      }
      return null;
    },

    email(value) {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Invalid email address";
      }
      return null;
    },

    minLength(value, min, fieldName) {
      if (value && value.toString().length < min) {
        return `${fieldName} must be at least ${min} characters`;
      }
      return null;
    },

    number(value, fieldName) {
      if (value && isNaN(value)) {
        return `${fieldName} must be a number`;
      }
      return null;
    },

    positive(value, fieldName) {
      if (value && parseFloat(value) <= 0) {
        return `${fieldName} must be greater than 0`;
      }
      return null;
    },

    date(value, fieldName) {
      if (value && isNaN(Date.parse(value))) {
        return `${fieldName} must be a valid date`;
      }
      return null;
    },
  };

  // ============================================
  // UI Module
  // ============================================

  /**
   * UI utilities module for DOM manipulation and user interactions
   * @namespace UI
   */
  const UI = {
    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML string
     */
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    },

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} [type="info"] - Toast type: success, error, warning, info
     * @param {number} [duration=3000] - Display duration in milliseconds
     */
    showToast(
      message,
      type = "info",
      duration = CONSTANTS.TOAST_DEFAULT_DURATION
    ) {
      const container =
        document.getElementById("toast-container") ||
        this.createToastContainer();
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;

      const titles = {
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Info",
      };

      const title = titles[type] || "Info";

      toast.innerHTML = `
        <div class="toast-header">
          <span class="toast-title">${this.escapeHtml(title)}</span>
          <button class="toast-close" aria-label="Close">&times;</button>
        </div>
        <div class="toast-message">${this.escapeHtml(message)}</div>
      `;

      // Add close button handler
      const closeBtn = toast.querySelector(".toast-close");
      let timeoutId1, timeoutId2;

      const cleanup = () => {
        if (timeoutId1) clearTimeout(timeoutId1);
        if (timeoutId2) clearTimeout(timeoutId2);
        toast.remove();
      };

      closeBtn.addEventListener("click", cleanup);

      container.appendChild(toast);

      // Animate in
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
      });

      timeoutId1 = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(400px)";
        timeoutId2 = setTimeout(cleanup, 300);
      }, duration);

      // Cleanup on page unload
      if (!window._toastCleanupHandlers) {
        window._toastCleanupHandlers = [];
        window.addEventListener("beforeunload", () => {
          window._toastCleanupHandlers.forEach((fn) => fn());
        });
      }
      window._toastCleanupHandlers.push(cleanup);
    },

    showLoading(message = "Loading...") {
      const overlay = document.createElement("div");
      overlay.className = "loading-overlay";
      overlay.id = "loading-overlay";
      overlay.innerHTML = `
        <div class="loading"></div>
        <p>${message}</p>
      `;
      document.body.appendChild(overlay);
      return overlay;
    },

    hideLoading() {
      const overlay = document.getElementById("loading-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 300);
      }
    },

    createToastContainer() {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
      return container;
    },

    showModal(title, content, onConfirm, onCancel) {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";

      overlay.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3>${this.escapeHtml(title)}</h3>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">${content}</div>
          <div class="modal-footer">
            ${
              onCancel
                ? `<button class="btn btn-secondary modal-cancel-btn">Cancel</button>`
                : ""
            }
            <button class="btn btn-primary modal-confirm-btn">Confirm</button>
          </div>
        </div>
      `;

      const confirmBtn = overlay.querySelector(".modal-confirm-btn");
      const cancelBtn = overlay.querySelector(".modal-cancel-btn");
      const closeBtn = overlay.querySelector(".modal-close");

      const removeOverlay = () => overlay.remove();

      confirmBtn.addEventListener("click", () => {
        if (onConfirm) onConfirm();
        removeOverlay();
      });

      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          if (onCancel) onCancel();
          removeOverlay();
        });
      }

      closeBtn.addEventListener("click", removeOverlay);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          removeOverlay();
        }
      });

      document.body.appendChild(overlay);
    },

    confirmDelete(message, onConfirm) {
      this.showModal(
        "Confirm Delete",
        `<p style="margin-bottom: 0.5rem;">${message}</p><p style="font-size: 0.875rem; color: var(--text-secondary);">This action cannot be undone.</p>`,
        onConfirm,
        () => {
          // Cancel handler - just close the modal (no action needed)
        }
      );
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },

    formatDateOnly(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    addKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          const searchInput = document.querySelector('input[type="search"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }

        // Escape to close modals
        if (e.key === "Escape") {
          const modal = document.querySelector(".modal-overlay");
          if (modal) {
            modal.remove();
          }
        }

        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === "/") {
          e.preventDefault();
          this.showToast(
            "Press Ctrl+K to search, Esc to close modals",
            "info",
            2000
          );
        }
      });
    },

    enhanceInputs() {
      // Add enter key support for forms
      document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
              e.preventDefault();
              submitBtn.click();
            }
          }
        });
      });

      // Add autocomplete suggestions for search
      document.querySelectorAll('input[type="search"]').forEach((input) => {
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");
      });
    },
  };

  // ============================================
  // Table/Filter Module
  // ============================================

  /**
   * Table module for rendering tables and pagination
   * @namespace Table
   */
  const Table = {
    /**
     * Get icon for action button
     * @param {string} action - Action name
     * @returns {string} Icon emoji
     */
    getActionIcon(action) {
      const icons = {
        View: "🔍",
        Edit: "✏️",
        Delete: "❌",
        Return: "↩️",
      };
      return icons[action] || "⚙️";
    },

    /**
     * Create and render data table
     * @param {string} containerId - ID of container element
     * @param {Array} data - Array of data objects
     * @param {Array} columns - Column definitions with key, label, render, hideOnMobile
     * @param {Array} [actions] - Action buttons with label, onclick, condition, class
     */
    createTable(containerId, data, columns, actions) {
      const container = document.getElementById(containerId);
      if (!container) return;

      let tableHTML =
        "<table class='w-full'><thead><tr class='bg-gray-50 border-b-2 border-gray-200'>";
      columns.forEach((col) => {
        // Check if column should be hidden on mobile
        // hidden = hide on mobile (< 768px), md:table-cell = show on desktop (>= 768px)
        const hideOnMobile = col.hideOnMobile ? "!hidden md:!table-cell" : "";
        const escapedLabel = UI.escapeHtml(col.label);
        tableHTML += `<th class='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${hideOnMobile}'>${escapedLabel}</th>`;
      });
      if (actions) {
        tableHTML +=
          "<th class='px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider sticky right-0 bg-gray-50 z-10'>Actions</th>";
      }
      tableHTML += "</tr></thead><tbody>";

      if (data.length === 0) {
        tableHTML += `<tr><td colspan="${
          columns.length + (actions ? 1 : 0)
        }" class='px-4 py-12 text-center'>
          <div class='flex flex-col items-center justify-center space-y-3'>
            <div class='text-6xl opacity-50'>📭</div>
            <h3 class='text-lg font-semibold text-gray-900'>No records found</h3>
            <p class='text-sm text-gray-600'>Try adjusting your search or filters to see more results.</p>
          </div>
        </td></tr>`;
      } else {
        data.forEach((item) => {
          tableHTML +=
            "<tr class='border-b border-gray-200 hover:bg-gray-50 transition-colors'>";
          columns.forEach((col) => {
            const value = col.render
              ? col.render(item[col.key], item)
              : item[col.key] || "-";
            // Hide cell on mobile if column has hideOnMobile property
            // !hidden = hide on mobile (< 768px), md:!table-cell = show on desktop (>= 768px)
            const hideOnMobile = col.hideOnMobile
              ? "!hidden md:!table-cell"
              : "";
            tableHTML += `<td class='px-4 py-4 text-sm text-gray-900 ${hideOnMobile}'>${value}</td>`;
          });
          if (actions) {
            tableHTML += '<td class="action-buttons-cell">';
            tableHTML += '<div class="action-buttons">';
            actions.forEach((action) => {
              if (!action.condition || action.condition(item)) {
                const icon = this.getActionIcon(action.label);
                const isDanger =
                  action.class && action.class.includes("danger");
                const buttonClasses = isDanger
                  ? "btn btn-danger"
                  : action.label === "View"
                  ? "btn btn-primary"
                  : "btn btn-secondary";

                const escapedActionLabel = UI.escapeHtml(action.label);
                const escapedItemId = UI.escapeHtml(String(item.id));
                tableHTML += `<button 
                  class="${buttonClasses} btn-small"
                  data-action="${UI.escapeHtml(action.onclick)}"
                  data-item-id="${escapedItemId}"
                  title="${escapedActionLabel}"
                  aria-label="${escapedActionLabel}"
                  type="button">
                  <span>${icon}</span>
                  <span class="action-btn-text">${escapedActionLabel}</span>
                </button>`;
              }
            });
            tableHTML += "</div></td>";
          }
          tableHTML += "</tr>";
        });
      }

      tableHTML += "</tbody></table>";
      container.innerHTML = tableHTML;

      // Attach event listeners to action buttons (after innerHTML to ensure buttons exist)
      if (actions) {
        container.querySelectorAll("[data-action]").forEach((btn) => {
          btn.addEventListener("click", function () {
            const actionName = this.dataset.action;
            const itemId = this.dataset.itemId;
            const foundItem = data.find((i) => i.id == itemId);
            if (
              window[actionName] &&
              typeof window[actionName] === "function"
            ) {
              window[actionName](this, foundItem);
            }
          });
        });
      }
    },

    /**
     * Paginate data array
     * @param {Array} data - Data array
     * @param {number} page - Current page (1-based)
     * @param {number} pageSize - Items per page
     * @returns {Object} {data: Array, total: number, page: number, pageSize: number, totalPages: number}
     */
    paginate(data, page, pageSize) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        data: data.slice(start, end),
        total: data.length,
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize),
      };
    },

    /**
     * Create pagination controls with event listeners
     * @param {string} containerId - ID of container element
     * @param {Object} pagination - Pagination object from paginate()
     * @param {string|Function} onPageChange - Function name (string) or callback function to handle page changes
     */
    createPagination(containerId, pagination, onPageChange) {
      const container = document.getElementById(containerId);
      if (!container || pagination.totalPages <= 1) {
        if (container) container.innerHTML = "";
        return;
      }

      const fragment = document.createDocumentFragment();
      const paginationDiv = document.createElement("div");
      paginationDiv.className =
        "flex flex-wrap items-center justify-center gap-2 md:gap-3 py-4";

      // Previous button
      const prevBtn = document.createElement("button");
      const isFirstPage = pagination.page === 1;
      prevBtn.disabled = isFirstPage;
      prevBtn.className = `px-3 md:px-4 py-2 text-sm md:text-base font-medium rounded-lg border-2 transition-all ${
        isFirstPage
          ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md"
      }`;
      prevBtn.setAttribute("aria-label", "Go to previous page");
      prevBtn.type = "button";
      prevBtn.textContent = "Previous";
      prevBtn.dataset.page = String(pagination.page - 1);
      if (!isFirstPage) {
        prevBtn.addEventListener("click", () => {
          const page = parseInt(prevBtn.dataset.page, 10);
          if (typeof onPageChange === "string" && window[onPageChange]) {
            window[onPageChange](page);
          } else if (typeof onPageChange === "function") {
            onPageChange(page);
          }
        });
      }
      paginationDiv.appendChild(prevBtn);

      // Page numbers - show fewer on mobile
      for (let i = 1; i <= pagination.totalPages; i++) {
        const isCurrent = i === pagination.page;
        const isFirst = i === 1;
        const isLast = i === pagination.totalPages;
        const isAdjacent = i >= pagination.page - 1 && i <= pagination.page + 1;
        const isNearCurrent =
          i >= pagination.page - 2 && i <= pagination.page + 2;

        if (isFirst || isLast || isNearCurrent) {
          // Show current, first, last, and adjacent pages on mobile
          // Show wider range on desktop (nearCurrent pages)
          const showOnMobile = isFirst || isLast || isCurrent || isAdjacent;
          const showOnDesktop = isNearCurrent;

          const buttonClasses = `px-3 md:px-4 py-2 text-sm md:text-base font-medium rounded-lg min-w-[36px] md:min-w-[44px] transition-all ${
            isCurrent
              ? "bg-blue-600 text-white border-2 border-blue-600 shadow-md"
              : "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md"
          } ${showOnMobile ? "" : "hidden md:inline-block"} ${
            !showOnDesktop && showOnMobile ? "md:hidden" : ""
          }`;

          const pageBtn = document.createElement("button");
          pageBtn.className = buttonClasses;
          pageBtn.setAttribute("aria-label", `Go to page ${i}`);
          pageBtn.type = "button";
          pageBtn.textContent = String(i);
          pageBtn.dataset.page = String(i);
          pageBtn.addEventListener("click", () => {
            const page = parseInt(pageBtn.dataset.page, 10);
            if (typeof onPageChange === "string" && window[onPageChange]) {
              window[onPageChange](page);
            } else if (typeof onPageChange === "function") {
              onPageChange(page);
            }
          });
          paginationDiv.appendChild(pageBtn);
        } else if (i === pagination.page - 3 || i === pagination.page + 3) {
          const ellipsis = document.createElement("span");
          ellipsis.className =
            "hidden md:inline-block px-2 text-gray-500 text-sm";
          ellipsis.textContent = "...";
          paginationDiv.appendChild(ellipsis);
        }
      }

      // Next button
      const nextBtn = document.createElement("button");
      const isLastPage = pagination.page === pagination.totalPages;
      nextBtn.disabled = isLastPage;
      nextBtn.className = `px-3 md:px-4 py-2 text-sm md:text-base font-medium rounded-lg border-2 transition-all ${
        isLastPage
          ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md"
      }`;
      nextBtn.setAttribute("aria-label", "Go to next page");
      nextBtn.type = "button";
      nextBtn.textContent = "Next";
      nextBtn.dataset.page = String(pagination.page + 1);
      if (!isLastPage) {
        nextBtn.addEventListener("click", () => {
          const page = parseInt(nextBtn.dataset.page, 10);
          if (typeof onPageChange === "string" && window[onPageChange]) {
            window[onPageChange](page);
          } else if (typeof onPageChange === "function") {
            onPageChange(page);
          }
        });
      }
      paginationDiv.appendChild(nextBtn);

      // Mobile page info
      const pageInfo = document.createElement("span");
      pageInfo.className =
        "text-xs md:text-sm text-gray-600 px-2 md:px-3 sm:hidden";
      pageInfo.textContent = `Page ${pagination.page} of ${pagination.totalPages}`;
      paginationDiv.appendChild(pageInfo);

      fragment.appendChild(paginationDiv);
      container.innerHTML = "";
      container.appendChild(fragment);
    },
  };

  // ============================================
  // CSV Export
  // ============================================

  /**
   * CSV export module
   * @namespace CSV
   */
  const CSV = {
    /**
     * Export data to CSV file
     * @param {Array} data - Data array to export
     * @param {string} [filename="export.csv"] - Download filename
     * @param {Array} [columns] - Column definitions (optional, auto-generated if not provided)
     */
    export(data, filename, columns) {
      if (!data || data.length === 0) {
        UI.showToast("No data to export", "warning");
        return;
      }

      // Check browser support
      if (
        typeof Blob === "undefined" ||
        typeof URL === "undefined" ||
        typeof URL.createObjectURL === "undefined"
      ) {
        UI.showToast("CSV export not supported in this browser", "error");
        return;
      }

      try {
        let csv = "";

        if (columns) {
          csv += columns.map((col) => col.label).join(",") + "\n";
          data.forEach((item) => {
            csv +=
              columns
                .map((col) => {
                  const value = col.render
                    ? col.render(item[col.key], item)
                    : item[col.key] || "";
                  return `"${String(value).replace(/"/g, '""')}"`;
                })
                .join(",") + "\n";
          });
        } else {
          // Auto-generate columns from first item
          const keys = Object.keys(data[0]);
          csv += keys.join(",") + "\n";
          data.forEach((item) => {
            csv +=
              keys
                .map(
                  (key) => `"${String(item[key] || "").replace(/"/g, '""')}"`
                )
                .join(",") + "\n";
          });
        }

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        if (typeof a.download === "undefined") {
          window.open(url, "_blank");
          UI.showToast(
            "CSV opened in new window. Please save manually.",
            "info"
          );
          // Still revoke after delay
          setTimeout(() => {
            try {
              window.URL.revokeObjectURL(url);
            } catch (e) {
              console.error("Failed to revoke object URL:", e);
            }
          }, 1000);
          return;
        }

        a.href = url;
        a.download = filename || "export.csv";
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);

        // Revoke URL after download completes (with delay)
        setTimeout(() => {
          try {
            window.URL.revokeObjectURL(url);
          } catch (e) {
            console.error("Failed to revoke object URL:", e);
          }
        }, 100);

        UI.showToast("CSV exported successfully", "success");
      } catch (e) {
        console.error("CSV export error:", e);
        UI.showToast("Failed to export CSV: " + e.message, "error");
      }
    },
  };

  // ============================================
  // Entity CRUD Operations
  // ============================================

  /**
   * Books CRUD module
   * @namespace Books
   */
  const Books = {
    /**
     * Get all books
     * @returns {Array} Array of book objects
     */
    getAll() {
      return Storage.getBooks();
    },

    /**
     * Get book by ID
     * @param {string|number} id - Book ID
     * @returns {Object|undefined} Book object or undefined if not found
     */
    getById(id) {
      return Storage.getBooks().find((b) => b.id == id);
    },

    /**
     * Create new book
     * @param {Object} bookData - Book data object
     * @returns {Object|{error: string}} Created book or error object
     */
    create(bookData) {
      const books = Storage.getBooks();
      const totalCopies = parseInt(bookData.totalCopies) || 0;
      const availableCopies = parseInt(bookData.availableCopies) || totalCopies;

      // Validation
      if (totalCopies < 0) {
        return { error: "Total copies cannot be negative" };
      }
      if (availableCopies > totalCopies) {
        return { error: "Available copies cannot exceed total copies" };
      }
      if (availableCopies < 0) {
        return { error: "Available copies cannot be negative" };
      }

      const newBook = {
        ...bookData,
        id: Storage.generateId(),
        totalCopies,
        availableCopies,
        createdAt: new Date().toISOString(),
      };
      books.push(newBook);
      Storage.setBooks(books);
      Auth.logHistory("Book Added", `Added book: ${newBook.title}`);
      return newBook;
    },

    /**
     * Update existing book
     * @param {string|number} id - Book ID
     * @param {Object} bookData - Updated book data
     * @returns {Object|null|{error: string}} Updated book, null if not found, or error object
     */
    update(id, bookData) {
      const books = Storage.getBooks();
      const index = books.findIndex((b) => b.id == id);
      if (index === -1) return null;

      const currentBook = books[index];
      const newTotalCopies =
        parseInt(bookData.totalCopies) !== undefined
          ? parseInt(bookData.totalCopies)
          : currentBook.totalCopies;
      const newAvailableCopies =
        parseInt(bookData.availableCopies) !== undefined
          ? parseInt(bookData.availableCopies)
          : currentBook.availableCopies;

      // Validation
      if (newTotalCopies < 0) {
        return { error: "Total copies cannot be negative" };
      }
      if (newAvailableCopies > newTotalCopies) {
        return { error: "Available copies cannot exceed total copies" };
      }
      if (newAvailableCopies < 0) {
        return { error: "Available copies cannot be negative" };
      }

      books[index] = {
        ...currentBook,
        ...bookData,
        id: currentBook.id,
        totalCopies: newTotalCopies,
        availableCopies: newAvailableCopies,
      };
      Storage.setBooks(books);
      Auth.logHistory("Book Updated", `Updated book: ${books[index].title}`);
      return books[index];
    },

    /**
     * Delete book
     * @param {string|number} id - Book ID
     * @returns {boolean|{error: string}} True if deleted, false if not found, or error object
     */
    delete(id) {
      const books = Storage.getBooks();
      const book = books.find((b) => b.id == id);
      if (!book) return false;

      // Check if book is allotted
      const allotments = Storage.getAllotments();
      const activeAllotment = allotments.find(
        (a) => a.bookId == id && !a.returnedAt
      );
      if (activeAllotment) {
        return { error: "Cannot delete book with active allotments" };
      }

      Storage.setBooks(books.filter((b) => b.id != id));
      Auth.logHistory("Book Deleted", `Deleted book: ${book.title}`);
      return true;
    },

    /**
     * Decrease available copies (atomic operation)
     * @param {string|number} id - Book ID
     * @returns {boolean} True if successful, false otherwise
     */
    decreaseAvailable(id) {
      const books = Storage.getBooks();
      const bookIndex = books.findIndex((b) => b.id == id);

      if (bookIndex === -1) return false;

      const book = books[bookIndex];
      if (book.availableCopies <= 0) {
        console.warn(
          `Cannot decrease: book ${id} has ${book.availableCopies} available copies`
        );
        return false;
      }

      // Atomic update
      const updatedBook = {
        ...book,
        availableCopies: Math.max(0, book.availableCopies - 1),
      };

      books[bookIndex] = updatedBook;

      const success = Storage.setBooks(books);
      if (!success) {
        console.error("Failed to save books after decreasing available copies");
        return false;
      }

      // Verify after write (defensive check)
      const verify = Storage.getBooks().find((b) => b.id == id);
      if (verify && verify.availableCopies < 0) {
        console.error("Available copies went negative! Recovering...");
        verify.availableCopies = 0;
        Storage.setBooks(books);
        return false;
      }

      return true;
    },

    /**
     * Increase available copies (atomic operation)
     * @param {string|number} id - Book ID
     * @returns {boolean} True if successful, false otherwise
     */
    increaseAvailable(id) {
      const books = Storage.getBooks();
      const bookIndex = books.findIndex((b) => b.id == id);

      if (bookIndex === -1) return false;

      const book = books[bookIndex];
      if (book.availableCopies >= book.totalCopies) {
        console.warn(
          `Cannot increase: book ${id} already at maximum (${book.totalCopies})`
        );
        return false;
      }

      // Atomic update
      const updatedBook = {
        ...book,
        availableCopies: Math.min(book.totalCopies, book.availableCopies + 1),
      };

      books[bookIndex] = updatedBook;
      return Storage.setBooks(books);
    },
  };

  const Students = {
    getAll() {
      return Storage.getStudents();
    },

    getById(id) {
      return Storage.getStudents().find((s) => s.id == id);
    },

    create(studentData) {
      const students = Storage.getStudents();
      const newStudent = {
        ...studentData,
        id: Storage.generateId(),
        createdAt: new Date().toISOString(),
      };
      students.push(newStudent);
      Storage.setStudents(students);
      Auth.logHistory("Student Added", `Added student: ${newStudent.name}`);
      return newStudent;
    },

    update(id, studentData) {
      const students = Storage.getStudents();
      const index = students.findIndex((s) => s.id == id);
      if (index === -1) return null;

      const currentStudent = students[index];

      // Check for duplicate roll number (excluding current student)
      if (studentData.roll && studentData.roll !== currentStudent.roll) {
        const duplicate = students.find(
          (s) => s.roll === studentData.roll && s.id != id
        );
        if (duplicate) {
          return { error: "Roll number already exists" };
        }
      }

      students[index] = {
        ...students[index],
        ...studentData,
        id: students[index].id,
      };
      Storage.setStudents(students);
      Auth.logHistory(
        "Student Updated",
        `Updated student: ${students[index].name}`
      );
      return students[index];
    },

    delete(id) {
      const students = Storage.getStudents();
      const student = students.find((s) => s.id == id);
      if (!student) return false;

      // Check for active allotments
      const allotments = Storage.getAllotments();
      const activeAllotment = allotments.find(
        (a) => a.studentId == id && !a.returnedAt
      );
      if (activeAllotment) {
        return { error: "Cannot delete student with active allotments" };
      }

      Storage.setStudents(students.filter((s) => s.id != id));
      Auth.logHistory("Student Deleted", `Deleted student: ${student.name}`);
      return true;
    },
  };

  const Vendors = {
    getAll() {
      return Storage.getVendors();
    },

    getById(id) {
      return Storage.getVendors().find((v) => v.id == id);
    },

    create(vendorData) {
      const vendors = Storage.getVendors();
      const newVendor = {
        ...vendorData,
        id: Storage.generateId(),
        createdAt: new Date().toISOString(),
      };
      vendors.push(newVendor);
      Storage.setVendors(vendors);
      Auth.logHistory("Vendor Added", `Added vendor: ${newVendor.name}`);
      return newVendor;
    },

    update(id, vendorData) {
      const vendors = Storage.getVendors();
      const index = vendors.findIndex((v) => v.id == id);
      if (index === -1) return null;

      vendors[index] = {
        ...vendors[index],
        ...vendorData,
        id: vendors[index].id,
      };
      Storage.setVendors(vendors);
      Auth.logHistory(
        "Vendor Updated",
        `Updated vendor: ${vendors[index].name}`
      );
      return vendors[index];
    },

    delete(id) {
      const vendors = Storage.getVendors();
      const vendor = vendors.find((v) => v.id == id);
      if (!vendor) return false;

      // Check if vendor has books
      const books = Storage.getBooks();
      const hasBooks = books.some((b) => b.vendorId == id);
      if (hasBooks) {
        return { error: "Cannot delete vendor with associated books" };
      }

      Storage.setVendors(vendors.filter((v) => v.id != id));
      Auth.logHistory("Vendor Deleted", `Deleted vendor: ${vendor.name}`);
      return true;
    },
  };

  const Publications = {
    getAll() {
      return Storage.getPublications();
    },

    getById(id) {
      return Storage.getPublications().find((p) => p.id == id);
    },

    create(publicationData) {
      const publications = Storage.getPublications();
      const newPublication = {
        ...publicationData,
        id: Storage.generateId(),
        createdAt: new Date().toISOString(),
      };
      publications.push(newPublication);
      Storage.setPublications(publications);
      Auth.logHistory(
        "Publication Added",
        `Added publication: ${newPublication.name}`
      );
      return newPublication;
    },

    update(id, publicationData) {
      const publications = Storage.getPublications();
      const index = publications.findIndex((p) => p.id == id);
      if (index === -1) return null;

      publications[index] = {
        ...publications[index],
        ...publicationData,
        id: publications[index].id,
      };
      Storage.setPublications(publications);
      Auth.logHistory(
        "Publication Updated",
        `Updated publication: ${publications[index].name}`
      );
      return publications[index];
    },

    delete(id) {
      const publications = Storage.getPublications();
      const publication = publications.find((p) => p.id == id);
      if (!publication) return false;

      // Check if publication has books
      const books = Storage.getBooks();
      const hasBooks = books.some((b) => b.publicationId == id);
      if (hasBooks) {
        return { error: "Cannot delete publication with associated books" };
      }

      Storage.setPublications(publications.filter((p) => p.id != id));
      Auth.logHistory(
        "Publication Deleted",
        `Deleted publication: ${publication.name}`
      );
      return true;
    },
  };

  /**
   * Allotments CRUD module with fine calculation
   * @namespace Allotments
   */
  const Allotments = {
    /**
     * Fine rate per day (configurable via localStorage)
     * @type {number}
     */
    get FINE_RATE_PER_DAY() {
      const rate = localStorage.getItem("lib_fine_rate");
      if (!rate) return CONSTANTS.FINE_RATE_DEFAULT;
      const parsed = parseFloat(rate);
      if (
        !isFinite(parsed) ||
        parsed < CONSTANTS.FINE_RATE_MIN ||
        parsed > CONSTANTS.FINE_RATE_MAX
      ) {
        console.warn("Invalid fine rate in storage, resetting to default");
        localStorage.setItem(
          "lib_fine_rate",
          CONSTANTS.FINE_RATE_DEFAULT.toString()
        );
        return CONSTANTS.FINE_RATE_DEFAULT;
      }
      return parsed;
    },

    /**
     * Set fine rate per day
     * @param {number|string} rate - Fine rate (0-1000 taka per day)
     * @throws {Error} If rate is invalid
     */
    setFineRate(rate) {
      const parsed = parseFloat(rate);
      if (
        !isFinite(parsed) ||
        parsed < CONSTANTS.FINE_RATE_MIN ||
        parsed > CONSTANTS.FINE_RATE_MAX
      ) {
        throw new Error(
          `Fine rate must be between ${CONSTANTS.FINE_RATE_MIN} and ${CONSTANTS.FINE_RATE_MAX} taka per day`
        );
      }
      localStorage.setItem("lib_fine_rate", parsed.toString());
    },

    getAll() {
      return Storage.getAllotments();
    },

    getById(id) {
      return Storage.getAllotments().find((a) => a.id == id);
    },

    /**
     * Calculate days overdue for an allotment (using UTC to avoid timezone issues)
     * @param {Object} allotment - Allotment object
     * @returns {number} Number of days overdue (0 if not overdue)
     */
    getDaysOverdue(allotment) {
      if (!allotment || !allotment.dueAt) return 0;

      const dueDate = new Date(allotment.dueAt);
      const returnDate = allotment.returnedAt
        ? new Date(allotment.returnedAt)
        : new Date();

      if (returnDate < dueDate) return 0;

      // Use UTC dates to avoid timezone and DST issues
      const dueUTC = Date.UTC(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );
      const returnUTC = Date.UTC(
        returnDate.getFullYear(),
        returnDate.getMonth(),
        returnDate.getDate()
      );

      const diffTime = returnUTC - dueUTC;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    },

    /**
     * Calculate fine amount for an allotment
     * @param {Object} allotment - Allotment object
     * @returns {number} Fine amount in taka
     */
    calculateFine(allotment) {
      const daysOverdue = this.getDaysOverdue(allotment);
      return daysOverdue * this.FINE_RATE_PER_DAY;
    },

    /**
     * Create new allotment with validation and rollback on failure
     * @param {Object} allotmentData - Allotment data with bookId and studentId
     * @returns {Object|{error: string}} Created allotment or error object
     */
    create(allotmentData) {
      // Validate foreign keys
      const book = Books.getById(allotmentData.bookId);
      if (!book) {
        return { error: "Book not found" };
      }

      const student = Students.getById(allotmentData.studentId);
      if (!student) {
        return { error: "Student not found" };
      }

      // Validate availability
      if (book.availableCopies <= 0) {
        return { error: "Book not available" };
      }

      const allotments = Storage.getAllotments();
      const user = Auth.getCurrentUser();

      // Decrease available copies (this also validates)
      if (!Books.decreaseAvailable(allotmentData.bookId)) {
        return { error: "Book not available or failed to reserve copy" };
      }

      const newAllotment = {
        ...allotmentData,
        id: Storage.generateId(),
        allottedBy: user ? user.id : null,
        allottedAt: new Date().toISOString(),
        status: "active",
        returnedAt: null,
      };

      try {
        allotments.push(newAllotment);
        const success = Storage.setAllotments(allotments);

        if (!success) {
          // Rollback: increase available copies
          Books.increaseAvailable(allotmentData.bookId);
          return { error: "Failed to save allotment" };
        }

        Auth.logHistory(
          "Book Allotted",
          `Allotted "${book.title}" to ${student.name}`
        );

        return newAllotment;
      } catch (e) {
        // Rollback on error
        Books.increaseAvailable(allotmentData.bookId);
        console.error("Allotment creation error:", e);
        return { error: "Failed to create allotment: " + e.message };
      }
    },

    /**
     * Return book and calculate fine if overdue
     * @param {string|number} id - Allotment ID
     * @returns {Object|{error: string}} Updated allotment or error object
     */
    returnBook(id) {
      const allotments = Storage.getAllotments();
      const allotment = allotments.find((a) => a.id == id);
      if (!allotment || allotment.returnedAt) {
        return { error: "Allotment not found or already returned" };
      }

      const returnDate = new Date().toISOString();
      allotment.returnedAt = returnDate;
      allotment.status = "returned";

      // Calculate and store fine if overdue
      const fineAmount = this.calculateFine(allotment);
      if (
        fineAmount > 0 &&
        isFinite(fineAmount) &&
        fineAmount < CONSTANTS.FINE_AMOUNT_MAX
      ) {
        allotment.fineAmount = Math.round(fineAmount * 100) / 100; // Round to 2 decimals
        allotment.fineCalculatedAt = returnDate;
      } else if (fineAmount >= CONSTANTS.FINE_AMOUNT_MAX) {
        console.error("Fine amount exceeds maximum:", fineAmount);
        // Cap at maximum reasonable value
        allotment.fineAmount = CONSTANTS.FINE_AMOUNT_MAX_CAPPED;
        allotment.fineCalculatedAt = returnDate;
      } else if (fineAmount < 0) {
        console.warn("Negative fine calculated, setting to 0:", fineAmount);
        allotment.fineAmount = 0;
      }

      Storage.setAllotments(allotments);

      // Increase available copies
      Books.increaseAvailable(allotment.bookId);

      const book = Books.getById(allotment.bookId);
      const student = Students.getById(allotment.studentId);
      const fineMessage =
        fineAmount > 0 ? ` with fine of ${fineAmount} taka` : "";
      Auth.logHistory(
        "Book Returned",
        `Returned "${book ? book.title : ""}" from ${
          student ? student.name : ""
        }${fineMessage}`
      );

      return allotment;
    },

    getOverdue() {
      const now = new Date();
      return Storage.getAllotments().filter((a) => {
        if (a.returnedAt) return false;
        return new Date(a.dueAt) < now;
      });
    },
  };

  const Subscriptions = {
    getAll() {
      return Storage.getSubscriptions();
    },

    getById(id) {
      return Storage.getSubscriptions().find((s) => s.id == id);
    },

    create(subscriptionData) {
      const subscriptions = Storage.getSubscriptions();
      const newSubscription = {
        ...subscriptionData,
        id: Storage.generateId(),
        active:
          subscriptionData.active !== undefined
            ? subscriptionData.active
            : true,
      };
      subscriptions.push(newSubscription);
      Storage.setSubscriptions(subscriptions);

      const student = Students.getById(subscriptionData.studentId);
      Auth.logHistory(
        "Subscription Added",
        `Added subscription for ${student ? student.name : ""}`
      );

      return newSubscription;
    },

    update(id, subscriptionData) {
      const subscriptions = Storage.getSubscriptions();
      const index = subscriptions.findIndex((s) => s.id == id);
      if (index === -1) return null;

      subscriptions[index] = {
        ...subscriptions[index],
        ...subscriptionData,
        id: subscriptions[index].id,
      };
      Storage.setSubscriptions(subscriptions);

      const student = Students.getById(subscriptions[index].studentId);
      Auth.logHistory(
        "Subscription Updated",
        `Updated subscription for ${student ? student.name : ""}`
      );

      return subscriptions[index];
    },

    delete(id) {
      const subscriptions = Storage.getSubscriptions();
      const subscription = subscriptions.find((s) => s.id == id);
      if (!subscription) return false;

      Storage.setSubscriptions(subscriptions.filter((s) => s.id != id));

      const student = Students.getById(subscription.studentId);
      Auth.logHistory(
        "Subscription Deleted",
        `Deleted subscription for ${student ? student.name : ""}`
      );

      return true;
    },
  };

  // ============================================
  // Initialize on page load
  // ============================================

  // Mobile state management with debouncing
  let isMobile = window.innerWidth < CONSTANTS.MOBILE_BREAKPOINT;

  // Debounced resize handler to update mobile state
  const updateMobileState = UI.debounce(() => {
    isMobile = window.innerWidth < CONSTANTS.MOBILE_BREAKPOINT;
  }, 250);

  // Listen for resize events to update mobile state
  window.addEventListener("resize", updateMobileState);

  // Close sidebar on mobile when navigation link is clicked
  function initMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");
    const mobileMenuButtons = document.querySelectorAll(".mobile-menu-btn");

    if (sidebar && sidebarLinks.length > 0) {
      sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => {
          // Use cached mobile state instead of checking window.innerWidth every time
          if (isMobile) {
            sidebar.classList.remove("open");
          }
        });
      });
    }

    if (sidebar && mobileMenuButtons.length > 0) {
      mobileMenuButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          sidebar.classList.toggle("open");
        });
      });
    }

    // Handle overlay click to close sidebar
    if (sidebarOverlay && sidebar) {
      sidebarOverlay.addEventListener("click", (e) => {
        // Only close if clicking directly on the overlay, not on children
        if (e.target === sidebarOverlay && isMobile) {
          sidebar.classList.remove("open");
        }
      });
    }
  }

  // Mobile search functionality
  function initMobileSearch() {
    const mobileSearchBtn = document.getElementById("mobileSearchBtn");
    const mobileSearchOverlay = document.getElementById("mobileSearchOverlay");
    const mobileSearchInput = document.getElementById("mobileSearchInput");
    const closeMobileSearch = document.getElementById("closeMobileSearch");
    const desktopSearch = document.querySelector(".topbar-search input");

    if (!mobileSearchBtn || !mobileSearchOverlay || !mobileSearchInput) {
      return; // Not all elements exist, skip initialization
    }

    function openMobileSearch() {
      mobileSearchOverlay.classList.add("show");
      setTimeout(() => {
        mobileSearchInput.focus();
      }, 100);
    }

    function closeMobileSearchFunc() {
      mobileSearchOverlay.classList.remove("show");
      mobileSearchInput.value = "";
      if (window.LMS.QuickSearch) {
        window.LMS.QuickSearch.hideMobileResults();
      }
    }

    mobileSearchBtn.addEventListener("click", openMobileSearch);

    if (closeMobileSearch) {
      closeMobileSearch.addEventListener("click", closeMobileSearchFunc);
    }

    mobileSearchOverlay.addEventListener("click", (e) => {
      if (e.target === mobileSearchOverlay) {
        closeMobileSearchFunc();
      }
    });

    // Sync mobile and desktop search inputs
    if (desktopSearch) {
      mobileSearchInput.addEventListener("input", (e) => {
        desktopSearch.value = e.target.value;
        desktopSearch.dispatchEvent(new Event("input"));
        // Trigger search if QuickSearch is initialized
        if (window.LMS.QuickSearch) {
          const term = e.target.value.trim();
          if (term.length >= 2) {
            const results = window.LMS.QuickSearch.search(term);
            // Show results in mobile overlay
            window.LMS.QuickSearch.showMobileResults(
              mobileSearchInput,
              results,
              term
            );
          } else {
            window.LMS.QuickSearch.hideMobileResults();
          }
        }
      });

      desktopSearch.addEventListener("input", (e) => {
        mobileSearchInput.value = e.target.value;
      });
    }

    // Handle Enter key in mobile search
    mobileSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (desktopSearch) {
          desktopSearch.dispatchEvent(new Event("input"));
        }
        // Don't close on Enter - let user see results
      }
      if (e.key === "Escape") {
        if (window.LMS.QuickSearch) {
          window.LMS.QuickSearch.hideMobileResults();
        }
        closeMobileSearchFunc();
      }
    });
  }

  // ============================================
  // Quick Search Module
  // ============================================

  /**
   * Global quick search across all entities
   * @namespace QuickSearch
   */
  const QuickSearch = {
    /**
     * Search across all entities (books, students, vendors, publications, allotments)
     * @param {string} searchTerm - Search query
     * @returns {Object} Search results grouped by entity type
     */
    search(searchTerm) {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          books: [],
          students: [],
          vendors: [],
          publications: [],
          allotments: [],
          total: 0,
        };
      }

      const term = searchTerm.toLowerCase().trim();
      const results = {
        books: [],
        students: [],
        vendors: [],
        publications: [],
        allotments: [],
        total: 0,
      };

      // Search Books
      const books = Books.getAll();
      const publications = Publications.getAll();
      const vendors = Vendors.getAll();

      results.books = books
        .map((book) => ({
          ...book,
          publicationName:
            publications.find((p) => p.id == book.publicationId)?.name || "-",
          vendorName: vendors.find((v) => v.id == book.vendorId)?.name || "-",
          authorsString: Array.isArray(book.authors)
            ? book.authors.join(", ")
            : book.authors || "-",
        }))
        .filter(
          (book) =>
            book.title.toLowerCase().includes(term) ||
            book.authorsString.toLowerCase().includes(term) ||
            (book.isbn && book.isbn.toLowerCase().includes(term)) ||
            book.publicationName.toLowerCase().includes(term)
        )
        .slice(0, 5); // Limit to 5 results per entity

      // Search Students
      const students = Students.getAll();
      results.students = students
        .filter(
          (student) =>
            student.name.toLowerCase().includes(term) ||
            (student.roll && student.roll.toLowerCase().includes(term)) ||
            (student.email && student.email.toLowerCase().includes(term)) ||
            (student.department &&
              student.department.toLowerCase().includes(term))
        )
        .slice(0, 5);

      // Search Vendors
      const vendors_list = Vendors.getAll();
      results.vendors = vendors_list
        .filter(
          (vendor) =>
            vendor.name.toLowerCase().includes(term) ||
            (vendor.contact && vendor.contact.toLowerCase().includes(term)) ||
            (vendor.phone && vendor.phone.includes(term)) ||
            (vendor.address && vendor.address.toLowerCase().includes(term))
        )
        .slice(0, 5);

      // Search Publications
      const publications_list = Publications.getAll();
      results.publications = publications_list
        .filter(
          (pub) =>
            pub.name.toLowerCase().includes(term) ||
            (pub.address && pub.address.toLowerCase().includes(term))
        )
        .slice(0, 5);

      // Search Allotments (by book title or student name)
      const allotments = Allotments.getAll();
      results.allotments = allotments
        .map((allotment) => {
          const book = books.find((b) => b.id === allotment.bookId);
          const student = students.find((s) => s.id === allotment.studentId);
          return {
            ...allotment,
            bookTitle: book ? book.title : "-",
            studentName: student ? student.name : "-",
          };
        })
        .filter(
          (allotment) =>
            allotment.bookTitle.toLowerCase().includes(term) ||
            allotment.studentName.toLowerCase().includes(term)
        )
        .slice(0, 5);

      results.total =
        results.books.length +
        results.students.length +
        results.vendors.length +
        results.publications.length +
        results.allotments.length;

      return results;
    },

    /**
     * Initialize quick search for a page with dropdown results
     * @param {string} searchInputId - ID of the search input element
     * @param {Function} onSearch - Callback function when search is performed
     */
    init(searchInputId, onSearch) {
      const searchInput = document.getElementById(searchInputId);
      if (!searchInput) return;

      // Create search results dropdown
      const searchWrapper = searchInput.closest(".topbar-search");
      if (searchWrapper) {
        let resultsDropdown = searchWrapper.querySelector(
          ".quick-search-results"
        );
        if (!resultsDropdown) {
          resultsDropdown = document.createElement("div");
          resultsDropdown.className = "quick-search-results";
          searchWrapper.appendChild(resultsDropdown);
        }
      }

      const debouncedSearch = UI.debounce((term) => {
        const results = this.search(term);
        this.showResultsDropdown(searchInput, results, term);
        if (onSearch) {
          onSearch(results, term);
        }
      }, 300);

      searchInput.addEventListener("input", (e) => {
        const term = e.target.value.trim();
        if (term.length < 2) {
          this.hideResultsDropdown();
        } else {
          debouncedSearch(term);
        }
      });

      searchInput.addEventListener("focus", (e) => {
        const term = e.target.value.trim();
        if (term.length >= 2) {
          const results = this.search(term);
          this.showResultsDropdown(searchInput, results, term);
        }
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const results = this.search(e.target.value);
          if (onSearch) {
            onSearch(results, e.target.value);
          }
          this.hideResultsDropdown();
        } else if (e.key === "Escape") {
          this.hideResultsDropdown();
          searchInput.blur();
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!searchWrapper?.contains(e.target)) {
          this.hideResultsDropdown();
        }
      });
    },

    /**
     * Show search results dropdown
     * @param {HTMLElement} searchInput - Search input element
     * @param {Object} results - Search results
     * @param {string} searchTerm - Search term
     */
    showResultsDropdown(searchInput, results, searchTerm) {
      const searchWrapper = searchInput.closest(".topbar-search");
      if (!searchWrapper) return;

      let dropdown = searchWrapper.querySelector(".quick-search-results");
      if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.className = "quick-search-results";
        searchWrapper.appendChild(dropdown);
      }

      if (results.total === 0) {
        dropdown.innerHTML = `
          <div class="quick-search-empty">
            <div class="quick-search-empty-icon">🔍</div>
            <div class="quick-search-empty-text">No results found for "${UI.escapeHtml(
              searchTerm
            )}"</div>
          </div>
        `;
        dropdown.classList.add("show");
        return;
      }

      let html = '<div class="quick-search-results-content">';

      // Books
      if (results.books.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">📚 Books (${results.books.length})</div>`;
        results.books.forEach((book) => {
          html += `<div class="quick-search-item" data-type="book" data-id="${
            book.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              book.title
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              book.authorsString
            )} • ${UI.escapeHtml(book.publicationName)}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Students
      if (results.students.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">👥 Students (${results.students.length})</div>`;
        results.students.forEach((student) => {
          html += `<div class="quick-search-item" data-type="student" data-id="${
            student.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              student.name
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              student.roll || "-"
            )} • ${UI.escapeHtml(student.department || "-")}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Vendors
      if (results.vendors.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">🏪 Vendors (${results.vendors.length})</div>`;
        results.vendors.forEach((vendor) => {
          html += `<div class="quick-search-item" data-type="vendor" data-id="${
            vendor.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              vendor.name
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              vendor.contact || "-"
            )} • ${UI.escapeHtml(vendor.phone || "-")}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Publications
      if (results.publications.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">📰 Publications (${results.publications.length})</div>`;
        results.publications.forEach((pub) => {
          html += `<div class="quick-search-item" data-type="publication" data-id="${
            pub.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              pub.name
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              pub.address || "-"
            )}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Allotments
      if (results.allotments.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">📖 Allotments (${results.allotments.length})</div>`;
        results.allotments.forEach((allotment) => {
          html += `<div class="quick-search-item" data-type="allotment" data-id="${
            allotment.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              allotment.bookTitle
            )}</div>
            <div class="quick-search-item-subtitle">Student: ${UI.escapeHtml(
              allotment.studentName
            )}</div>
          </div>`;
        });
        html += "</div>";
      }

      html += "</div>";

      // Add "View All" link if multiple types
      const resultTypes = [
        results.books.length > 0,
        results.students.length > 0,
        results.vendors.length > 0,
        results.publications.length > 0,
        results.allotments.length > 0,
      ].filter(Boolean).length;

      if (resultTypes > 1) {
        html += `<div class="quick-search-footer">
          <button class="quick-search-view-all" data-term="${UI.escapeHtml(
            searchTerm
          )}">
            View all ${results.total} results
          </button>
        </div>`;
      }

      dropdown.innerHTML = html;
      dropdown.classList.add("show");

      // Add click handlers
      dropdown.querySelectorAll(".quick-search-item").forEach((item) => {
        item.addEventListener("click", () => {
          const type = item.dataset.type;
          const id = item.dataset.id;
          this.navigateToItem(type, id);
          this.hideResultsDropdown();
        });
      });

      const viewAllBtn = dropdown.querySelector(".quick-search-view-all");
      if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => {
          this.navigateToSearch(searchTerm, results);
          this.hideResultsDropdown();
        });
      }
    },

    /**
     * Hide search results dropdown
     */
    hideResultsDropdown() {
      document.querySelectorAll(".quick-search-results").forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    },

    /**
     * Navigate to a specific item
     * @param {string} type - Item type (book, student, vendor, etc.)
     * @param {string} id - Item ID
     */
    navigateToItem(type, id) {
      switch (type) {
        case "book":
          window.location.href = `edit-book.html?id=${id}`;
          break;
        case "student":
          window.location.href = `edit-student.html?id=${id}`;
          break;
        case "vendor":
          window.location.href = "vendors.html";
          break;
        case "publication":
          window.location.href = "publications.html";
          break;
        case "allotment":
          window.location.href = "allotments.html";
          break;
      }
    },

    /**
     * Navigate to search page with term
     * @param {string} searchTerm - Search term
     * @param {Object} results - Search results
     */
    navigateToSearch(searchTerm, results) {
      // Navigate to the page with most results
      const maxResults = Math.max(
        results.books.length,
        results.students.length,
        results.vendors.length,
        results.publications.length,
        results.allotments.length
      );

      if (results.books.length === maxResults) {
        window.location.href = `books.html?search=${encodeURIComponent(
          searchTerm
        )}`;
      } else if (results.students.length === maxResults) {
        window.location.href = `students.html?search=${encodeURIComponent(
          searchTerm
        )}`;
      } else if (results.vendors.length === maxResults) {
        window.location.href = `vendors.html?search=${encodeURIComponent(
          searchTerm
        )}`;
      } else if (results.publications.length === maxResults) {
        window.location.href = `publications.html?search=${encodeURIComponent(
          searchTerm
        )}`;
      } else if (results.allotments.length === maxResults) {
        window.location.href = `allotments.html?search=${encodeURIComponent(
          searchTerm
        )}`;
      }
    },

    /**
     * Show mobile search results
     * @param {HTMLElement} searchInput - Mobile search input
     * @param {Object} results - Search results
     * @param {string} searchTerm - Search term
     */
    showMobileResults(searchInput, results, searchTerm) {
      const mobileOverlay = document.getElementById("mobileSearchOverlay");
      if (!mobileOverlay) return;

      let resultsContainer = mobileOverlay.querySelector(
        ".mobile-search-results"
      );
      if (!resultsContainer) {
        resultsContainer = document.createElement("div");
        resultsContainer.className = "mobile-search-results";
        const mobileSearchDiv = mobileOverlay.querySelector(
          ".topbar-search-mobile"
        );
        if (mobileSearchDiv) {
          mobileSearchDiv.parentNode.insertBefore(
            resultsContainer,
            mobileSearchDiv.nextSibling
          );
        }
      }

      if (results.total === 0) {
        resultsContainer.innerHTML = `
          <div class="quick-search-empty">
            <div class="quick-search-empty-icon">🔍</div>
            <div class="quick-search-empty-text">No results found for "${UI.escapeHtml(
              searchTerm
            )}"</div>
          </div>
        `;
        resultsContainer.classList.add("show");
        return;
      }

      let html = '<div class="quick-search-results-content">';

      // Books
      if (results.books.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">📚 Books (${results.books.length})</div>`;
        results.books.forEach((book) => {
          html += `<div class="quick-search-item" data-type="book" data-id="${
            book.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              book.title
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              book.authorsString
            )} • ${UI.escapeHtml(book.publicationName)}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Students
      if (results.students.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">👥 Students (${results.students.length})</div>`;
        results.students.forEach((student) => {
          html += `<div class="quick-search-item" data-type="student" data-id="${
            student.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              student.name
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              student.roll || "-"
            )} • ${UI.escapeHtml(student.department || "-")}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Vendors
      if (results.vendors.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">🏪 Vendors (${results.vendors.length})</div>`;
        results.vendors.forEach((vendor) => {
          html += `<div class="quick-search-item" data-type="vendor" data-id="${
            vendor.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              vendor.name
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              vendor.contact || "-"
            )} • ${UI.escapeHtml(vendor.phone || "-")}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Publications
      if (results.publications.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">📰 Publications (${results.publications.length})</div>`;
        results.publications.forEach((pub) => {
          html += `<div class="quick-search-item" data-type="publication" data-id="${
            pub.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              pub.name
            )}</div>
            <div class="quick-search-item-subtitle">${UI.escapeHtml(
              pub.address || "-"
            )}</div>
          </div>`;
        });
        html += "</div>";
      }

      // Allotments
      if (results.allotments.length > 0) {
        html += `<div class="quick-search-section">
          <div class="quick-search-section-header">📖 Allotments (${results.allotments.length})</div>`;
        results.allotments.forEach((allotment) => {
          html += `<div class="quick-search-item" data-type="allotment" data-id="${
            allotment.id
          }">
            <div class="quick-search-item-title">${UI.escapeHtml(
              allotment.bookTitle
            )}</div>
            <div class="quick-search-item-subtitle">Student: ${UI.escapeHtml(
              allotment.studentName
            )}</div>
          </div>`;
        });
        html += "</div>";
      }

      html += "</div>";

      // Add "View All" link if multiple types
      const resultTypes = [
        results.books.length > 0,
        results.students.length > 0,
        results.vendors.length > 0,
        results.publications.length > 0,
        results.allotments.length > 0,
      ].filter(Boolean).length;

      if (resultTypes > 1) {
        html += `<div class="quick-search-footer">
          <button class="quick-search-view-all" data-term="${UI.escapeHtml(
            searchTerm
          )}">
            View all ${results.total} results
          </button>
        </div>`;
      }

      resultsContainer.innerHTML = html;
      resultsContainer.classList.add("show");

      // Add click handlers
      resultsContainer
        .querySelectorAll(".quick-search-item")
        .forEach((item) => {
          item.addEventListener("click", () => {
            const type = item.dataset.type;
            const id = item.dataset.id;
            this.navigateToItem(type, id);
            this.hideMobileResults();
          });
        });

      const viewAllBtn = resultsContainer.querySelector(
        ".quick-search-view-all"
      );
      if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => {
          this.navigateToSearch(searchTerm, results);
          this.hideMobileResults();
        });
      }
    },

    /**
     * Hide mobile search results
     */
    hideMobileResults() {
      const mobileOverlay = document.getElementById("mobileSearchOverlay");
      if (mobileOverlay) {
        const resultsContainer = mobileOverlay.querySelector(
          ".mobile-search-results"
        );
        if (resultsContainer) {
          resultsContainer.classList.remove("show");
        }
      }
    },

    /**
     * Display search results in a modal or dropdown
     * @param {Object} results - Search results from search()
     * @param {string} searchTerm - Original search term
     */
    displayResults(results, searchTerm) {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return;
      }

      if (results.total === 0) {
        UI.showToast(`No results found for "${searchTerm}"`, "info", 2000);
        return;
      }

      let message = `Found ${results.total} result(s) for "${searchTerm}":\n\n`;
      if (results.books.length > 0) {
        message += `📚 Books: ${results.books.length}\n`;
      }
      if (results.students.length > 0) {
        message += `👥 Students: ${results.students.length}\n`;
      }
      if (results.vendors.length > 0) {
        message += `🏪 Vendors: ${results.vendors.length}\n`;
      }
      if (results.publications.length > 0) {
        message += `📰 Publications: ${results.publications.length}\n`;
      }
      if (results.allotments.length > 0) {
        message += `📖 Allotments: ${results.allotments.length}\n`;
      }

      UI.showToast(message, "success", 3000);
    },
  };

  // Seed data on first run
  if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
      Storage.seedData();
      UI.addKeyboardShortcuts();
      UI.enhanceInputs();
      initMobileSidebar();
      initMobileSearch();
    });
  }

  // ============================================
  // Export to global scope
  // ============================================

  window.LMS = {
    Storage,
    Auth,
    Validators,
    UI,
    Table,
    CSV,
    Books,
    Students,
    Vendors,
    Publications,
    Allotments,
    Subscriptions,
    QuickSearch,
  };
})();
