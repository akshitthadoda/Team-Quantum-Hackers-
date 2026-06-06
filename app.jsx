import React, { useMemo, useState } from "react";

const initialVendors = [
  {
    id: "V-101",
    name: "Techno Ltd",
    category: "IT Hardware",
    contact: "Raj Patel",
    email: "sales@techno.com",
    phone: "+91 98765 43210",
    gst: "24ABCDE1234F1Z5",
    location: "Ahmedabad",
    rating: 4.8,
    status: "Active"
  },
  {
    id: "V-102",
    name: "Infra Supplies",
    category: "Furniture",
    contact: "Meera Shah",
    email: "info@infra.com",
    phone: "+91 99887 77665",
    gst: "24INFRA9988P1Z2",
    location: "Surat",
    rating: 4.5,
    status: "Active"
  },
  {
    id: "V-103",
    name: "FastCorp",
    category: "Logistics",
    contact: "Aman Joshi",
    email: "hello@fastcorp.com",
    phone: "+91 91234 56780",
    gst: "24FAST1234P1Z9",
    location: "Vadodara",
    rating: 4.1,
    status: "Pending"
  },
  {
    id: "V-104",
    name: "OfficeMart",
    category: "Stationery",
    contact: "Nisha Rao",
    email: "office@mart.com",
    phone: "+91 90123 45678",
    gst: "24OFFICE7777K1Z1",
    location: "Rajkot",
    rating: 4.3,
    status: "Active"
  }
];

const initialRfqs = [
  {
    id: "RFQ-001",
    title: "Office Furniture Procurement",
    product: "Ergonomic Chairs",
    qty: 50,
    deadline: "2026-06-18",
    vendors: "Infra Supplies, OfficeMart",
    priority: "High",
    status: "Sent"
  },
  {
    id: "RFQ-002",
    title: "Laptop Purchase",
    product: "Developer Laptops",
    qty: 20,
    deadline: "2026-06-25",
    vendors: "Techno Ltd",
    priority: "Medium",
    status: "Sent"
  },
  {
    id: "RFQ-003",
    title: "Stationery Bulk Order",
    product: "Office Supplies",
    qty: 500,
    deadline: "2026-07-02",
    vendors: "OfficeMart",
    priority: "Low",
    status: "Draft"
  }
];

const initialQuotations = [
  {
    id: "Q-001",
    rfq: "Office Furniture Procurement",
    vendor: "Infra Supplies",
    unit: 2900,
    qty: 50,
    gst: 18,
    delivery: 7,
    warranty: "2 years",
    rating: 4.5,
    status: "Submitted"
  },
  {
    id: "Q-002",
    rfq: "Office Furniture Procurement",
    vendor: "OfficeMart",
    unit: 2760,
    qty: 50,
    gst: 18,
    delivery: 10,
    warranty: "1 year",
    rating: 4.3,
    status: "Submitted"
  },
  {
    id: "Q-003",
    rfq: "Office Furniture Procurement",
    vendor: "BuildPro",
    unit: 2640,
    qty: 50,
    gst: 18,
    delivery: 15,
    warranty: "6 months",
    rating: 3.2,
    status: "Submitted"
  }
];

const menu = [
  ["Dashboard", "📊"],
  ["Vendors", "🏢"],
  ["RFQs", "📄"],
  ["Quotations", "💬"],
  ["Comparison", "⚖️"],
  ["Approvals", "✅"],
  ["PO & Invoice", "🧾"],
  ["Activity", "🔔"],
  ["Reports", "📈"]
];

