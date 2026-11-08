import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Pill, Package, ShoppingCart, Users, Truck, Wallet,
  BarChart3, Settings, Bell, Search, Plus, TrendingUp, AlertTriangle,
  CalendarDays, Menu, Activity, UserCog, Receipt,
  CircleDollarSign, LogOut, Edit, Trash2, X, Save, RotateCcw
} from "lucide-react";
import "./App.css";

const API = import.meta.env.PROD
  ? "https://pharmacare-backend-nv4l.onrender.com/api"
  : "http://localhost:5000/api";
const SAMPLE_MEDICINES = [
  { name: "Paracetamol 500mg", category: "Pain Relief", stock: 120, price: 20, expiry: "2027-12-31" },
  { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 65, price: 45, expiry: "2027-08-20" },
  { name: "Cetirizine 10mg", category: "Allergy", stock: 32, price: 15, expiry: "2027-05-15" },
  { name: "Omeprazole 20mg", category: "Gastric", stock: 80, price: 35, expiry: "2027-09-10" },
  { name: "Azithromycin 500mg", category: "Antibiotic", stock: 28, price: 75, expiry: "2027-06-25" },
  { name: "Vitamin C 500mg", category: "Supplements", stock: 95, price: 30, expiry: "2028-01-18" },
  { name: "Ibuprofen 400mg", category: "Pain Relief", stock: 42, price: 25, expiry: "2027-11-05" },
  { name: "ORS Sachet", category: "Other", stock: 150, price: 12, expiry: "2027-10-30" },
  { name: "Metformin 500mg", category: "Other", stock: 60, price: 28, expiry: "2027-07-14" },
  { name: "Pantoprazole 40mg", category: "Gastric", stock: 45, price: 40, expiry: "2027-12-10" },
  { name: "Montelukast 10mg", category: "Allergy", stock: 38, price: 55, expiry: "2027-09-22" },
  { name: "Calcium + Vitamin D", category: "Supplements", stock: 70, price: 90, expiry: "2028-02-15" },
  { name: "Aspirin 75mg", category: "Pain Relief", stock: 50, price: 15, expiry: "2028-06-15" },
  { name: "Dolo 650mg", category: "Pain Relief", stock: 70, price: 30, expiry: "2028-08-20" },
  { name: "Cough Syrup", category: "Cough & Cold", stock: 35, price: 85, expiry: "2027-12-10" },
  { name: "Vitamin B Complex", category: "Supplements", stock: 45, price: 40, expiry: "2028-03-12" },
  { name: "Iron Tablets", category: "Supplements", stock: 55, price: 65, expiry: "2028-05-18" },
  { name: "Antacid Tablets", category: "Gastric", stock: 40, price: 25, expiry: "2027-11-25" },
  { name: "Loratadine 10mg", category: "Allergy", stock: 30, price: 20, expiry: "2028-01-30" },
  { name: "Clotrimazole Cream", category: "Skin Care", stock: 25, price: 50, expiry: "2027-10-15" },
  { name: "Antiseptic Liquid", category: "First Aid", stock: 20, price: 75, expiry: "2028-04-22" },
  { name: "ORS Powder", category: "Other", stock: 60, price: 20, expiry: "2027-09-18" },
  { name: "Zinc Tablets", category: "Supplements", stock: 45, price: 35, expiry: "2028-07-14" },
  { name: "Eye Drops", category: "Eye Care", stock: 25, price: 55, expiry: "2027-12-20" },
  { name: "Bandage Roll", category: "First Aid", stock: 40, price: 30, expiry: "2029-01-10" }
];

const money = value =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const dateText = value =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

