/* ==========================================
   VENDORBRIDGE - CORE APPLICATION CONTROLLER
   ========================================== */

const app = {
  // --- STATE DATABASE ---
  db: {
    vendors: [],
    rfqs: [],
    quotes: [],
    approvals: [],
    invoices: [],
    logs: [],
    currentUser: null
  },

  // --- INITIALIZATION ---
  init: function() {
    this.loadState();
    this.seedMockData();
    this.bindEvents();
    this.checkSession();
  },

  // --- LOCALSTORAGE SYNC ---
  loadState: function() {
    try {
      const saved = localStorage.getItem('vendorbridge_db');
      if (saved) {
        this.db = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load database state from localStorage:", e);
    }
  },

  saveState: function() {
    try {
      localStorage.setItem('vendorbridge_db', JSON.stringify(this.db));
    } catch (e) {
      console.error("Failed to save database state to localStorage:", e);
    }
  },

  // --- SEED SECTIONS WITH HIGH-QUALITY MOCK DATA ---
  seedMockData: function() {
    // Check if seeded already
    if (this.db.vendors.length > 0) return;

    // 1. Mock Vendors
    this.db.vendors = [
      { id: "VND-001", name: "Infrasupplies Ltd", contact: "Mark Zuckerberg", email: "mark@infrasupplies.com", category: "IT Hardware", status: "Active", address: "1 Hacker Way, Menlo Park, CA", country: "United States" },
      { id: "VND-002", name: "Office Depot", contact: "Tim Cook", email: "corporate@officedepot.com", category: "Office Supplies", status: "Active", address: "555 Retail Boulevard, Miami, FL", country: "United States" },
      { id: "VND-003", name: "Apex Stationery", contact: "Elon Musk", email: "sales@apexstationery.com", category: "Office Supplies", status: "Active", address: "456 Space Way, Austin, TX", country: "United States" },
      { id: "VND-004", name: "TechCorp Logistics", contact: "Satya Nadella", email: "partner@techcorp.com", category: "Logistics", status: "Active", address: "100 Microsoft Way, Redmond, WA", country: "United States" },
      { id: "VND-005", name: "Lux Furniture Designs", contact: "Alexander Wright", email: "quote@luxfurniture.com", category: "Furniture", status: "Pending", address: "789 Design District, New York, NY", country: "United States" }
    ];

    // 2. Mock RFQs
    this.db.rfqs = [
      {
        id: "RFQ-2026-001",
        title: "Office Furniture Procurement - 2026 Q3",
        category: "Furniture",
        createdDate: "2026-06-01",
        dueDate: "2026-06-15",
        deliveryAddress: "VendorBridge Head Office, Floor 5, Suite 500",
        description: "Procurement of office tables and chairs for new developer floor. Requires ergonomic chairs and clean matching desks.",
        status: "Bidding",
        items: [
          { name: "Ergonomic Chairs", desc: "Adjustable arms, mesh back, black padding", qty: 25, unit: "Pcs" },
          { name: "Executive Desks", desc: "Solid mahogany finish, grommets for cable routing", qty: 10, unit: "Pcs" },
          { name: "Whiteboards", desc: "Magnetic whiteboards, size 4x6 feet", qty: 5, unit: "Pcs" }
        ]
      },
      {
        id: "RFQ-2026-002",
        title: "Developer Workstation Upgrade",
        category: "IT Hardware",
        createdDate: "2026-06-03",
        dueDate: "2026-06-25",
        deliveryAddress: "Server Room, Building B",
        description: "High performance laptops and monitors upgrade for engineers.",
        status: "Bidding",
        items: [
          { name: "Developer Laptops", desc: "32GB RAM, 1TB SSD, 16-inch display", qty: 15, unit: "Pcs" },
          { name: "4K UltraSharp Monitors", desc: "27-inch IPS panel, type-C connectivity", qty: 30, unit: "Pcs" }
        ]
      }
    ];

    // 3. Mock Quotations Bids
    this.db.quotes = [
      // Bids for RFQ-001
      {
        id: "QT-101",
        rfqId: "RFQ-2026-001",
        vendorId: "VND-002", // Office Depot
        deliveryTime: "4 business days",
        subtotal: 10750,
        taxRate: 8,
        taxAmount: 860,
        shipping: 150,
        grandTotal: 11760,
        notes: "Desks are in stock. Standard Net 30 applies.",
        items: [
          { name: "Ergonomic Chairs", qty: 25, unit: "Pcs", price: 230 }, // 5750
          { name: "Executive Desks", qty: 10, unit: "Pcs", price: 450 },  // 4500
          { name: "Whiteboards", qty: 5, unit: "Pcs", price: 100 }       // 500
        ]
      },
      {
        id: "QT-102",
        rfqId: "RFQ-2026-001",
        vendorId: "VND-003", // Apex Stationery
        deliveryTime: "7 business days",
        subtotal: 10400,
        taxRate: 8,
        taxAmount: 832,
        shipping: 200,
        grandTotal: 11432,
        notes: "Desks require light assembly. 2-year warranty included.",
        items: [
          { name: "Ergonomic Chairs", qty: 25, unit: "Pcs", price: 200 }, // 5000
          { name: "Executive Desks", qty: 10, unit: "Pcs", price: 480 },  // 4800
          { name: "Whiteboards", qty: 5, unit: "Pcs", price: 120 }       // 600
        ]
      }
    ];

    // 4. Mock Logs
    this.db.logs = [
      { timestamp: "2026-06-01 09:15:32", module: "AUTH", level: "INFO", user: "system", message: "VendorBridge portal started." },
      { timestamp: "2026-06-01 10:30:10", module: "VENDORS", level: "INFO", user: "admin@vendorbridge.com", message: "Registered vendor Infrasupplies Ltd (VND-001)." },
      { timestamp: "2026-06-01 10:35:45", module: "VENDORS", level: "INFO", user: "admin@vendorbridge.com", message: "Registered vendor Office Depot (VND-002)." },
      { timestamp: "2026-06-01 10:40:22", module: "VENDORS", level: "INFO", user: "admin@vendorbridge.com", message: "Registered vendor Apex Stationery (VND-003)." },
      { timestamp: "2026-06-01 14:00:00", module: "RFQS", level: "INFO", user: "admin@vendorbridge.com", message: "Published new RFQ: Office Furniture Procurement - 2026 Q3 (RFQ-2026-001)." },
      { timestamp: "2026-06-02 11:15:04", module: "QUOTES", level: "INFO", user: "corporate@officedepot.com", message: "Quotation QT-101 submitted for RFQ-2026-001 by Office Depot." },
      { timestamp: "2026-06-02 15:42:30", module: "QUOTES", level: "INFO", user: "sales@apexstationery.com", message: "Quotation QT-102 submitted for RFQ-2026-001 by Apex Stationery." }
    ];

    // 5. Preloaded Invoice (Already Approved from previous month to show charts)
    this.db.invoices = [
      {
        poId: "PO-2026-501",
        rfqId: "RFQ-2026-500",
        date: "2026-05-12",
        vendorId: "VND-001",
        vendorName: "Infrasupplies Ltd",
        vendorEmail: "mark@infrasupplies.com",
        vendorAddress: "1 Hacker Way, Menlo Park, CA",
        vendorCountry: "United States",
        subtotal: 12500,
        taxRate: 5,
        taxAmount: 625,
        shipping: 250,
        grandTotal: 13375,
        notes: "IT Dev Server Rack supplies. Terms Net 30.",
        status: "Paid",
        items: [
          { name: "Server Cabinets 42U", qty: 2, price: 1500, unit: "Pcs" },
          { name: "Gigabit Switch 48-port", qty: 5, price: 1200, unit: "Pcs" },
          { name: "Cat6 Ethernet Spool (1000ft)", qty: 7, price: 500, unit: "Boxes" }
        ]
      }
    ];

    this.saveState();
  },

  // --- NAVIGATION AND VIEW SWITCHER ---
  switchView: function(viewId, isSubViewToggle) {
    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active-view');
    });

    // Show target view
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active-view');
    }

    // Update Sidebar navigation selection
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      }
    });

    // Update Header title
    const headerTitle = document.getElementById('current-view-title');
    if (headerTitle) {
      const cleanTitle = viewId.replace('-', ' ').toUpperCase();
      headerTitle.textContent = cleanTitle.charAt(0) + cleanTitle.slice(1).toLowerCase();
    }

    // Call view-specific loaders
    if (viewId === 'dashboard') this.loadDashboardView();
    if (viewId === 'vendors') this.loadVendorsView();
    if (viewId === 'rfqs') this.loadRFQsView();
    if (viewId === 'quotations') this.loadQuotationsView();
    if (viewId === 'comparison') this.loadComparisonView();
    if (viewId === 'approvals') this.loadApprovalsView();
    if (viewId === 'invoices') this.loadInvoicesView();
    if (viewId === 'analytics') this.loadAnalyticsView();
    if (viewId === 'logs') this.loadLogsView();

    // Reset subview lists if clicking standard tabs
    if (!isSubViewToggle) {
      if (viewId === 'rfqs') {
        this.toggleRFQSubView('list');
      }
    }
  },

  // --- EVENT BINDING HOOKS ---
  bindEvents: function() {
    const self = this;

    // 1. Sidebar Nav click handles
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const view = this.getAttribute('data-view');
        self.switchView(view);
      });
    });

    // 2. Auth Flow Screen Switching
    document.getElementById('btn-go-register').addEventListener('click', () => {
      document.getElementById('screen-login').classList.remove('active-card');
      document.getElementById('screen-register').classList.add('active-card');
    });

    document.getElementById('btn-go-login').addEventListener('click', () => {
      document.getElementById('screen-register').classList.remove('active-card');
      document.getElementById('screen-login').classList.add('active-card');
    });

    // 3. Auth Form Submissions
    document.getElementById('form-login').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      
      if (email && pass) {
        self.db.currentUser = { email: email, name: email.split('@')[0], role: "Purchasing Manager" };
        self.appendLog("AUTH", "INFO", `User ${email} signed in successfully.`);
        self.saveState();
        self.checkSession();
      }
    });

    document.getElementById('form-register').addEventListener('submit', function(e) {
      e.preventDefault();
      const company = document.getElementById('reg-company').value;
      const email = document.getElementById('reg-email').value;
      
      const newVndId = "VND-00" + (self.db.vendors.length + 1);
      const newVnd = {
        id: newVndId,
        name: company,
        contact: document.getElementById('reg-first-name').value + ' ' + document.getElementById('reg-last-name').value,
        email: email,
        category: "Office Supplies",
        status: "Pending",
        address: document.getElementById('reg-address').value,
        country: document.getElementById('reg-country').value,
        info: document.getElementById('reg-info').value
      };

      self.db.vendors.push(newVnd);
      self.appendLog("VENDORS", "INFO", `Vendor registered from public portal: ${company} (${newVndId})`);
      self.saveState();
      alert(`Registration Successful! Under review. Vendor ID: ${newVndId}`);
      
      document.getElementById('form-register').reset();
      document.getElementById('screen-register').classList.remove('active-card');
      document.getElementById('screen-login').classList.add('active-card');
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
      self.appendLog("AUTH", "INFO", `User signed out.`);
      self.db.currentUser = null;
      self.saveState();
      self.checkSession();
    });

    // 4. Modals handlers
    document.getElementById('btn-add-vendor-modal').addEventListener('click', () => {
      document.getElementById('modal-add-vendor').classList.add('active-modal');
    });

    const closeModal = () => {
      document.getElementById('modal-add-vendor').classList.remove('active-modal');
      document.getElementById('form-add-vendor').reset();
    };
    document.getElementById('btn-close-vendor-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-vendor-modal').addEventListener('click', closeModal);

    document.getElementById('form-add-vendor').addEventListener('submit', function(e) {
      e.preventDefault();
      const newVndId = "VND-0" + (self.db.vendors.length + 1);
      const newV = {
        id: newVndId,
        name: document.getElementById('vendor-name').value,
        contact: document.getElementById('vendor-contact').value,
        email: document.getElementById('vendor-email').value,
        category: document.getElementById('vendor-category').value,
        status: document.getElementById('vendor-status').value,
        address: document.getElementById('vendor-address').value,
        country: document.getElementById('vendor-country').value
      };
      
      self.db.vendors.push(newV);
      self.appendLog("VENDORS", "INFO", `Admin added vendor profile: ${newV.name} (${newVndId}).`);
      self.saveState();
      closeModal();
      self.loadVendorsView();
    });

    // 5. Vendor search/filters
    document.getElementById('vendors-search').addEventListener('input', () => self.loadVendorsView());
    document.getElementById('vendors-filter-category').addEventListener('change', () => self.loadVendorsView());
    document.getElementById('vendors-filter-status').addEventListener('change', () => self.loadVendorsView());

    // 6. Sub-tabs switching (RFQs tab)
    document.getElementById('tab-rfq-list').addEventListener('click', () => self.toggleRFQSubView('list'));
    document.getElementById('tab-rfq-create').addEventListener('click', () => self.toggleRFQSubView('create'));

    // 7. RFQ Wizard - next/prev buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', function() {
        const nextStep = parseInt(this.getAttribute('data-next'));
        if (nextStep === 2) {
          // Validate step 1
          const title = document.getElementById('rfq-title').value;
          if (!title) { alert("Please provide an RFQ title"); return; }
        }
        if (nextStep === 3) {
          // Validate step 2
          const rows = document.querySelectorAll('#rfq-items-body tr');
          if (rows.length === 0) { alert("Please add at least one line item."); return; }
          self.populateRFQPreview();
        }
        self.navigateWizardStep(nextStep);
      });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
      btn.addEventListener('click', function() {
        const prevStep = parseInt(this.getAttribute('data-prev'));
        self.navigateWizardStep(prevStep);
      });
    });

    // Add row to wizard items
    document.getElementById('btn-rfq-add-item').addEventListener('click', () => {
      const body = document.getElementById('rfq-items-body');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="text" class="item-name-input" required placeholder="e.g. Ergonomic Office Chair"></td>
        <td><input type="text" class="item-desc-input" placeholder="e.g. High back adjustable spacer"></td>
        <td><input type="number" class="item-qty-input" required min="1" value="1"></td>
        <td>
          <select class="item-unit-input">
            <option value="Pcs">Pcs</option>
            <option value="Sets">Sets</option>
            <option value="Boxes">Boxes</option>
            <option value="Lots">Lots</option>
          </select>
        </td>
        <td class="text-center"><button type="button" class="btn-delete-item text-danger"><i class="fa-regular fa-trash-can"></i></button></td>
      `;
      body.appendChild(tr);
      // bind delete
      tr.querySelector('.btn-delete-item').addEventListener('click', function() {
        tr.remove();
      });
    });

    // Bind initial delete button in table wizard
    document.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', function() {
        this.closest('tr').remove();
      });
    });

    // Submit RFQ Wizard
    document.getElementById('form-rfq-wizard').addEventListener('submit', function(e) {
      e.preventDefault();
      const rfqId = "RFQ-2026-0" + (self.db.rfqs.length + 1);
      
      const items = [];
      document.querySelectorAll('#rfq-items-body tr').forEach(row => {
        items.push({
          name: row.querySelector('.item-name-input').value,
          desc: row.querySelector('.item-desc-input').value,
          qty: parseInt(row.querySelector('.item-qty-input').value),
          unit: row.querySelector('.item-unit-input').value
        });
      });

      const newRfq = {
        id: rfqId,
        title: document.getElementById('rfq-title').value,
        category: document.getElementById('rfq-category').value,
        createdDate: new Date().toISOString().split('T')[0],
        dueDate: document.getElementById('rfq-due-date').value || new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
        deliveryAddress: document.getElementById('rfq-delivery-address').value,
        description: document.getElementById('rfq-description').value,
        status: "Bidding",
        items: items
      };

      self.db.rfqs.push(newRfq);
      self.appendLog("RFQS", "INFO", `Published RFQ: ${newRfq.title} (${rfqId}) with ${items.length} lines.`);
      self.saveState();
      
      alert(`RFQ Published Successfully! Code: ${rfqId}`);
      document.getElementById('form-rfq-wizard').reset();
      self.navigateWizardStep(1);
      self.switchView('rfqs');
    });

    // Real-time pricing calculations on quote submit
    document.getElementById('quote-tax-rate').addEventListener('input', () => self.calcQuoteSummary());
    document.getElementById('quote-shipping').addEventListener('input', () => self.calcQuoteSummary());

    // Submit Quote Form
    document.getElementById('form-submit-quote').addEventListener('submit', function(e) {
      e.preventDefault();
      const rfqId = document.getElementById('quote-rfq-id-val').value;
      const quoteId = "QT-" + (self.db.quotes.length + 101);
      
      const items = [];
      document.querySelectorAll('.quote-item-price-input').forEach(input => {
        items.push({
          name: input.getAttribute('data-name'),
          qty: parseInt(input.getAttribute('data-qty')),
          unit: input.getAttribute('data-unit'),
          price: parseFloat(input.value) || 0
        });
      });

      const taxRate = parseFloat(document.getElementById('quote-tax-rate').value) || 0;
      const shipping = parseFloat(document.getElementById('quote-shipping').value) || 0;
      const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      const taxAmount = (subtotal * taxRate) / 100;
      const grandTotal = subtotal + taxAmount + shipping;

      const newQuote = {
        id: quoteId,
        rfqId: rfqId,
        vendorId: document.getElementById('quote-vendor-select').value,
        deliveryTime: document.getElementById('quote-delivery-time').value,
        subtotal: subtotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        shipping: shipping,
        grandTotal: grandTotal,
        notes: document.getElementById('quote-notes').value,
        items: items
      };

      self.db.quotes.push(newQuote);
      const vendor = self.db.vendors.find(v => v.id === newQuote.vendorId);
      self.appendLog("QUOTES", "INFO", `Bid QT-${newQuote.id} submitted for ${rfqId} by ${vendor ? vendor.name : 'Unknown'}`);
      self.saveState();
      
      alert("Your quotation bid proposal has been submitted successfully!");
      document.getElementById('form-submit-quote').reset();
      document.getElementById('quote-form-wrapper').style.display = 'none';
      document.getElementById('quote-no-selection').style.display = 'flex';
      self.switchView('comparison'); // direct redirect to compare
    });

    // Comparison select change
    document.getElementById('compare-rfq-selector').addEventListener('change', function() {
      self.loadComparisonMatrix(this.value);
    });

    // Log searches & filter buttons
    document.getElementById('logs-search').addEventListener('input', () => self.loadLogsView());
    
    document.querySelectorAll('#log-level-filter-buttons .btn-filter').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#log-level-filter-buttons .btn-filter').forEach(b => b.classList.remove('active-filter'));
        this.classList.add('active-filter');
        self.loadLogsView();
      });
    });

    // Document exporters hooks
    document.getElementById('btn-export-print').addEventListener('click', () => {
      utils.exportInvoiceAsPDF();
    });
    
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
      utils.exportInvoiceAsPDF();
    });

    document.getElementById('btn-export-png').addEventListener('click', () => {
      const activePO = self.db.invoices.find(inv => inv.poId === document.getElementById('inv-sheet-number').textContent);
      if (activePO) {
        utils.exportInvoiceAsImage(activePO);
      }
    });

    // Notifications Menu Toggle
    document.getElementById('btn-notifications').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('notifications-menu').classList.toggle('active-dropdown');
    });

    document.addEventListener('click', () => {
      document.getElementById('notifications-menu').classList.remove('active-dropdown');
    });

    document.getElementById('btn-clear-notifications').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('notification-list-items').innerHTML = '<li class="notification-empty">No new notifications</li>';
      document.getElementById('noti-dot').style.display = 'none';
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      const icon = document.querySelector('#btn-theme-toggle i');
      if (newTheme === 'dark') {
        icon.className = 'fa-solid fa-moon';
      } else {
        icon.className = 'fa-solid fa-sun';
      }
      
      // Re-render charts to pick up the CSS variable color schemes!
      if (self.db.currentUser) {
        const activeTab = document.querySelector('.menu-item.active').getAttribute('data-view');
        if (activeTab === 'dashboard') self.loadDashboardView();
        if (activeTab === 'analytics') self.loadAnalyticsView();
      }
    });

    // Bind log export CSV button
    document.getElementById('btn-logs-export-csv').addEventListener('click', () => {
      self.exportLogsCSV();
    });

    // Bind dashboard panel tabs for chart switches
    document.querySelectorAll('[data-chart]').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-chart]').forEach(b => b.classList.remove('active-btn-tab'));
        this.classList.add('active-btn-tab');
        const type = this.getAttribute('data-chart');
        self.renderDashboardChart(type);
      });
    });

    // Mobile sidebar toggle click hook
    document.getElementById('btn-sidebar-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelector('.sidebar').classList.toggle('active-sidebar');
    });

    document.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.remove('active-sidebar');
    });
  },

  // --- CHECK LOGIN SESSION ---
  checkSession: function() {
    if (this.db.currentUser) {
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('app-container').style.display = 'flex';
      
      // Update header details
      document.getElementById('header-username').textContent = this.db.currentUser.name;
      document.getElementById('greeting-username').textContent = this.db.currentUser.name;
      document.getElementById('header-userrole').textContent = this.db.currentUser.role;
      
      // Initials avatar
      const initials = this.db.currentUser.name.substring(0, 2).toUpperCase();
      document.getElementById('user-avatar-initials').textContent = initials;
      
      this.switchView('dashboard');
    } else {
      document.getElementById('app-container').style.display = 'none';
      document.getElementById('auth-container').style.display = 'flex';
      document.getElementById('screen-login').classList.add('active-card');
      document.getElementById('screen-register').classList.remove('active-card');
    }
  },

  // --- LOGGING HELPER ---
  appendLog: function(module, level, message) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.db.logs.unshift({
      timestamp: timestamp,
      module: module,
      level: level,
      user: this.db.currentUser ? this.db.currentUser.email : 'system',
      message: message
    });
    this.saveState();
    this.updateNotificationIndicator(message);
  },

  updateNotificationIndicator: function(message) {
    const list = document.getElementById('notification-list-items');
    const dot = document.getElementById('noti-dot');
    
    // remove empty placeholder
    const empty = list.querySelector('.notification-empty');
    if (empty) empty.remove();
    
    // prepend notification
    const li = document.createElement('li');
    li.innerHTML = `<strong>System Alert</strong>: ${message}`;
    list.insertBefore(li, list.firstChild);
    
    // cap at 5
    if (list.children.length > 5) {
      list.lastChild.remove();
    }
    
    dot.style.display = 'block';
  },

  // ================= VIEW DATA LOADERS =================

  // --- 1. DASHBOARD view loader ---
  loadDashboardView: function() {
    // 1. Metric Counter Updates
    document.getElementById('dash-vendors-count').textContent = this.db.vendors.length;
    document.getElementById('dash-rfqs-count').textContent = this.db.rfqs.filter(r => r.status === 'Bidding').length;
    document.getElementById('dash-invoices-count').textContent = this.db.invoices.length;
    
    // Calc total spend
    const totalSpend = this.db.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    document.getElementById('dash-spend').textContent = utils.formatCurrency(totalSpend);

    // 2. Render Activity Feed
    const feed = document.getElementById('dash-activities-list');
    feed.innerHTML = '';
    
    // Take top 5 logs
    const recentLogs = this.db.logs.slice(0, 5);
    recentLogs.forEach(log => {
      const li = document.createElement('li');
      li.className = `activity-timeline-item activity-item ${log.level.toLowerCase()}`;
      li.innerHTML = `
        <span class="activity-dot"></span>
        <div class="activity-text"><strong>[${log.module}]</strong> ${log.message}</div>
        <span class="activity-time">${log.timestamp}</span>
      `;
      feed.appendChild(li);
    });

    // 3. Render Dashboard Chart
    const activeChartBtn = document.querySelector('[data-chart].active-btn-tab');
    const chartType = activeChartBtn ? activeChartBtn.getAttribute('data-chart') : 'spend';
    this.renderDashboardChart(chartType);
  },

  renderDashboardChart: function(type) {
    if (type === 'spend') {
      // aggregate spend per month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      // Seed values with invoice records + default values for dashboard view
      const spendData = [12000, 18500, 9500, 22000, 13375, 0];
      
      // Calculate real spend for Jun
      const junSpend = this.db.invoices
        .filter(inv => inv.date.includes('-06-'))
        .reduce((sum, inv) => sum + inv.grandTotal, 0);
      spendData[5] = junSpend;

      utils.renderLineChart('dash-svg-chart', spendData, months);
    } else {
      // spend by categories
      const categories = [
        { label: "Furniture", value: 0 },
        { label: "IT Hardware", value: 0 },
        { label: "Office Supplies", value: 0 },
        { label: "Facilities", value: 0 },
        { label: "Logistics", value: 0 }
      ];
      
      this.db.invoices.forEach(inv => {
        // match category from rfq
        const rfq = this.db.rfqs.find(r => r.id === inv.rfqId);
        const catName = rfq ? rfq.category : "Office Supplies";
        const catObj = categories.find(c => c.label === catName);
        if (catObj) catObj.value += inv.grandTotal;
      });

      // Provide default fallback value if 0 total
      if (categories.reduce((s,c)=>s+c.value, 0) === 0) {
        categories[0].value = 5000;
        categories[1].value = 12500;
        categories[2].value = 2500;
      }

      utils.renderDonutChart('dash-svg-chart', categories);
    }
  },

  // --- 2. VENDORS view loader ---
  loadVendorsView: function() {
    const tableBody = document.getElementById('vendors-table-body');
    tableBody.innerHTML = '';

    const query = document.getElementById('vendors-search').value.toLowerCase();
    const filterCat = document.getElementById('vendors-filter-category').value;
    const filterStatus = document.getElementById('vendors-filter-status').value;

    const filtered = this.db.vendors.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(query) || 
                          v.contact.toLowerCase().includes(query) || 
                          v.email.toLowerCase().includes(query);
      const matchCat = filterCat === 'all' || v.category === filterCat;
      const matchStatus = filterStatus === 'all' || v.status === filterStatus;
      
      return matchSearch && matchCat && matchStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No vendors matching criteria found.</td></tr>`;
      return;
    }

    filtered.forEach(v => {
      const tr = document.createElement('tr');
      const badgeClass = v.status === 'Active' ? 'badge-success' : (v.status === 'Pending' ? 'badge-warning' : 'badge-error');
      
      tr.innerHTML = `
        <td><strong>${v.id}</strong></td>
        <td>${v.name}</td>
        <td>${v.contact}</td>
        <td>${v.email}</td>
        <td>${v.category}</td>
        <td><span class="badge ${badgeClass}">${v.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-small" onclick="alert('Viewing profile details for ${v.name}:\\nAddress: ${v.address}\\nCountry: ${v.country}')">
            <i class="fa-regular fa-eye"></i> Details
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  },

  // --- 3. RFQS view loader ---
  loadRFQsView: function() {
    const listBody = document.getElementById('rfq-table-body');
    listBody.innerHTML = '';

    if (this.db.rfqs.length === 0) {
      listBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No RFQs created yet.</td></tr>`;
      return;
    }

    this.db.rfqs.forEach(r => {
      const bidsCount = this.db.quotes.filter(q => q.rfqId === r.id).length;
      const statusBadge = r.status === 'Bidding' ? 'badge-info' : 'badge-success';
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td><strong>${r.id}</strong></td>
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td>${r.createdDate}</td>
        <td>${r.dueDate}</td>
        <td><span class="badge ${statusBadge}">${r.status}</span></td>
        <td>${r.items.length}</td>
        <td><span class="badge badge-purple">${bidsCount} Bids</span></td>
        <td>
          <button class="btn btn-primary btn-small" onclick="app.openBiddingScreen('${r.id}')" ${r.status !== 'Bidding' ? 'disabled' : ''}>
            <i class="fa-solid fa-gavel"></i> Bid
          </button>
        </td>
      `;
      listBody.appendChild(tr);
    });
  },

  toggleRFQSubView: function(subViewName) {
    document.querySelectorAll('#view-rfqs .subview').forEach(sv => sv.classList.remove('active-subview'));
    document.querySelectorAll('#view-rfqs .tab-sub-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`subview-rfq-${subViewName}`).classList.add('active-subview');
    document.getElementById(`tab-rfq-${subViewName}`).classList.add('active');
    
    if (subViewName === 'list') this.loadRFQsView();
  },

  navigateWizardStep: function(stepNum) {
    document.querySelectorAll('.wizard-step-panel').forEach(p => p.classList.remove('active-step-panel'));
    document.querySelectorAll('.wizard-stepper .step').forEach((s, idx) => {
      s.classList.remove('active-step', 'completed-step');
      if (idx + 1 === stepNum) {
        s.classList.add('active-step');
      } else if (idx + 1 < stepNum) {
        s.classList.add('completed-step');
      }
    });

    document.getElementById(`step-panel-${stepNum}`).classList.add('active-step-panel');
  },

  populateRFQPreview: function() {
    document.getElementById('preview-rfq-title').textContent = document.getElementById('rfq-title').value;
    document.getElementById('preview-rfq-category').textContent = document.getElementById('rfq-category').value;
    document.getElementById('preview-rfq-due').textContent = document.getElementById('rfq-due-date').value || "None specified";
    document.getElementById('preview-rfq-address').textContent = document.getElementById('rfq-delivery-address').value || "Default depot";
    document.getElementById('preview-rfq-desc').textContent = document.getElementById('rfq-description').value || "No detailed specs";

    const previewBody = document.getElementById('preview-rfq-items-body');
    previewBody.innerHTML = '';
    
    document.querySelectorAll('#rfq-items-body tr').forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.querySelector('.item-name-input').value}</td>
        <td>${row.querySelector('.item-desc-input').value || '-'}</td>
        <td>${row.querySelector('.item-qty-input').value}</td>
        <td>${row.querySelector('.item-unit-input').value}</td>
      `;
      previewBody.appendChild(tr);
    });
  },

  // --- 4. SUBMIT QUOTATIONS view loader ---
  loadQuotationsView: function() {
    const list = document.getElementById('quote-rfq-list');
    list.innerHTML = '';

    const biddingRFQs = this.db.rfqs.filter(r => r.status === 'Bidding');

    if (biddingRFQs.length === 0) {
      list.innerHTML = `<li><span class="text-muted">No active RFQs available for bidding.</span></li>`;
      return;
    }

    biddingRFQs.forEach(r => {
      const li = document.createElement('li');
      li.setAttribute('data-id', r.id);
      li.innerHTML = `
        <strong>${r.title}</strong>
        <span>Category: ${r.category} | ID: ${r.id}</span>
      `;
      
      li.addEventListener('click', () => {
        list.querySelectorAll('li').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        this.loadQuotationSubmissionForm(r.id);
      });
      list.appendChild(li);
    });
  },

  openBiddingScreen: function(rfqId) {
    this.switchView('quotations');
    // select that rfq in list
    setTimeout(() => {
      const item = document.querySelector(`#quote-rfq-list li[data-id="${rfqId}"]`);
      if (item) item.click();
    }, 100);
  },

  loadQuotationSubmissionForm: function(rfqId) {
    const rfq = this.db.rfqs.find(r => r.id === rfqId);
    if (!rfq) return;

    document.getElementById('quote-no-selection').style.display = 'none';
    document.getElementById('quote-form-wrapper').style.display = 'block';

    document.getElementById('quote-rfq-id-val').value = rfq.id;
    document.getElementById('quote-rfq-title-header').textContent = `Submit Quotation: ${rfq.title}`;
    document.getElementById('quote-rfq-category-tag').textContent = rfq.category;
    document.getElementById('quote-rfq-due-tag').textContent = rfq.dueDate;

    // Load active vendors in selector dropdown
    const select = document.getElementById('quote-vendor-select');
    select.innerHTML = '';
    this.db.vendors.filter(v => v.status === 'Active').forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.name} (${v.category})`;
      select.appendChild(opt);
    });

    // Populate rows
    const rowsBody = document.getElementById('quote-items-input-rows');
    rowsBody.innerHTML = '';

    rfq.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${item.name}</strong>
          <span class="d-block text-muted text-small">${item.desc || 'No specifications'}</span>
        </td>
        <td>${item.qty} ${item.unit}</td>
        <td>
          <input type="number" class="quote-item-price-input" 
                 data-qty="${item.qty}" data-name="${item.name}" data-unit="${item.unit}" 
                 min="0.01" step="0.01" required placeholder="0.00" value="${(100 + index*30)}">
        </td>
        <td>
          <strong class="row-total-display">$0.00</strong>
        </td>
      `;
      rowsBody.appendChild(tr);

      // calc totals in real time on keyup
      const input = tr.querySelector('.quote-item-price-input');
      input.addEventListener('input', () => {
        const total = (parseFloat(input.value) || 0) * item.qty;
        tr.querySelector('.row-total-display').textContent = `$${total.toFixed(2)}`;
        this.calcQuoteSummary();
      });
      // fire initial
      input.dispatchEvent(new Event('input'));
    });
  },

  calcQuoteSummary: function() {
    let subtotal = 0;
    document.querySelectorAll('.quote-item-price-input').forEach(input => {
      const qty = parseInt(input.getAttribute('data-qty'));
      const price = parseFloat(input.value) || 0;
      subtotal += qty * price;
    });

    const taxRate = parseFloat(document.getElementById('quote-tax-rate').value) || 0;
    const shipping = parseFloat(document.getElementById('quote-shipping').value) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount + shipping;

    document.getElementById('quote-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('quote-tax-amount').textContent = `$${taxAmount.toFixed(2)}`;
    document.getElementById('quote-shipping-amount').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('quote-grand-total').textContent = `$${grandTotal.toFixed(2)}`;
  },

  // --- 5. COMPARISON MATRIX view loader ---
  loadComparisonView: function() {
    const select = document.getElementById('compare-rfq-selector');
    select.innerHTML = '<option value="">-- Select RFQ --</option>';

    this.db.rfqs.forEach(rfq => {
      const opt = document.createElement('option');
      opt.value = rfq.id;
      opt.textContent = `${rfq.id} - ${rfq.title}`;
      select.appendChild(opt);
    });

    document.getElementById('compare-matrix-wrapper').style.display = 'none';
    document.getElementById('compare-no-quotes-state').style.display = 'none';
    document.getElementById('compare-empty-state').style.display = 'flex';
  },

  loadComparisonMatrix: function(rfqId) {
    if (!rfqId) {
      this.loadComparisonView();
      return;
    }

    const rfq = this.db.rfqs.find(r => r.id === rfqId);
    const quotes = this.db.quotes.filter(q => q.rfqId === rfqId);

    document.getElementById('compare-empty-state').style.display = 'none';
    
    if (quotes.length === 0) {
      document.getElementById('compare-no-quotes-state').style.display = 'flex';
      document.getElementById('compare-matrix-wrapper').style.display = 'none';
      return;
    }

    document.getElementById('compare-no-quotes-state').style.display = 'none';
    document.getElementById('compare-matrix-wrapper').style.display = 'block';

    // Highlight metrics calculations
    let lowestQuote = quotes[0];
    let fastestQuote = quotes[0];
    
    quotes.forEach(q => {
      if (q.grandTotal < lowestQuote.grandTotal) lowestQuote = q;
      // Simple parse delivery day speed
      const qDays = parseInt(q.deliveryTime) || 10;
      const fDays = parseInt(fastestQuote.deliveryTime) || 10;
      if (qDays < fDays) fastestQuote = q;
    });

    const bestVendor = this.db.vendors.find(v => v.id === lowestQuote.vendorId);
    const fastVendor = this.db.vendors.find(v => v.id === fastestQuote.vendorId);

    document.getElementById('comp-best-vendor').textContent = bestVendor ? bestVendor.name : 'Unknown';
    document.getElementById('comp-best-price').textContent = `$${lowestQuote.grandTotal.toFixed(2)}`;
    document.getElementById('comp-fastest-vendor').textContent = fastVendor ? fastVendor.name : 'Unknown';
    document.getElementById('comp-fastest-time').textContent = fastestQuote.deliveryTime;
    document.getElementById('comp-total-bids').textContent = quotes.length;

    // Render Matrix Grid
    const matrix = document.getElementById('comparison-matrix-table');
    matrix.innerHTML = '';

    // Build Header row
    const headerTr = document.createElement('tr');
    headerTr.innerHTML = `<th>Line Item Specification</th>`;
    quotes.forEach(q => {
      const vendorName = this.db.vendors.find(v => v.id === q.vendorId)?.name || 'Vendor';
      headerTr.innerHTML += `<th class="text-center">${vendorName}<br><span class="text-muted text-small">[Bid ID: ${q.id}]</span></th>`;
    });
    matrix.appendChild(headerTr);

    // Build item-by-item price rows
    rfq.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><strong>${item.name}</strong><br><span class="text-muted text-small">${item.desc || ''} (Qty: ${item.qty} ${item.unit})</span></td>`;
      
      // Find lowest unit price for this item across bids
      let minUnitPrice = Infinity;
      quotes.forEach(q => {
        const itemBid = q.items.find(i => i.name === item.name);
        if (itemBid && itemBid.price < minUnitPrice) minUnitPrice = itemBid.price;
      });

      quotes.forEach(q => {
        const itemBid = q.items.find(i => i.name === item.name);
        const bidPrice = itemBid ? itemBid.price : 0;
        const totalLinePrice = bidPrice * item.qty;
        
        // Highlight cell green if it is the lowest price
        const isBest = bidPrice === minUnitPrice && minUnitPrice !== Infinity;
        const cellClass = isBest ? 'best-value-cell text-center' : 'text-center';
        
        tr.innerHTML += `<td class="${cellClass}">$${bidPrice.toFixed(2)}/u<br><span class="text-muted text-small">Total: $${totalLinePrice.toFixed(2)}</span></td>`;
      });
      matrix.appendChild(tr);
    });

    // Subtotal Row
    const subtotalTr = document.createElement('tr');
    subtotalTr.innerHTML = `<td><strong>Items Subtotal</strong></td>`;
    quotes.forEach(q => {
      subtotalTr.innerHTML += `<td class="text-center">$${q.subtotal.toFixed(2)}</td>`;
    });
    matrix.appendChild(subtotalTr);

    // Shipping Row
    const shipTr = document.createElement('tr');
    shipTr.innerHTML = `<td><strong>Shipping & Handling</strong></td>`;
    quotes.forEach(q => {
      shipTr.innerHTML += `<td class="text-center">$${q.shipping.toFixed(2)}</td>`;
    });
    matrix.appendChild(shipTr);

    // Grand Total Row
    const totalTr = document.createElement('tr');
    totalTr.className = 'total-row';
    totalTr.innerHTML = `<td><strong>Grand Total</strong></td>`;
    quotes.forEach(q => {
      const isLowestTotal = q.id === lowestQuote.id;
      const cellClass = isLowestTotal ? 'best-value-cell text-center text-success' : 'text-center';
      totalTr.innerHTML += `<td class="${cellClass}">$${q.grandTotal.toFixed(2)}</td>`;
    });
    matrix.appendChild(totalTr);

    // Actions Row
    const actionTr = document.createElement('tr');
    actionTr.innerHTML = `<td><strong>Route Quotation Selection</strong></td>`;
    quotes.forEach(q => {
      actionTr.innerHTML += `
        <td class="text-center">
          <button class="btn btn-success btn-small" onclick="app.routeToApproval('${q.id}')">
            Select & Approve <i class="fa-solid fa-circle-chevron-right"></i>
          </button>
        </td>
      `;
    });
    matrix.appendChild(actionTr);
  },

  routeToApproval: function(quoteId) {
    const quote = this.db.quotes.find(q => q.id === quoteId);
    if (!quote) return;

    // Check if approval record exists already
    let approval = this.db.approvals.find(a => a.quoteId === quoteId);
    
    if (!approval) {
      const rfq = this.db.rfqs.find(r => r.id === quote.rfqId);
      const vendor = this.db.vendors.find(v => v.id === quote.vendorId);
      
      approval = {
        id: "APRV-0" + (this.db.approvals.length + 101),
        rfqId: quote.rfqId,
        rfqTitle: rfq ? rfq.title : 'RFQ Item',
        quoteId: quoteId,
        vendorId: quote.vendorId,
        vendorName: vendor ? vendor.name : 'Unknown',
        amount: quote.grandTotal,
        currentStep: 1, // Step 1: Manager, 2: Finance, 3: VP
        status: "Pending Manager Approval",
        comments: [
          { user: "system", comment: "Selection routed to approval workflow.", timestamp: new Date().toISOString().replace('T',' ').substring(0, 19) }
        ]
      };
      
      // Update RFQ status
      if (rfq) rfq.status = "Under Review";
      
      this.db.approvals.push(approval);
      this.appendLog("APPROVALS", "INFO", `Routed quote proposal ${quoteId} for RFQ ${quote.rfqId} to approval workflow.`);
      this.saveState();
    }

    this.switchView('approvals');
    // auto-click selection
    setTimeout(() => {
      const el = document.querySelector(`.approval-rfq-list li[data-id="${approval.id}"]`);
      if (el) el.click();
    }, 100);
  },

  // --- 6. APPROVALS view loader ---
  loadApprovalsView: function() {
    const list = document.getElementById('approval-rfq-list-items');
    list.innerHTML = '';

    if (this.db.approvals.length === 0) {
      list.innerHTML = `<li><span class="text-muted">No items in the approval queue.</span></li>`;
      return;
    }

    this.db.approvals.forEach(a => {
      const li = document.createElement('li');
      li.setAttribute('data-id', a.id);
      li.innerHTML = `
        <strong>${a.rfqTitle}</strong>
        <span>Quote ID: ${a.quoteId} | Vendor: ${a.vendorName}</span>
        <span class="d-block text-warning text-small">Status: ${a.status}</span>
      `;
      
      li.addEventListener('click', () => {
        list.querySelectorAll('li').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        this.loadApprovalDetails(a.id);
      });
      list.appendChild(li);
    });

    document.getElementById('approval-details-wrapper').style.display = 'none';
    document.getElementById('approval-no-selection').style.display = 'flex';
  },

  loadApprovalDetails: function(approvalId) {
    const apprv = this.db.approvals.find(a => a.id === approvalId);
    if (!apprv) return;

    const quote = this.db.quotes.find(q => q.id === apprv.quoteId);
    if (!quote) return;

    document.getElementById('approval-no-selection').style.display = 'none';
    document.getElementById('approval-details-wrapper').style.display = 'block';

    document.getElementById('approval-title-header').textContent = apprv.rfqTitle;
    document.getElementById('approval-status-badge').textContent = apprv.status;
    document.getElementById('approval-selected-supplier').textContent = apprv.vendorName;
    document.getElementById('approval-bid-total').textContent = `$${apprv.amount.toFixed(2)}`;

    // Set header metadata
    document.getElementById('approval-rfq-ref').textContent = apprv.rfqId;
    document.getElementById('approval-pay-terms').textContent = quote.notes ? quote.notes.substring(0, 15) : "Net 30";
    document.getElementById('approval-deliv-est').textContent = quote.deliveryTime;

    // Stepper visual node updates
    const steps = [
      { node: 'wf-step-1', status: 'wf-status-1', title: 'Manager' },
      { node: 'wf-step-2', status: 'wf-status-2', title: 'Finance' },
      { node: 'wf-step-3', status: 'wf-status-3', title: 'VP Signature' }
    ];

    steps.forEach((s, idx) => {
      const stepNum = idx + 1;
      const el = document.getElementById(s.node);
      const statEl = document.getElementById(s.status);
      
      el.className = 'wf-step'; // reset
      
      if (apprv.currentStep === stepNum) {
        el.classList.add('active-wf');
        statEl.textContent = 'Awaiting Review';
      } else if (apprv.currentStep > stepNum) {
        el.classList.add('approved-wf');
        statEl.textContent = 'Approved';
      } else {
        statEl.textContent = 'Locked';
      }
    });

    // Check if completed
    if (apprv.currentStep > 3) {
      document.getElementById('approval-action-controls').style.display = 'none';
      document.getElementById('approval-status-badge').className = 'badge badge-success';
    } else {
      document.getElementById('approval-action-controls').style.display = 'block';
      document.getElementById('approval-status-badge').className = 'badge badge-warning';
    }

    // Populate lines recap
    const tbody = document.getElementById('approval-items-recap-body');
    tbody.innerHTML = '';
    quote.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty} ${item.unit}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.qty * item.price).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Populate comments audit
    const commentsList = document.getElementById('approval-comments-timeline');
    commentsList.innerHTML = '';
    apprv.comments.forEach(c => {
      const div = document.createElement('div');
      div.className = 'wf-comment-card';
      div.innerHTML = `
        <div class="wf-comment-meta">
          <strong>${c.user}</strong>
          <span>${c.timestamp}</span>
        </div>
        <p class="text-secondary">${c.comment}</p>
      `;
      commentsList.appendChild(div);
    });

    // Bind action buttons for workflow approval/rejection
    // Clear old events by clone replacing elements
    const btnApprove = document.getElementById('btn-workflow-approve');
    const btnReject = document.getElementById('btn-workflow-reject');
    
    const newApprove = btnApprove.cloneNode(true);
    const newReject = btnReject.cloneNode(true);
    
    btnApprove.parentNode.replaceChild(newApprove, btnApprove);
    btnReject.parentNode.replaceChild(newReject, btnReject);

    newApprove.addEventListener('click', () => {
      const commInput = document.getElementById('approval-comment-input').value;
      if (!commInput) { alert("Please provide a comment summarizing your evaluation approval."); return; }
      
      this.executeWorkflowApprove(apprv.id, commInput);
    });

    newReject.addEventListener('click', () => {
      const commInput = document.getElementById('approval-comment-input').value;
      if (!commInput) { alert("Please provide a reason comment for rejection."); return; }
      
      this.executeWorkflowReject(apprv.id, commInput);
    });
  },

  executeWorkflowApprove: function(approvalId, comment) {
    const apprv = this.db.approvals.find(a => a.id === approvalId);
    if (!apprv) return;

    const timestamp = new Date().toISOString().replace('T',' ').substring(0, 19);
    apprv.comments.push({
      user: this.db.currentUser.email,
      comment: `Step ${apprv.currentStep} Approved: ` + comment,
      timestamp: timestamp
    });

    apprv.currentStep += 1;

    if (apprv.currentStep > 3) {
      apprv.status = "Fully Approved";
      this.appendLog("APPROVALS", "SUCCESS", `RFQ Workflow approved fully: PO will generate for ${apprv.vendorName}.`);
      this.generatePOFromApproval(apprv);
    } else {
      const stepNames = ["", "Manager Approval", "Finance Approval", "VP Procurement Sign-off"];
      apprv.status = `Pending ${stepNames[apprv.currentStep]}`;
      this.appendLog("APPROVALS", "INFO", `RFQ Workflow updated: ${apprv.id} advanced to step ${apprv.currentStep}.`);
    }

    document.getElementById('approval-comment-input').value = '';
    this.saveState();
    this.loadApprovalDetails(approvalId);
    this.loadApprovalsView();
  },

  executeWorkflowReject: function(approvalId, comment) {
    const apprv = this.db.approvals.find(a => a.id === approvalId);
    if (!apprv) return;

    const timestamp = new Date().toISOString().replace('T',' ').substring(0, 19);
    apprv.comments.push({
      user: this.db.currentUser.email,
      comment: "REJECTED: " + comment,
      timestamp: timestamp
    });

    apprv.status = "Rejected";
    apprv.currentStep = 0; // locked/invalidated

    // Reset RFQ
    const rfq = this.db.rfqs.find(r => r.id === apprv.rfqId);
    if (rfq) rfq.status = "Bidding";

    this.appendLog("APPROVALS", "WARN", `Selection for RFQ ${apprv.rfqId} rejected by user. Bidding reopened.`);
    
    document.getElementById('approval-comment-input').value = '';
    this.saveState();
    this.loadApprovalDetails(approvalId);
    this.loadApprovalsView();
  },

  generatePOFromApproval: function(apprv) {
    const quote = this.db.quotes.find(q => q.id === apprv.quoteId);
    const vendor = this.db.vendors.find(v => v.id === apprv.vendorId);
    if (!quote) return;

    const poId = "PO-2026-00" + (this.db.invoices.length + 1);
    
    const newInvoice = {
      poId: poId,
      rfqId: apprv.rfqId,
      date: new Date().toISOString().split('T')[0],
      vendorId: apprv.vendorId,
      vendorName: apprv.vendorName,
      vendorEmail: vendor ? vendor.email : 'billing@supplier.com',
      vendorAddress: vendor ? vendor.address : '456 Supplier St, USA',
      vendorCountry: vendor ? vendor.country : 'United States',
      subtotal: quote.subtotal,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      shipping: quote.shipping,
      grandTotal: quote.grandTotal,
      notes: quote.notes || "Net 30. Deliveries on weekdays only.",
      status: "Unpaid",
      items: quote.items
    };

    // Close RFQ status
    const rfq = this.db.rfqs.find(r => r.id === apprv.rfqId);
    if (rfq) rfq.status = "PO Generated";

    this.db.invoices.push(newInvoice);
    this.appendLog("INVOICES", "SUCCESS", `Automatically generated Purchase Order ${poId} for ${apprv.vendorName}.`);
    this.saveState();
  },

  // --- 7. PO & INVOICES view loader ---
  loadInvoicesView: function() {
    const list = document.getElementById('invoice-sidebar-list');
    list.innerHTML = '';

    if (this.db.invoices.length === 0) {
      list.innerHTML = `<li><span class="text-muted">No POs or Invoices generated yet.</span></li>`;
      return;
    }

    this.db.invoices.forEach(inv => {
      const li = document.createElement('li');
      li.setAttribute('data-id', inv.poId);
      li.innerHTML = `
        <strong>${inv.poId}</strong>
        <span>Vendor: ${inv.vendorName}</span>
        <span class="d-block text-success text-small">$${inv.grandTotal.toFixed(2)} | Status: ${inv.status}</span>
      `;
      
      li.addEventListener('click', () => {
        list.querySelectorAll('li').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        this.loadInvoiceSheet(inv.poId);
      });
      list.appendChild(li);
    });

    document.getElementById('invoice-details-wrapper').style.display = 'none';
    document.getElementById('invoice-no-selection').style.display = 'flex';
  },

  loadInvoiceSheet: function(poId) {
    const inv = this.db.invoices.find(i => i.poId === poId);
    if (!inv) return;

    document.getElementById('invoice-no-selection').style.display = 'none';
    document.getElementById('invoice-details-wrapper').style.display = 'block';

    // Set basic text details
    document.getElementById('inv-sheet-type').textContent = "PURCHASE ORDER";
    document.getElementById('inv-sheet-number').textContent = inv.poId;
    document.getElementById('inv-sheet-date').textContent = inv.date;
    document.getElementById('inv-sheet-rfq-ref').textContent = inv.rfqId;

    // Supplier Info
    document.getElementById('inv-supplier-name').textContent = inv.vendorName;
    document.getElementById('inv-supplier-email').textContent = inv.vendorEmail;
    document.getElementById('inv-supplier-address').textContent = inv.vendorAddress;
    document.getElementById('inv-supplier-country').textContent = inv.vendorCountry;

    // Notes
    document.getElementById('inv-sheet-notes').textContent = inv.notes || "No special instructions.";

    // Items table rows
    const tbody = document.getElementById('inv-sheet-items');
    tbody.innerHTML = '';
    
    inv.items.forEach(item => {
      const tr = document.createElement('tr');
      const itemTotal = item.qty * item.price;
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td class="text-center">${item.qty} ${item.unit || 'Pcs'}</td>
        <td class="text-right">$${parseFloat(item.price).toFixed(2)}</td>
        <td class="text-right">$${itemTotal.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Summary calculations boxes
    document.getElementById('inv-sheet-subtotal').textContent = `$${inv.subtotal.toFixed(2)}`;
    document.getElementById('inv-sheet-tax-rate').textContent = `${inv.taxRate}%`;
    document.getElementById('inv-sheet-tax').textContent = `$${inv.taxAmount.toFixed(2)}`;
    document.getElementById('inv-sheet-shipping').textContent = `$${inv.shipping.toFixed(2)}`;
    document.getElementById('inv-sheet-grand-total').textContent = `$${inv.grandTotal.toFixed(2)}`;
  },

  // --- 8. REPORTS & ANALYTICS view loader ---
  loadAnalyticsView: function() {
    // 1. Calculations metrics
    const totalSpendVal = this.db.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    document.getElementById('report-total-spend').textContent = utils.formatCurrency(totalSpendVal);
    document.getElementById('report-active-pos').textContent = this.db.invoices.filter(i=>i.status==='Unpaid').length;

    // Mock calculations details
    document.getElementById('report-avg-savings').textContent = "18.4%";
    document.getElementById('report-disputes').textContent = "0";

    // 2. Render Spend YTD Bar Chart
    const barData = [12000, 18500, 9500, 22000, 13375, 0];
    const junSpend = this.db.invoices
      .filter(inv => inv.date.includes('-06-'))
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    barData[5] = junSpend;
    
    utils.renderBarChart('analytics-spend-svg', barData, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);

    // 3. Render Categories Distribution Pie Chart
    const categories = [
      { label: "Furniture", value: 0 },
      { label: "IT Hardware", value: 0 },
      { label: "Office Supplies", value: 0 },
      { label: "Facilities", value: 0 },
      { label: "Logistics", value: 0 }
    ];
    this.db.invoices.forEach(inv => {
      const rfq = this.db.rfqs.find(r => r.id === inv.rfqId);
      const catName = rfq ? rfq.category : "Office Supplies";
      const catObj = categories.find(c => c.label === catName);
      if (catObj) catObj.value += inv.grandTotal;
    });

    if (categories.reduce((s,c)=>s+c.value, 0) === 0) {
      categories[0].value = 5000;
      categories[1].value = 12500;
      categories[2].value = 2500;
    }
    utils.renderDonutChart('analytics-category-svg', categories, 'analytics-category-legend');

    // 4. Fill Suppliers Table list
    const tbody = document.getElementById('analytics-vendor-table-body');
    tbody.innerHTML = '';

    this.db.vendors.slice(0, 4).forEach(v => {
      // calc vendor spend contribution
      const vSpend = this.db.invoices.filter(i=>i.vendorId===v.id).reduce((s,i)=>s+i.grandTotal, 0);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${v.name}</strong></td>
        <td>${v.category}</td>
        <td>${utils.formatCurrency(vSpend)}</td>
        <td class="text-center">${this.db.invoices.filter(i=>i.vendorId===v.id).length}</td>
        <td>4-7 Days</td>
        <td><span class="badge badge-success">98% Perfect</span></td>
      `;
      tbody.appendChild(tr);
    });
  },

  // --- 9. ACTIVITY AUDIT LOGS view loader ---
  loadLogsView: function() {
    const tbody = document.getElementById('logs-table-body');
    tbody.innerHTML = '';

    const query = document.getElementById('logs-search').value.toLowerCase();
    const activeLevelBtn = document.querySelector('#log-level-filter-buttons .btn-filter.active-filter');
    const levelFilter = activeLevelBtn ? activeLevelBtn.getAttribute('data-level') : 'ALL';

    const filtered = this.db.logs.filter(log => {
      const matchSearch = log.message.toLowerCase().includes(query) || 
                          log.module.toLowerCase().includes(query) || 
                          log.user.toLowerCase().includes(query);
      const matchLevel = levelFilter === 'ALL' || log.level === levelFilter;
      
      return matchSearch && matchLevel;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No logs recorded matching search criteria.</td></tr>`;
      return;
    }

    filtered.forEach(log => {
      const tr = document.createElement('tr');
      const badgeClass = log.level === 'INFO' ? 'badge-info' : (log.level === 'WARN' ? 'badge-warning' : 'badge-error');
      
      tr.innerHTML = `
        <td class="text-muted">${log.timestamp}</td>
        <td><span class="badge badge-success">${log.module}</span></td>
        <td><span class="badge ${badgeClass}">${log.level}</span></td>
        <td>${log.user}</td>
        <td><strong>${log.message}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  },

  // --- EXPORT LOGS CSV DOWNLOADER ---
  exportLogsCSV: function() {
    let csv = "Timestamp,Module,Level,User,Message\r\n";
    this.db.logs.forEach(log => {
      csv += `"${log.timestamp}","${log.module}","${log.level}","${log.user}","${log.message.replace(/"/g, '""')}"\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "VendorBridge_AuditLogs.csv";
    link.click();
  }
};

// Start application on page load
window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