function money(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

function totalQuote(q) {
  return Number(q.unit || 0) * Number(q.qty || 0) * (1 + Number(q.gst || 0) / 100);
}

function StatusBadge({ status }) {
  const color =
    {
      Active: "green",
      Pending: "yellow",
      Blocked: "red",
      Sent: "blue",
      Draft: "gray",
      Closed: "red",
      Submitted: "purple",
      Approved: "green",
      Rejected: "red",
      Paid: "green"
    }[status] || "blue";

  return <span className={`badge ${color}`}>{status}</span>;
}

function Toast({ text }) {
  return text ? <div className="toast">✅ {text}</div> : null;
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-head">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">VB</div>
        <div>
          <h2>VendorBridge</h2>
          <p>Smart Procurement ERP</p>
        </div>
      </div>

      <nav>
        {menu.map(([name, icon]) => (
          <button
            key={name}
            className={page === name ? "active" : ""}
            onClick={() => setPage(name)}
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Navbar({ dark, setDark }) {
  return (
    <header className="topbar">
      <div>
        <h1>VendorBridge</h1>
        <p>Smart bridge between organizations and vendors 🚀</p>
      </div>

      <div className="top-actions">
        <input placeholder="Search RFQ, vendor, invoice..." />
        <button className="icon-btn">🔔</button>
        <button className="icon-btn" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
        <div className="avatar">A</div>
      </div>
    </header>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat ${color}`}>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
      <span>{icon}</span>
    </div>
  );
}

function Login({ setLoggedIn }) {
  return (
    <div className="login-page">
      <div className="login-info">
        <div className="logo big">VB</div>
        <h1>VendorBridge</h1>
        <p>Smart bridge between organizations and vendors for faster procurement.</p>
        <div className="floating-card">
          📄 RFQ → 💬 Quotation → ✅ Approval → 🧾 Invoice
        </div>
      </div>

      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          setLoggedIn(true);
        }}
      >
        <h2>Welcome Back 👋</h2>
        <input required type="email" placeholder="Email address" />
        <input required type="password" placeholder="Password" />

        <select>
          <option>Procurement Officer</option>
          <option>Admin</option>
          <option>Vendor</option>
          <option>Manager / Approver</option>
        </select>

        <button>Login</button>
        <p className="link">Forgot password? | Create account</p>
      </form>
    </div>
  );
}

function Dashboard({ setPage }) {
  return (
    <section className="page fade">
      <div className="page-head">
        <h2>Dashboard</h2>
        <p>Welcome back, Procurement Officer — Today’s Overview</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Active RFQs" value="12" icon="📄" color="c1" />
        <StatCard title="Pending Approvals" value="5" icon="⏳" color="c2" />
        <StatCard title="Procurement Value" value="₹2.3L" icon="💰" color="c3" />
        <StatCard title="Active Vendors" value="28" icon="🏢" color="c4" />
      </div>

      <div className="quick">
        <button onClick={() => setPage("RFQs")}>➕ Create RFQ</button>
        <button onClick={() => setPage("Vendors")}>🏢 Add Vendor</button>
        <button onClick={() => setPage("Reports")}>📈 View Reports</button>
        <button onClick={() => setPage("PO & Invoice")}>🧾 Generate Invoice</button>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Recent Purchase Orders</h3>
          <table>
            <thead>
              <tr>
                <th>PO No</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>PO-2026-001</td>
                <td>Office Chairs</td>
                <td>₹1,38,000</td>
                <td><StatusBadge status="Approved" /></td>
              </tr>

              <tr>
                <td>PO-2026-002</td>
                <td>Laptops</td>
                <td>₹8,50,000</td>
                <td><StatusBadge status="Pending" /></td>
              </tr>

              <tr>
                <td>PO-2026-003</td>
                <td>Stationery</td>
                <td>₹42,500</td>
                <td><StatusBadge status="Approved" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Procurement Trend</h3>

          <div className="bars">
            {[40, 55, 35, 70, 88, 64].map((height, index) => (
              <div key={index} style={{ height: height + "%" }}>
                <span>{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Vendors({ vendors, setVendors, toast }) {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    contact: "",
    email: "",
    phone: "",
    gst: "",
    location: "",
    rating: 4.0,
    status: "Active"
  });

  const filtered = vendors.filter((vendor) =>
    (vendor.name + vendor.category + vendor.status)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addVendor(e) {
    e.preventDefault();

    setVendors([
      ...vendors,
      {
        ...form,
        id: "V-" + (101 + vendors.length)
      }
    ]);

    setShow(false);

    setForm({
      name: "",
      category: "",
      contact: "",
      email: "",
      phone: "",
      gst: "",
      location: "",
      rating: 4.0,
      status: "Active"
    });

    toast("Vendor added successfully");
  }

  function deleteVendor(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;

    setVendors(vendors.filter((vendor) => vendor.id !== id));
    toast("Vendor deleted");
  }

  return (
    <section className="page fade">
      <div className="page-head row">
        <div>
          <h2>Vendor Management</h2>
          <p>Maintain organized supplier records and GST details.</p>
        </div>

        <button onClick={() => setShow(true)}>➕ Add Vendor</button>
      </div>

      <div className="card">
        <div className="filters">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor..."
          />

          <select>
            <option>All Categories</option>
            <option>IT Hardware</option>
            <option>Furniture</option>
            <option>Stationery</option>
          </select>

          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Blocked</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Category</th>
              <th>Contact</th>
              <th>GST</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>

                <td>
                  <b>{vendor.name}</b>
                  <br />
                  <small>{vendor.email}</small>
                </td>

                <td>{vendor.category}</td>

                <td>
                  {vendor.contact}
                  <br />
                  <small>{vendor.phone}</small>
                </td>

                <td>{vendor.gst}</td>
                <td>⭐ {vendor.rating}</td>
                <td><StatusBadge status={vendor.status} /></td>

                <td>
                  <button className="mini">View</button>{" "}
                  <button className="mini danger" onClick={() => deleteVendor(vendor.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title="Add New Vendor" onClose={() => setShow(false)}>
          <form onSubmit={addVendor} className="form-grid">
            <input
              required
              placeholder="Vendor Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              required
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
              required
              placeholder="Contact Person"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />

            <input
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              required
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              required
              placeholder="GST Number"
              value={form.gst}
              onChange={(e) => setForm({ ...form, gst: e.target.value })}
            />

            <input
              required
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Blocked</option>
            </select>

            <button className="full">Save Vendor</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function RFQs({ rfqs, setRfqs, vendors, toast }) {
  const [form, setForm] = useState({
    title: "",
    product: "",
    qty: "",
    deadline: "",
    vendors: "",
    priority: "Medium",
    status: "Sent"
  });

  function addRfq(e) {
    e.preventDefault();

    setRfqs([
      ...rfqs,
      {
        ...form,
        id: "RFQ-" + String(rfqs.length + 1).padStart(3, "0")
      }
    ]);

    setForm({
      title: "",
      product: "",
      qty: "",
      deadline: "",
      vendors: "",
      priority: "Medium",
      status: "Sent"
    });

    toast("RFQ created and sent to vendors");
  }

  return (
    <section className="page fade">
      <div className="page-head">
        <h2>Create RFQ</h2>
        <p>Step-by-step procurement request creation.</p>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="stepper">
            <span>1 RFQ Details</span>
            <span>2 Product</span>
            <span>3 Vendors</span>
          </div>

          <form onSubmit={addRfq} className="form-grid single">
            <input
              required
              placeholder="RFQ Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              required
              placeholder="Product / Service Name"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
            />

            <input
              required
              type="number"
              placeholder="Quantity"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
            />

            <input
              required
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />

            <select
              value={form.vendors}
              onChange={(e) => setForm({ ...form, vendors: e.target.value })}
            >
              <option value="">Assign Vendor</option>

              {vendors.map((vendor) => (
                <option key={vendor.id}>{vendor.name}</option>
              ))}
            </select>

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <textarea placeholder="Description / Notes"></textarea>

            <button>Submit RFQ</button>
          </form>
        </div>

        <div className="card">
          <h3>RFQ List</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Qty</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rfqs.map((rfq) => (
                <tr key={rfq.id}>
                  <td>{rfq.id}</td>

                  <td>
                    {rfq.title}
                    <br />
                    <small>{rfq.product}</small>
                  </td>

                  <td>{rfq.qty}</td>
                  <td>{rfq.deadline}</td>
                  <td><StatusBadge status={rfq.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Quotations({ quotations, setQuotations, rfqs, vendors, toast }) {
  const [form, setForm] = useState({
    rfq: "Office Furniture Procurement",
    vendor: "Techno Ltd",
    unit: "",
    qty: 1,
    gst: 18,
    delivery: "",
    warranty: "",
    rating: 4.2,
    status: "Submitted"
  });

  function submitQuotation(e) {
    e.preventDefault();

    setQuotations([
      ...quotations,
      {
        ...form,
        id: "Q-" + String(quotations.length + 1).padStart(3, "0")
      }
    ]);

    toast("Quotation submitted successfully");
  }

  return (
    <section className="page fade">
      <div className="page-head">
        <h2>Vendor Quotation Submission</h2>
        <p>Vendors submit pricing, delivery timeline, GST and notes.</p>
      </div>

      <div className="two-col">
        <div className="card">
          <form onSubmit={submitQuotation} className="form-grid single">
            <select
              value={form.rfq}
              onChange={(e) => setForm({ ...form, rfq: e.target.value })}
            >
              {rfqs.map((rfq) => (
                <option key={rfq.id}>{rfq.title}</option>
              ))}
            </select>

            <select
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            >
              {vendors.map((vendor) => (
                <option key={vendor.id}>{vendor.name}</option>
              ))}
            </select>

            <input
              required
              type="number"
              placeholder="Unit Price"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: Number(e.target.value) })}
            />

            <input
              required
              type="number"
              placeholder="Quantity"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
            />

            <input
              type="number"
              placeholder="GST %"
              value={form.gst}
              onChange={(e) => setForm({ ...form, gst: Number(e.target.value) })}
            />

            <input
              required
              type="number"
              placeholder="Delivery Days"
              value={form.delivery}
              onChange={(e) => setForm({ ...form, delivery: Number(e.target.value) })}
            />

            <input
              placeholder="Warranty Period"
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            />

            <textarea placeholder="Notes / Comments"></textarea>

            <div className="quote-total">
              Total: {money(totalQuote(form))}
            </div>

            <button>Submit Quotation</button>
          </form>
        </div>

        <div className="card">
          <h3>Submitted Quotations</h3>

          <table>
            <thead>
              <tr>
                <th>RFQ</th>
                <th>Vendor</th>
                <th>Total</th>
                <th>Delivery</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td>{quotation.rfq}</td>
                  <td>{quotation.vendor}</td>
                  <td>{money(totalQuote(quotation))}</td>
                  <td>{quotation.delivery} days</td>
                  <td><StatusBadge status={quotation.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Comparison({ quotations, toast }) {
  const best = useMemo(() => {
    return [...quotations].sort((a, b) => {
      const priceDifference = totalQuote(a) - totalQuote(b);
      if (priceDifference !== 0) return priceDifference;
      return b.rating - a.rating;
    })[0];
  }, [quotations]);

  return (
    <section className="page fade">
      <div className="page-head">
        <h2>Quotation Comparison</h2>
        <p>Compare vendor prices, delivery, warranty and rating.</p>
      </div>

      <div className="compare-grid">
        {quotations.map((quotation) => (
          <div
            className={`quote-card ${best?.id === quotation.id ? "recommended" : ""}`}
            key={quotation.id}
          >
            {best?.id === quotation.id && (
              <div className="ribbon">🏆 Best Choice</div>
            )}

            <h3>{quotation.vendor}</h3>
            <p>Quoted Amount</p>
            <h2>{money(totalQuote(quotation))}</h2>

            <ul>
              <li>Unit Price: {money(quotation.unit)}</li>
              <li>GST: {quotation.gst}%</li>
              <li>Delivery: {quotation.delivery} days</li>
              <li>Warranty: {quotation.warranty}</li>
              <li>Rating: ⭐ {quotation.rating}</li>
              <li>
                Risk: {quotation.rating >= 4.2 ? "Low Risk" : "Medium Risk"}
              </li>
            </ul>

            <button onClick={() => toast(`${quotation.vendor} selected and sent for approval`)}>
              Send for Approval
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Approvals({ toast }) {
  const [status, setStatus] = useState("Pending");

  return (
    <section className="page fade">
      <div className="page-head">
        <h2>Approval Workflow</h2>
        <p>Manager can approve or reject procurement requests.</p>
      </div>

      <div className="card">
        <div className="workflow">
          {["RFQ Created", "Quotation Selected", "Manager Review", status].map(
            (step, index) => (
              <div
                key={step}
                className={index < 3 || status !== "Pending" ? "done" : ""}
              >
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            )
          )}
        </div>

        <div className="approval-box">
          <h3>Office Furniture Procurement</h3>
          <p>Selected Vendor: <b>OfficeMart</b></p>
          <p>Quotation Amount: <b>₹1,62,840</b></p>

          <textarea placeholder="Add approval remarks..."></textarea>

          <div className="quick">
            <button
              onClick={() => {
                setStatus("Approved");
                toast("Procurement request approved");
              }}
            >
              Approve
            </button>

            <button
              className="danger-btn"
              onClick={() => {
                setStatus("Rejected");
                toast("Procurement request rejected");
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PurchaseInvoice({ toast }) {
  return (
    <section className="page fade">
      <div className="page-head row">
        <div>
          <h2>Purchase Order & Invoice</h2>
          <p>Generate PO, invoice, PDF, print and email.</p>
        </div>

        <div className="quick">
          <button onClick={() => window.print()}>🖨️ Print</button>
          <button onClick={() => toast("PDF download ready for jsPDF integration")}>
            ⬇️ Download PDF
          </button>
          <button onClick={() => toast("Invoice sent by email")}>
            📧 Send Email
          </button>
        </div>
      </div>

      <div className="invoice card">
        <div className="invoice-head">
          <div>
            <h2>VendorBridge</h2>
            <p>Procurement & Vendor Management ERP</p>
          </div>

          <div>
            <b>Invoice No:</b> INV-2026-001
            <br />
            <b>PO No:</b> PO-2026-001
            <br />
            <b>Date:</b> 06 Jun 2026
          </div>
        </div>

        <hr />

        <div className="invoice-parties">
          <div>
            <h4>Buyer Company</h4>
            <p>
              ABC Organization
              <br />
              Ahmedabad, Gujarat
            </p>
          </div>

          <div>
            <h4>Vendor</h4>
            <p>
              OfficeMart
              <br />
              GST: 24OFFICE7777K1Z1
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>GST</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Ergonomic Chair</td>
              <td>50</td>
              <td>₹2,760</td>
              <td>18%</td>
              <td>₹1,62,840</td>
            </tr>
          </tbody>
        </table>

        <div className="total-box">
          <p>Subtotal: ₹1,38,000</p>
          <p>Tax: ₹24,840</p>
          <h3>Grand Total: ₹1,62,840</h3>
          <StatusBadge status="Pending" />
        </div>
      </div>
    </section>
  );
}

function Activity() {
  const items = [
    ["📄", "New RFQ Created", "Office Furniture Procurement created by Procurement Officer", "2 min ago"],
    ["💬", "Quotation Submitted", "OfficeMart submitted quotation", "12 min ago"],
    ["✅", "Manager Approved", "Purchase request approved", "1 hour ago"],
    ["🧾", "Invoice Generated", "INV-2026-001 generated from PO", "Today"],
    ["🏢", "Vendor Updated", "Techno Ltd GST details updated", "Yesterday"]
  ];

  return (
    <section className="page fade">
      <div className="page-head">
        <h2>Activity Logs & Notifications</h2>
        <p>Track procurement updates and audit logs.</p>
      </div>

      <div className="card">
        <div className="tabs">
          <button>All</button>
          <button>RFQs</button>
          <button>Approvals</button>
          <button>Invoices</button>
          <button>Vendors</button>
        </div>

        <div className="timeline">
          {items.map((item, index) => (
            <div className="activity-item" key={index}>
              <span>{item[0]}</span>

              <div>
                <h4>{item[1]}</h4>
                <p>{item[2]}</p>
                <small>{item[3]}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reports() {
  return (
    <section className="page fade">
      <div className="page-head row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Procurement insights, spending summaries and vendor performance.</p>
        </div>

        <div className="quick">
          <button>Export PDF</button>
          <button>Export CSV</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Spend" value="₹12.4L" icon="💸" color="c1" />
        <StatCard title="Active Vendors" value="28" icon="🏢" color="c2" />
        <StatCard title="RFQs Created" value="42" icon="📄" color="c3" />
        <StatCard title="Pending Invoices" value="3" icon="🧾" color="c4" />
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Spend By Category</h3>

          {["IT Hardware", "Furniture", "Stationery", "Logistics"].map(
            (category, index) => (
              <div className="progress" key={category}>
                <label>{category}</label>
                <div>
                  <span style={{ width: [80, 60, 45, 35][index] + "%" }}></span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="card">
          <h3>Top Vendors By Spend</h3>

          <table>
            <tbody>
              <tr>
                <td>Techno Ltd</td>
                <td>₹8,50,000</td>
                <td>6 POs</td>
              </tr>

              <tr>
                <td>Infra Supplies</td>
                <td>₹3,20,000</td>
                <td>4 POs</td>
              </tr>

              <tr>
                <td>OfficeMart</td>
                <td>₹1,62,840</td>
                <td>3 POs</td>
              </tr>
            </tbody>
          </table>

          <div className="insight">
            💡 Smart Insight: 3 RFQs are near deadline and need quick approval.
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("Dashboard");
  const [dark, setDark] = useState(false);

  const [vendors, setVendors] = useState(initialVendors);
  const [rfqs, setRfqs] = useState(initialRfqs);
  const [quotations, setQuotations] = useState(initialQuotations);
  const [toastText, setToastText] = useState("");

  function toast(text) {
    setToastText(text);

    setTimeout(() => {
      setToastText("");
    }, 2300);
  }

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  const pages = {
    Dashboard: <Dashboard setPage={setPage} />,
    Vendors: <Vendors vendors={vendors} setVendors={setVendors} toast={toast} />,
    RFQs: <RFQs rfqs={rfqs} setRfqs={setRfqs} vendors={vendors} toast={toast} />,
    Quotations: (
      <Quotations
        quotations={quotations}
        setQuotations={setQuotations}
        rfqs={rfqs}
        vendors={vendors}
        toast={toast}
      />
    ),
    Comparison: <Comparison quotations={quotations} toast={toast} />,
    Approvals: <Approvals toast={toast} />,
    "PO & Invoice": <PurchaseInvoice toast={toast} />,
    Activity: <Activity />,
    Reports: <Reports />
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <Sidebar page={page} setPage={setPage} />

      <main className="main">
        <Navbar dark={dark} setDark={setDark} />
        {pages[page]}
      </main>

      <Toast text={toastText} />
    </div>
  );
}