export default function App({ onLogout }) {
  const [page, setPage] = useState("Dashboard");
  const [medicines, setMedicines] = useState([]);
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const [medicineForm, setMedicineForm] = useState({
    name: "",
    category: "Pain Relief",
    stock: "",
    price: "",
    expiry: ""
  });

  const [saleForm, setSaleForm] = useState({
    medicineId: "",
    quantity: 1
  });

  const [directoryForm, setDirectoryForm] = useState({
    name: "",
    phone: "",
    email: "",
    contact: ""
  });

  const [customers, setCustomers] = useState([
    { id: 1, name: "Aarav Medical Store", phone: "9876543210", email: "aarav@example.com", total: 12500 },
    { id: 2, name: "Sri Sai Clinic", phone: "9876501234", email: "srisai@example.com", total: 8200 },
    { id: 3, name: "City Care Pharmacy", phone: "9123456780", email: "citycare@example.com", total: 5600 }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "HealthPlus Distributors", contact: "Ramesh", phone: "9876543211", email: "sales@healthplus.com" },
    { id: 2, name: "MedLife Pharma", contact: "Suresh", phone: "9876543212", email: "orders@medlife.com" }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@pharmacare.com", role: "Administrator" },
    { id: 2, name: "Store Manager", email: "manager@pharmacare.com", role: "Manager" },
    { id: 3, name: "Pharmacist", email: "pharmacist@pharmacare.com", role: "Pharmacist" }
  ]);

  const [userForm, setUserForm] = useState({
  name: "",
  email: "",
  role: "Staff"
});

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Server error ${response.status}`);
    }

    return data;
  }

  function showNotice(text, type = "success") {
    setNotice(text);
    setNoticeType(type);
  }

  
async function loadData() {
  try {
    setLoading(true);

    let [medicineData, salesData] = await Promise.all([
      request("/medicines"),
      request("/sales")
    ]);

    // Add missing demo medicines without deleting existing records.
    const existingNames = new Set(
      medicineData.map(m => m.name.trim().toLowerCase())
    );

    const missingMedicines = SAMPLE_MEDICINES.filter(
      medicine => !existingNames.has(medicine.name.trim().toLowerCase())
    );

    for (const medicine of missingMedicines) {
      await request("/medicines", {
        method: "POST",
        body: JSON.stringify(medicine)
      });
    }

    if (missingMedicines.length > 0) {
      medicineData = await request("/medicines");
    }

    setMedicines(medicineData);
    setSales(salesData);

  } catch (error) {
    showNotice(`Could not load backend data: ${error.message}`, "error");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    loadData();
  }, []);

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total || 0), 0
  );

  const todaySales = sales
    .filter(s => new Date(s.date) >= todayStart)
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  const totalStock = medicines.reduce(
    (sum, m) => sum + Number(m.stock || 0), 0
  );

  const lowStock = medicines.filter(
    m => Number(m.stock) > 0 && Number(m.stock) <= 15
  );

  const outOfStock = medicines.filter(
    m => Number(m.stock) === 0
  );

  const expired = medicines.filter(
    m => new Date(m.expiry) < todayStart
  );

  const expiringSoon = medicines.filter(m => {
    const days = (new Date(m.expiry) - todayStart) / 86400000;
    return days >= 0 && days <= 90;
  });

  // Illustrative estimates, not formal accounting figures.
  const estimatedPurchases = medicines.reduce(
    (sum, m) => sum + Number(m.stock || 0) * Number(m.price || 0) * 0.62,
    0
  );

  // Estimated gross profit using an assumed 38% margin on recorded sales.
  const estimatedProfit = totalSales * 0.38;

  const filteredMedicines = medicines.filter(m =>
    `${m.name} ${m.category} ${m._id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const topSelling = useMemo(() => {
    const grouped = {};

    sales.forEach(s => {
      const name = s.medicineName || "Medicine";
      grouped[name] = (grouped[name] || 0) + Number(s.total || 0);
    });

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [sales]);

  const monthlySales = useMemo(() =>
    Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - 5 + index,
        1
      );

      const amount = sales
        .filter(s => {
          const d = new Date(s.date);
          return d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear();
        })
        .reduce((sum, s) => sum + Number(s.total || 0), 0);

      return {
        label: date.toLocaleDateString("en-IN", { month: "short" }),
        amount
      };
    }),
    [sales]
  );

  function statusOf(m) {
    if (new Date(m.expiry) < todayStart) return "Expired";
    if (Number(m.stock) === 0) return "Out of Stock";
    if (Number(m.stock) <= 15) return "Low Stock";
    return "In Stock";
  }

  function openAddMedicine() {
    setEditId(null);

    setMedicineForm({
      name: "",
      category: "Pain Relief",
      stock: "",
      price: "",
      expiry: ""
    });

    setModal("medicine");
  }

  function openEditMedicine(m) {
    setEditId(m._id);

    setMedicineForm({
      name: m.name,
      category: m.category,
      stock: m.stock,
      price: m.price,
      expiry: new Date(m.expiry).toISOString().slice(0, 10)
    });

    setModal("medicine");
  }

  async function saveMedicine(event) {
    event.preventDefault();

    if (saving) return;

    const stock = Number(medicineForm.stock);
    const price = Number(medicineForm.price);

    if (
      !medicineForm.name.trim() ||
      !medicineForm.expiry ||
      medicineForm.stock === "" ||
      medicineForm.price === "" ||
      !Number.isFinite(stock) ||
      stock < 0 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      showNotice("Please enter valid details in all medicine fields.", "error");
      return;
    }

    const payload = {
      name: medicineForm.name.trim(),
      category: medicineForm.category,
      stock,
      price,
      expiry: medicineForm.expiry
    };

    try {
      setSaving(true);

      if (editId) {
        await request(`/medicines/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });

        showNotice("Medicine updated successfully!");

      } else {
        await request("/medicines", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        showNotice("Medicine saved successfully!");
      }

      setModal("");
      await loadData();

    } catch (error) {
      showNotice(`Save failed: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMedicine(id) {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await request(`/medicines/${id}`, {
        method: "DELETE"
      });

      showNotice("Medicine deleted successfully!");
      await loadData();

    } catch (error) {
      showNotice(`Delete failed: ${error.message}`, "error");
    }
  }

  async function recordSale(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      await request("/sales", {
        method: "POST",
        body: JSON.stringify({
          medicineId: saleForm.medicineId,
          quantity: Number(saleForm.quantity)
        })
      });

      setModal("");
      setSaleForm({ medicineId: "", quantity: 1 });

      showNotice("Sale recorded successfully!");
      await loadData();

    } catch (error) {
      showNotice(`Sale failed: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  function renderMedicineTable(actions = true, limit = null) {
    const rows = limit
      ? filteredMedicines.slice(0, limit)
      : filteredMedicines;

    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>MEDICINE</th>
              <th>MEDICINE ID</th>
              <th>STOCK</th>
              <th>PRICE</th>
              <th>EXPIRY DATE</th>
              <th>STATUS</th>
              {actions && <th>ACTIONS</th>}
            </tr>
          </thead>

          <tbody>
            {rows.map(m => (
              <tr key={m._id}>
                <td>
                  <strong>{m.name}</strong>
                  <small>{m.category}</small>
                </td>

                <td>MED{m._id.slice(-5).toUpperCase()}</td>
                <td>{m.stock} units</td>
                <td>{money(m.price)}</td>
                <td>{dateText(m.expiry)}</td>

                <td>
                  <span className={`status ${statusOf(m).toLowerCase().replaceAll(" ", "-")}`}>
                    {statusOf(m)}
                  </span>
                </td>

                {actions && (
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-action"
                        title="Edit"
                        onClick={() => openEditMedicine(m)}
                      >
                        <Edit size={14}/>
                      </button>

                      <button
                        className="delete-action"
                        title="Delete"
                        onClick={() => deleteMedicine(m._id)}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={actions ? 7 : 6} className="empty-message">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function Stat({ icon: Icon, color, label, value, note }) {
    return (
      <div className="stat-card">
        <div className="stat-top">
          <span className={`stat-icon ${color}`}>
            <Icon size={20}/>
          </span>
          <span className="live-label">● Live</span>
        </div>

        <p>{label}</p>
        <h2>{value}</h2>
        <small>{note}</small>
      </div>
    );
  }

  function PanelTitle({ title, subtitle, action }) {
    return (
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
    );
  }

  function renderChart() {
    const max = Math.max(1, ...monthlySales.map(x => x.amount));

    const points = monthlySales
      .map((item, i) => `${30 + i * 74},${145 - item.amount / max * 110}`)
      .join(" ");

    return (
      <div className="chart-area">
        <svg viewBox="0 0 410 180" role="img" aria-label="Monthly sales overview">
          {[35, 70, 105, 140].map(y => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="400"
              y2={y}
              stroke="#edf0f6"
              strokeDasharray="4 4"
            />
          ))}

          <polyline
            points={points}
            fill="none"
            stroke="#6755df"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {monthlySales.map((item, i) => {
            const x = 30 + i * 74;
            const y = 145 - item.amount / max * 110;

            return (
              <g key={item.label}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="#6755df"
                  strokeWidth="3"
                />
                <text
                  x={x}
                  y="171"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#9298a9"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {sales.length === 0 && (
          <p className="chart-empty">
            Your chart will update when you record sales.
          </p>
        )}
      </div>
    );
  }

  function dashboard() {
    const stockGroups = [
      {
        label: "In Stock",
        count: medicines.filter(m => statusOf(m) === "In Stock").length,
        color: "#38b879"
      },
      { label: "Low Stock", count: lowStock.length, color: "#efa34d" },
      { label: "Out of Stock", count: outOfStock.length, color: "#e87880" },
      { label: "Expired", count: expired.length, color: "#8d70df" }
    ];

    const all = Math.max(medicines.length, 1);
    let accumulated = 0;

    const gradient = stockGroups.map(group => {
      const start = accumulated / all * 100;
      accumulated += group.count;

      return `${group.color} ${start}% ${accumulated / all * 100}%`;
    }).join(", ");

    return (
      <>
        <div className="welcome-banner">
          <div>
            <span>PHARMACY OVERVIEW</span>
            <h1>Good Morning, Admin! 👋</h1>
            <p>Here's your pharmacy performance overview for today.</p>
          </div>

          <div className="banner-icon">
            <Pill size={62}/>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Monitor your pharmacy at a glance.</p>
          </div>

          <span className="date-pill">
            <CalendarDays size={15}/>
            {now.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </span>
        </div>

        <div className="stats-grid five">
          <Stat icon={ShoppingCart} color="blue" label="Total Sales" value={money(totalSales)} note="All recorded sales"/>
          <Stat icon={Package} color="green" label="Total Purchases" value={money(estimatedPurchases)} note="Estimated inventory value"/>
          <Stat icon={TrendingUp} color="purple" label="Total Profit" value={money(estimatedProfit)} note="Estimated overview"/>
          <Stat icon={Users} color="orange" label="Total Customers" value={customers.length} note="Customer records"/>
          <Stat icon={AlertTriangle} color="red" label="Low Stock Items" value={lowStock.length} note="Need attention"/>
        </div>

        <div className="dashboard-grid top-grid">
          <section className="panel">
            <PanelTitle
              title="Sales Overview"
              subtitle="Sales performance · Last 6 months"
              action={<span className="mini-pill">Last 6 months</span>}
            />
            {renderChart()}
          </section>

          <section className="panel">
            <PanelTitle
              title="Top Selling Medicines"
              subtitle="Based on recorded sales"
            />

            {topSelling.length ? (
              topSelling.map(([name, amount], i) => (
                <div className="rank-row" key={name}>
                  <span className="rank-number">{i + 1}</span>
                  <div className="rank-info">
                    <strong>{name}</strong>
                    <small>Medicine sales</small>
                  </div>
                  <b>{money(amount)}</b>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Record sales to see top-selling medicines.
              </div>
            )}
          </section>

          <section className="panel">
            <PanelTitle
              title="Stock Summary"
              subtitle={`${medicines.length} medicine types in inventory`}
            />

            <div className="stock-summary">
              <div
                className="donut"
                style={{ background: `conic-gradient(${gradient})` }}
              >
                <div>
                  <strong>{medicines.length}</strong>
                  <small>Items</small>
                </div>
              </div>

              <div className="stock-legend">
                {stockGroups.map(s => (
                  <div key={s.label}>
                    <i style={{ background: s.color }}/>
                    <span>{s.label}</span>
                    <b>{s.count}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-grid lower-grid">
          <section className="panel">
            <PanelTitle
              title="Expiry Alerts"
              subtitle="Medicines nearing expiry"
              action={
                <button className="text-action" onClick={() => setPage("Inventory")}>
                  View All ↗
                </button>
              }
            />

            {[...expired, ...expiringSoon.filter(m => !expired.includes(m))]
              .slice(0, 5).length ? (
              [...expired, ...expiringSoon.filter(m => !expired.includes(m))]
                .slice(0, 5)
                .map(m => (
                  <div className="alert-row" key={m._id}>
                    <AlertTriangle size={15}/>
                    <strong>{m.name}</strong>
                    <span>{dateText(m.expiry)}</span>
                    <b className={statusOf(m) === "Expired" ? "danger-text" : "warning-text"}>
                      {statusOf(m) === "Expired" ? "Expired" : "Expiring soon"}
                    </b>
                  </div>
                ))
            ) : (
              <div className="empty-state">
                No expiry alerts. Your stock looks good!
              </div>
            )}
          </section>

          <section className="panel">
            <PanelTitle
              title="Recent Transactions"
              subtitle="Latest recorded sales"
              action={
                <button className="text-action" onClick={() => setPage("Sales")}>
                  View All ↗
                </button>
              }
            />

            {sales.slice(0, 5).length ? (
              sales.slice(0, 5).map(s => (
                <div className="transaction-row" key={s._id}>
                  <span className="transaction-icon">
                    <Receipt size={15}/>
                  </span>
                  <div>
                    <strong>{s.medicineName}</strong>
                    <small>{dateText(s.date)} · Qty {s.quantity}</small>
                  </div>
                  <b>{money(s.total)}</b>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No transactions yet. Record your first sale.
              </div>
            )}
          </section>

          <section className="panel">
            <PanelTitle
              title="Payment Overview"
              subtitle="Recorded sales payments"
            />

            <div className="payment-total">
              <span>Total received</span>
              <strong>{money(totalSales)}</strong>
            </div>

            <div className="payment-bar">
              <span style={{ width: sales.length ? "100%" : "0%" }}/>
            </div>

            <div className="payment-legend">
              <span>
                <i className="paid-dot"/>Recorded sales
                <b>{money(totalSales)}</b>
              </span>
              <span>
                <i className="pending-dot"/>Pending
                <b>₹0</b>
              </span>
            </div>

            <p className="muted-note">
              Based on sales recorded in this application.
            </p>
          </section>
        </div>

        <section className="panel business-summary">
          <PanelTitle
            title="Business Summary"
            subtitle="Your pharmacy at a glance"
          />

          <div className="business-metrics">
            <div><CircleDollarSign/><span>Total Revenue</span><strong>{money(totalSales)}</strong></div>
            <div><Wallet/><span>Inventory Value</span><strong>{money(estimatedPurchases)}</strong></div>
            <div><TrendingUp/><span>Estimated Profit</span><strong>{money(estimatedProfit)}</strong></div>
            <div><Users/><span>Customers</span><strong>{customers.length}</strong></div>
            <div><Receipt/><span>Transactions</span><strong>{sales.length}</strong></div>
          </div>
        </section>

        <section className="panel recent-medicines">
          <PanelTitle
            title="Recent Medicines"
            subtitle="Your medicine inventory"
            action={
              <button className="add-button" onClick={openAddMedicine}>
                <Plus size={15}/> Add Medicine
              </button>
            }
          />

          {renderMedicineTable(false, 25)}

          <div className="table-footer">
            Showing {Math.min(25, medicines.length)} of {medicines.length} medicines
            <button onClick={() => setPage("Medicines")}>View All ↗</button>
          </div>
        </section>
      </>
    );
  }

  function inventoryPage() {
    return (
      <>
        <div className="stats-grid four">
          <Stat icon={Package} color="green" label="In Stock" value={medicines.filter(m => statusOf(m) === "In Stock").length} note="Healthy stock"/>
          <Stat icon={AlertTriangle} color="orange" label="Low Stock" value={lowStock.length} note="Reorder soon"/>
          <Stat icon={Package} color="red" label="Out of Stock" value={outOfStock.length} note="Unavailable items"/>
          <Stat icon={CalendarDays} color="purple" label="Expired" value={expired.length} note="Do not sell"/>
        </div>

        <section className="panel">
          <PanelTitle
            title="Inventory Details"
            subtitle="Live stock levels for all medicines"
            action={<button className="add-button" onClick={() => setPage("Medicines")}>Manage Medicines</button>}
          />
          {renderMedicineTable()}
        </section>
      </>
    );
  }

  function salesPage() {
    return (
      <>
        <div className="stats-grid four">
          <Stat icon={Wallet} color="green" label="Total Revenue" value={money(totalSales)} note="All recorded sales"/>
          <Stat icon={Receipt} color="purple" label="Transactions" value={sales.length} note="Recorded sales"/>
          <Stat icon={CalendarDays} color="orange" label="Today's Revenue" value={money(todaySales)} note="Today's transactions"/>
          <Stat icon={Package} color="blue" label="Stock Units" value={totalStock} note="Remaining units"/>
        </div>

        <section className="panel">
          <PanelTitle
            title="Sales History"
            subtitle="Track medicine sales and transactions"
            action={
              <button
                className="add-button"
                onClick={() => {
                  setSaleForm({ medicineId: "", quantity: 1 });
                  setModal("sale");
                }}
              >
                <Plus size={15}/> Record Sale
              </button>
            }
          />

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>TRANSACTION ID</th>
                  <th>MEDICINE</th>
                  <th>QUANTITY</th>
                  <th>TOTAL AMOUNT</th>
                  <th>DATE</th>
                </tr>
              </thead>

              <tbody>
                {sales.map(s => (
                  <tr key={s._id}>
                    <td>SALE{s._id.slice(-5).toUpperCase()}</td>
                    <td><strong>{s.medicineName}</strong></td>
                    <td>{s.quantity}</td>
                    <td>{money(s.total)}</td>
                    <td>{new Date(s.date).toLocaleString("en-IN")}</td>
                  </tr>
                ))}

                {!sales.length && (
                  <tr>
                    <td colSpan="5" className="empty-message">
                      No sales recorded yet. Click Record Sale to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  function addDirectory(event, type) {
    event.preventDefault();

    if (!directoryForm.name.trim()) return;

    const entry = {
      ...directoryForm,
      id: Date.now(),
      total: 0
    };

    if (type === "customer") {
      setCustomers(old => [...old, entry]);
    } else {
      setSuppliers(old => [...old, entry]);
    }

    setDirectoryForm({
      name: "",
      phone: "",
      email: "",
      contact: ""
    });

    setModal("");
    showNotice(`${type === "customer" ? "Customer" : "Supplier"} added for this session.`);
  }

  function directoryPage(type) {
    const isCustomer = type === "customer";
    const rows = isCustomer ? customers : suppliers;

    return (
      <section className="panel">
        <PanelTitle
          title={isCustomer ? "Customer Management" : "Supplier Management"}
          subtitle={isCustomer ? "Manage your pharmacy customers." : "Manage medicine distributors and suppliers."}
          action={
            <button
              className="add-button"
              onClick={() => {
                setDirectoryForm({ name: "", phone: "", email: "", contact: "" });
                setModal(type);
              }}
            >
              <Plus size={15}/> Add {isCustomer ? "Customer" : "Supplier"}
            </button>
          }
        />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                {!isCustomer && <th>CONTACT PERSON</th>}
                <th>PHONE</th>
                <th>EMAIL</th>
                {isCustomer && <th>TOTAL PURCHASES</th>}
              </tr>
            </thead>

            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong></td>
                  {!isCustomer && <td>{r.contact || "—"}</td>}
                  <td>{r.phone || "—"}</td>
                  <td>{r.email || "—"}</td>
                  {isCustomer && <td>{money(r.total)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="muted-note">
          Customer and supplier entries are currently kept in this browser session.
          Medicine and sales data are saved in MongoDB.
        </p>
      </section>
    );
  }

  function accountingPage() {
    return (
      <>
        <div className="stats-grid four">
          <Stat icon={CircleDollarSign} color="green" label="Revenue" value={money(totalSales)} note="Recorded sales"/>
          <Stat icon={Wallet} color="orange" label="Estimated Purchases" value={money(estimatedPurchases)} note="Inventory estimate"/>
          <Stat icon={TrendingUp} color="purple" label="Estimated Profit" value={money(estimatedProfit)} note="Indicative only"/>
          <Stat icon={Receipt} color="blue" label="Transactions" value={sales.length} note="Sales records"/>
        </div>

        <section className="panel">
          <PanelTitle
            title="Accounting Summary"
            subtitle="Calculated from your current records"
          />

          <div className="account-row">
            <span>Gross sales revenue</span>
            <b>{money(totalSales)}</b>
          </div>

          <div className="account-row">
            <span>Estimated inventory purchase value</span>
            <b>{money(estimatedPurchases)}</b>
          </div>

          <div className="account-row">
            <span>Recorded transactions</span>
            <b>{sales.length}</b>
          </div>

          <div className="account-row total">
            <span>Estimated profit</span>
            <b>{money(estimatedProfit)}</b>
          </div>

          <p className="muted-note">
            Purchase and profit values are estimates, not audited accounting entries.
          </p>
        </section>
      </>
    );
  }

  
function reportsPage() {
  return (
    <div className="print-report">
      <div className="stats-grid four">
        <Stat
          icon={Pill}
          color="purple"
          label="Medicine Types"
          value={medicines.length}
          note="Registered products"
        />
        <Stat
          icon={ShoppingCart}
          color="green"
          label="Revenue"
          value={money(totalSales)}
          note="Recorded sales"
        />
        <Stat
          icon={Package}
          color="orange"
          label="Stock Units"
          value={totalStock}
          note="Available inventory"
        />
        <Stat
          icon={AlertTriangle}
          color="red"
          label="Alerts"
          value={lowStock.length + expired.length}
          note="Low stock and expired"
        />
      </div>

      <section className="panel">
        <PanelTitle
          title="Pharmacy Report"
          subtitle="Current medicine inventory report"
          action={
            <button
              className="add-button no-print"
              onClick={() => window.print()}
            >
              Print Report
            </button>
          }
        />

        {renderMedicineTable(false)}
      </section>
    </div>
  );
}

  function masterDataPage() {
  const categories = [...new Set(
    medicines.map(m => m.category).filter(Boolean)
  )];

  return (
    <>
      <div className="stats-grid four">
        <Stat
          icon={Pill}
          color="purple"
          label="Medicine Records"
          value={medicines.length}
          note="Registered medicines"
        />
        <Stat
          icon={Package}
          color="green"
          label="Categories"
          value={categories.length}
          note="Medicine categories"
        />
        <Stat
          icon={Users}
          color="orange"
          label="Customers"
          value={customers.length}
          note="Customer records"
        />
        <Stat
          icon={Truck}
          color="blue"
          label="Suppliers"
          value={suppliers.length}
          note="Supplier records"
        />
      </div>

      <section className="panel">
        <PanelTitle
          title="Medicine Categories"
          subtitle="Categories currently available in your pharmacy"
        />

        <div className="business-metrics">
          {categories.map(category => (
            <div key={category}>
              <Pill />
              <span>Medicine Category</span>
              <strong>{category}</strong>
              <small>
                {medicines.filter(m => m.category === category).length} medicines
              </small>
            </div>
          ))}
        </div>
      </section>

      <section className="panel recent-medicines">
        <PanelTitle
          title="Medicine Master Records"
          subtitle="Complete registered medicine information"
          action={
            <button className="add-button" onClick={() => navigate("Medicines")}>
              Manage Medicines
            </button>
          }
        />
        {renderMedicineTable(false)}
      </section>
    </>
  );
}

  function usersPage() {
  function handleAddUser(event) {
    event.preventDefault();

    if (!userForm.name.trim() || !userForm.email.trim()) {
      showNotice("Please enter the user name and email.", "error");
      return;
    }

    const emailExists = users.some(
      user => user.email.toLowerCase() === userForm.email.trim().toLowerCase()
    );

    if (emailExists) {
      showNotice("This email address is already registered.", "error");
      return;
    }

    setUsers(old => [
      ...old,
      {
        id: Date.now(),
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        role: userForm.role
      }
    ]);

    setUserForm({ name: "", email: "", role: "Staff" });
    showNotice("User added successfully!");
  }

  return (
    <section className="panel">
      <PanelTitle
        title="User Management"
        subtitle="Add users and assign their roles"
      />

      <form className="user-form" onSubmit={handleAddUser}>
        <div>
          <label>User Name</label>
          <input
            type="text"
            required
            placeholder="Enter user name"
            value={userForm.name}
            onChange={e =>
              setUserForm({ ...userForm, name: e.target.value })
            }
          />
        </div>

        <div>
          <label>Email Address</label>
          <input
            type="email"
            required
            placeholder="Enter email address"
            value={userForm.email}
            onChange={e =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />
        </div>

        <div>
          <label>Assign Role</label>
          <select
            value={userForm.role}
            onChange={e =>
              setUserForm({ ...userForm, role: e.target.value })
            }
          >
            <option value="Staff">Staff</option>
            <option value="Administrator">Administrator</option>
            <option value="Manager">Manager</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Inventory Manager">Inventory Manager</option>
          </select>
        </div>

        <button className="add-button" type="submit">
          <Plus size={15} /> Add User
        </button>
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className="status in-stock">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted-note">
        User entries are currently stored in frontend session state.
        Backend authentication and permanent user storage are not configured.
      </p>
    </section>
  );
}

  function settingsPage() {
    return (
      <section className="panel">
        <PanelTitle
          title="Settings"
          subtitle="Manage your PharmaCare application"
        />

        <div className="settings-row">
          <div>
            <strong>Refresh Database Data</strong>
            <p>Fetch the latest medicine and sales records from MongoDB.</p>
          </div>

          <button className="add-button" onClick={loadData}>
            <RotateCcw size={14}/> Refresh Data
          </button>
        </div>

        <div className="settings-row">
          <div>
            <strong>Application</strong>
            <p>PharmaCare Pharmacy Management System · Version 2.0</p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>API Server</strong>
            <p>{API}</p>
          </div>
          <span className="status in-stock">Configured</span>
        </div>
      </section>
    );
  }

  const pages = {
    Dashboard: dashboard,

    Medicines: () => (
      <section className="panel">
        <PanelTitle
          title="Medicine Management"
          subtitle="Add, update, search and remove medicines"
          action={
            <button className="add-button" onClick={openAddMedicine}>
              <Plus size={15}/> Add Medicine
            </button>
          }
        />

        <div className="page-search">
          <Search size={16}/>
          <input
  placeholder="Search medicine name, category or ID..."
  value={search}
  onChange={e => setSearch(e.target.value)}
  style={{
    color: "#222222",
    backgroundColor: "#ffffff",
    WebkitTextFillColor: "#222222",
    caretColor: "#222222",
    opacity: 1
  }}
/>
        </div>

        {renderMedicineTable()}
      </section>
    ),

    Inventory: inventoryPage,
    Sales: salesPage,
    Customers: () => directoryPage("customer"),
    Suppliers: () => directoryPage("supplier"),
    Accounting: accountingPage,
    Reports: reportsPage,
    "Master Data": masterDataPage,
    "User Management": usersPage,
    Settings: settingsPage
  };

  const navGroups = [
    {
      heading: "MAIN MENU",
      items: [
        ["Dashboard", LayoutDashboard],
        ["Sales", ShoppingCart],
        ["Purchase", Package],
        ["Inventory", Pill],
        ["Customers", Users],
        ["Suppliers", Truck],
        ["Accounting", Wallet],
        ["Reports", BarChart3],
        ["Master Data", Package],
        ["User Management", UserCog]
      ]
    },
    {
      heading: "PREFERENCES",
      items: [["Settings", Settings]]
    }
  ];

  function navigate(name) {
  if (name === "Purchase") name = "Accounting";

  setPage(name);
  setSearch("");
  setMobileOpen(false);
  setNotice("");
}

  return (
    <div className="app-container">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Pill size={24}/></div>
          <div>
            <h2>PharmaCare</h2>
            <span>Management System</span>
          </div>
        </div>

        {navGroups.map(group => (
          <div className="nav-section" key={group.heading}>
            <p className="nav-heading">{group.heading}</p>

            {group.items.map(([name, Icon]) => (
              <button
                key={name}
                className={`nav-item ${page === name ? "active" : ""}`}
                onClick={() => navigate(name)}
              >
                <Icon size={17}/>
                <span>{name}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="help-card">
            <Activity size={21}/>
            <h4>Need Help?</h4>
            <p>Contact support for assistance.</p>
            <button onClick={() => window.location.href = "mailto:support@pharmacare.com"}>
              Get Support
            </button>
          </div>

          <button
            className="nav-item logout"
            onClick={onLogout}
    >
            <LogOut size={17} />
            Log Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={21}/>
            </button>

            <div>
              <h2>{page}</h2>
              <p>Welcome back! Here's what's happening today.</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="header-search">
              <Search size={16}/>
              <input
  placeholder="Search medicines..."
  value={search}
  onChange={e => setSearch(e.target.value)}
  style={{
    color: "#222222",
    backgroundColor: "transparent",
    WebkitTextFillColor: "#222222",
    caretColor: "#222222",
    opacity: 1
  }}
/>
            </div>

            <button className="notification" onClick={() => navigate("Inventory")}>
              <Bell size={18}/>
              {lowStock.length + expired.length > 0 && <span/>}
            </button>

            <div className="profile">
              <div className="avatar">AD</div>
              <div className="profile-info">
                <strong>Admin</strong>
                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          {notice && (
            <div className={`notice ${noticeType}`}>
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>
                <X size={14}/>
              </button>
            </div>
          )}

          {loading
            ? <div className="panel loading-panel">Loading pharmacy data...</div>
            : (pages[page] || dashboard)()
          }

          <footer className="footer">
            <span>© 2026 PharmaCare. All rights reserved.</span>
            <span>Pharmacy Management System · v2.0</span>
          </footer>
        </section>
      </main>

      {modal && (
        <div
          className="modal-overlay"
          onClick={() => !saving && setModal("")}
        >
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <h2>
                  {modal === "medicine"
                    ? (editId ? "Edit Medicine" : "Add New Medicine")
                    : modal === "sale"
                      ? "Record New Sale"
                      : modal === "customer"
                        ? "Add Customer"
                        : "Add Supplier"
                  }
                </h2>
                <p>Enter the details below.</p>
              </div>

              <button
                className="close-modal"
                disabled={saving}
                onClick={() => setModal("")}
              >
                <X size={18}/>
              </button>
            </div>

            {modal === "medicine" ? (
              <form onSubmit={saveMedicine}>
                <label>Medicine Name</label>
                <input
                  required
                  value={medicineForm.name}
                  onChange={e => setMedicineForm({ ...medicineForm, name: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg"
                />

                <label>Category</label>
                <select
                  value={medicineForm.category}
                  onChange={e => setMedicineForm({ ...medicineForm, category: e.target.value })}
                >
                  {["Pain Relief", "Antibiotic", "Supplements", "Allergy", "Gastric", "Other"].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <div className="form-row">
                  <div>
                    <label>Stock Quantity</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={medicineForm.stock}
                      onChange={e => setMedicineForm({ ...medicineForm, stock: e.target.value })}
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label>Price (₹)</label>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={medicineForm.price}
                      onChange={e => setMedicineForm({ ...medicineForm, price: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>

                <label>Expiry Date</label>
                <input
                  required
                  type="date"
                  value={medicineForm.expiry}
                  onChange={e => setMedicineForm({ ...medicineForm, expiry: e.target.value })}
                />

                <button className="submit-button" type="submit" disabled={saving}>
                  <Save size={15}/>
                  {saving ? "Saving..." : editId ? "Update Medicine" : "Save Medicine"}
                </button>
              </form>
            ) : modal === "sale" ? (
              <form onSubmit={recordSale}>
                <label>Select Medicine</label>
                <select
                  required
                  value={saleForm.medicineId}
                  onChange={e => setSaleForm({ ...saleForm, medicineId: e.target.value })}
                >
                  <option value="">Choose medicine</option>

                  {medicines
                    .filter(m => m.stock > 0 && new Date(m.expiry) >= todayStart)
                    .map(m => (
                      <option key={m._id} value={m._id}>
                        {m.name} — {m.stock} available — {money(m.price)}
                      </option>
                    ))
                  }
                </select>

                <label>Quantity</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={saleForm.quantity}
                  onChange={e => setSaleForm({ ...saleForm, quantity: e.target.value })}
                />

                {(() => {
                  const m = medicines.find(x => x._id === saleForm.medicineId);
                  return m
                    ? <p className="sale-total">Total: {money(m.price * Number(saleForm.quantity))}</p>
                    : null;
                })()}

                <button className="submit-button" type="submit" disabled={saving}>
                  <ShoppingCart size={15}/>
                  {saving ? "Processing..." : "Complete Sale"}
                </button>
              </form>
            ) : (
              <form onSubmit={e => addDirectory(e, modal)}>
                <label>
                  {modal === "customer" ? "Customer Name" : "Supplier Name"}
                </label>

                <input
                  required
                  value={directoryForm.name}
                  onChange={e => setDirectoryForm({ ...directoryForm, name: e.target.value })}
                  placeholder="Enter name"
                />

                {modal === "supplier" && (
                  <>
                    <label>Contact Person</label>
                    <input
                      value={directoryForm.contact}
                      onChange={e => setDirectoryForm({ ...directoryForm, contact: e.target.value })}
                      placeholder="Contact person"
                    />
                  </>
                )}

                <label>Phone</label>
                <input
                  value={directoryForm.phone}
                  onChange={e => setDirectoryForm({ ...directoryForm, phone: e.target.value })}
                  placeholder="Phone number"
                />

                <label>Email</label>
                <input
                  type="email"
                  value={directoryForm.email}
                  onChange={e => setDirectoryForm({ ...directoryForm, email: e.target.value })}
                  placeholder="Email address"
                />

                <button className="submit-button" type="submit">
                  <Save size={15}/>
                  Save {modal === "customer" ? "Customer" : "Supplier"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
