import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserRound,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
  Stethoscope,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import Badge from "../components/common/Badge";
import {
  getAdminStats,
  getPatients,
  getDoctors,
  createPatient,
  updatePatient,
  deletePatient,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  setUserStatus,
} from "../services/adminService";

import { api } from "../services/api";

/* =========================================================
   HELPERS
========================================================= */

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return "N/A";
  return Number(amount).toLocaleString("en-TZ", { style: "currency", currency: "TZS", minimumFractionDigits: 0 });
}

const TABS = ["overview", "patients", "doctors", "users"];

/* =========================================================
   MODAL WRAPPER
========================================================= */

function Modal({ onClose, title, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 480, maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color="var(--text-secondary, #666)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   PATIENT / DOCTOR FORM
========================================================= */

const EMPTY_PATIENT_PROFILE = { dateOfBirth: "", gender: "", address: "", region: "", district: "", ward: "" };
const EMPTY_DOCTOR_PROFILE = { specialty: "", category: "", bio: "", experience: "", consultationFee: "", homeService: false, onlineConsultation: false, languages: [] };

function UserForm({ type = "patient", initial = null, onSubmit, onCancel, loading }) {
  const isPatient = type === "patient";
  const [firstName, setFirstName] = useState(initial?.firstName || "");
  const [lastName, setLastName] = useState(initial?.lastName || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(
    isPatient
      ? { ...EMPTY_PATIENT_PROFILE, ...(initial?.patient || {}) }
      : { ...EMPTY_DOCTOR_PROFILE, ...(initial?.doctor || {}) }
  );

  function handleProfileChange(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { firstName, lastName, email, phone };
    if (password) payload.password = password;
    payload.profile = { ...profile };
    if (isPatient) {
      payload.role = "PATIENT";
    } else {
      payload.role = "DOCTOR";
      if (payload.profile.experience !== "" && payload.profile.experience !== null && payload.profile.experience !== undefined) {
        payload.profile.experience = parseInt(payload.profile.experience, 10) || 0;
      }
      if (payload.profile.consultationFee !== "" && payload.profile.consultationFee !== undefined) {
        payload.profile.consultationFee = parseFloat(payload.profile.consultationFee) || 0;
      }
      if (typeof payload.profile.homeService === "string") payload.profile.homeService = payload.profile.homeService === "true";
      if (typeof payload.profile.onlineConsultation === "string") payload.profile.onlineConsultation = payload.profile.onlineConsultation === "true";
    }
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group"><label>First Name *</label><input required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
      <div className="form-group"><label>Last Name *</label><input required value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
      <div className="form-group"><label>Email *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="form-group"><label>Phone *</label><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      <div className="form-group"><label>{initial ? "New Password (blank to keep)" : "Password *"}</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!initial} minLength={8} /></div>
      {isPatient ? (
        <>
          <div className="form-group"><label>Date of Birth</label><input type="date" value={profile.dateOfBirth?.slice(0, 10) || ""} onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)} /></div>
          <div className="form-group"><label>Gender</label><select value={profile.gender || ""} onChange={(e) => handleProfileChange("gender", e.target.value)}><option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select></div>
          <div className="form-group"><label>Region</label><input value={profile.region || ""} onChange={(e) => handleProfileChange("region", e.target.value)} /></div>
          <div className="form-group"><label>District</label><input value={profile.district || ""} onChange={(e) => handleProfileChange("district", e.target.value)} /></div>
        </>
      ) : (
        <>
          <div className="form-group"><label>Specialty *</label><input required value={profile.specialty || ""} onChange={(e) => handleProfileChange("specialty", e.target.value)} /></div>
          <div className="form-group"><label>Category</label><input value={profile.category || ""} onChange={(e) => handleProfileChange("category", e.target.value)} placeholder="e.g. Surgery" /></div>
          <div className="form-group"><label>Consultation Fee (TZS) *</label><input type="number" required min={0} value={profile.consultationFee ?? ""} onChange={(e) => handleProfileChange("consultationFee", e.target.value)} /></div>
          <div className="form-group"><label>Experience (years)</label><input type="number" min={0} value={profile.experience ?? ""} onChange={(e) => handleProfileChange("experience", e.target.value)} /></div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><input type="checkbox" checked={profile.homeService === true} onChange={(e) => handleProfileChange("homeService", e.target.checked)} />Home Service</label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><input type="checkbox" checked={profile.onlineConsultation === true} onChange={(e) => handleProfileChange("onlineConsultation", e.target.checked)} />Online Consultation</label>
          </div>
          <div className="form-group"><label>Languages (comma-separated)</label><input value={(profile.languages || []).join(", ")} onChange={(e) => handleProfileChange("languages", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="English, Swahili" /></div>
        </>
      )}
      <div className="modal-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-button" disabled={loading}>{loading ? "Saving..." : initial ? "Update" : "Create"}</button>
      </div>
    </form>
  );
}

/* =========================================================
   MAIN ADMIN PAGE
========================================================= */

function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  /* ---- DATA LOADING ---- */

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, p, d, u] = await Promise.allSettled([
        getAdminStats(),
        getPatients(),
        getDoctors(),
        api("/users"),
      ]);
      if (s.status === "fulfilled") setStats(s.value);
      if (p.status === "fulfilled") setPatients(Array.isArray(p.value) ? p.value : []);
      if (d.status === "fulfilled") setDoctors(Array.isArray(d.value) ? d.value : []);
      if (u.status === "fulfilled") setUsers(Array.isArray(u.value) ? u.value : []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ---- FILTERED LISTS ---- */

  const filteredPatients = useMemo(() => {
    const text = search.toLowerCase().trim();
    return patients.filter((u) => {
      if (activeTab !== "patients" && activeTab !== "users") return true;
      return (
        !text ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(text) ||
        u.email?.toLowerCase().includes(text) ||
        u.phone?.includes(text)
      );
    });
  }, [patients, search, activeTab]);

  const filteredDoctors = useMemo(() => {
    const text = search.toLowerCase().trim();
    return doctors.filter((u) => {
      if (activeTab !== "doctors") return true;
      return (
        !text ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(text) ||
        u.email?.toLowerCase().includes(text) ||
        u.phone?.includes(text) ||
        u.doctor?.specialty?.toLowerCase().includes(text)
      );
    });
  }, [doctors, search, activeTab]);

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase().trim();
    return users.filter((u) => {
      if (activeTab !== "users") return true;
      return (
        !text ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(text) ||
        u.email?.toLowerCase().includes(text) ||
        u.phone?.includes(text)
      );
    });
  }, [users, search, activeTab]);

  /* ---- HANDLERS ---- */

  async function handleCreatePatient(payload) {
    setSaving(true);
    try {
      await createPatient(payload);
      setShowModal(null);
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to create patient");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateDoctor(payload) {
    setSaving(true);
    try {
      await createDoctor(payload);
      setShowModal(null);
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to create doctor");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePatient(id, payload) {
    setSaving(true);
    try {
      await updatePatient(id, payload);
      setShowModal(null);
      setEditTarget(null);
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to update patient");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateDoctor(id, payload) {
    setSaving(true);
    try {
      await updateDoctor(id, payload);
      setShowModal(null);
      setEditTarget(null);
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to update doctor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm(id, type) {
    setActionLoading(id);
    try {
      if (type === "patient") await deletePatient(id);
      else if (type === "doctor") await deleteDoctor(id);
      setConfirmDelete(null);
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    setActionLoading(id);
    try {
      await setUserStatus(id, !currentStatus);
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  }

  /* ---- RENDER HELPERS ---- */

  function roleBadgeTone(role) {
    switch (role) {
      case "ADMIN": return "danger";
      case "DOCTOR": return "success";
      case "HOSPITAL_STAFF": return "default";
      default: return "primary";
    }
  }

  function openEditPatient(user) { setEditTarget(user); setShowModal("edit-patient"); }
  function openEditDoctor(user) { setEditTarget(user); setShowModal("edit-doctor"); }

  return (
    <div className="mobile-app">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate("/home")} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Admin Panel</h1>
          <p>Manage patients, doctors &amp; users</p>
        </div>
        <div className="header-spacer"></div>
      </header>

      <main className="specialists-content">
        {/* STATS */}
        {stats && (
          <div className="hospital-stats-simple">
            <div><strong>{stats.patients}</strong><span>Patients</span></div>
            <div><strong>{stats.doctors}</strong><span>Doctors</span></div>
            <div><strong>{stats.total}</strong><span>Total</span></div>
            <div><strong>{stats.inactive}</strong><span>Inactive</span></div>
          </div>
        )}

        {/* TABS */}
        <div className="category-scroll" style={{ marginBottom: 12 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`category-button${activeTab === tab ? " active" : ""}`}
              onClick={() => { setActiveTab(tab); setSearch(""); }}
            >
              {tab === "overview" ? "Overview" : tab === "patients" ? "Patients" : tab === "doctors" ? "Doctors" : "Users"}
            </button>
          ))}
        </div>

        {/* SEARCH (only for data tabs) */}
        {activeTab !== "overview" && (
          <div className="specialists-search">
            <Search size={19} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* HEADING + ACTION BUTTON */}
        {activeTab !== "overview" && (
          <div className="specialists-heading">
            <div>
              <h2>
                {activeTab === "patients" && filteredPatients.length}
                {activeTab === "doctors" && filteredDoctors.length}
                {activeTab === "users" && filteredUsers.length}
                {" "}{activeTab} found
              </h2>
              <p>Real data from the AfyaNow database</p>
            </div>
            {activeTab !== "users" && (
              <button
                className="primary-button"
                style={{ padding: "8px 16px", fontSize: 13 }}
                onClick={() => { setEditTarget(null); setShowModal(activeTab === "patients" ? "create-patient" : "create-doctor"); }}
              >
                <Plus size={15} /> Add
              </button>
            )}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="no-results">
            <RefreshCw size={25} className="loading-icon" />
            <p>Loading admin data...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="no-results">
            <XCircle size={25} />
            <p>{error}</p>
            <button className="category-button active" onClick={loadAll}>Try again</button>
          </div>
        )}

        {/* ============ OVERVIEW TAB ============ */}
        {!loading && !error && activeTab === "overview" && (
          <div className="admin-overview">
            <div className="admin-overview-cards">
              <button className="quick-action-card" onClick={() => setActiveTab("patients")}>
                <div className="quick-action-icon"><UserRound size={22} /></div>
                <div><strong>{stats?.patients ?? 0}</strong><span>Patients</span></div>
              </button>
              <button className="quick-action-card" onClick={() => setActiveTab("doctors")}>
                <div className="quick-action-icon"><Stethoscope size={22} /></div>
                <div><strong>{stats?.doctors ?? 0}</strong><span>Doctors</span></div>
              </button>
              <button className="quick-action-card" onClick={() => setActiveTab("users")}>
                <div className="quick-action-icon"><Users size={22} /></div>
                <div><strong>{stats?.total ?? 0}</strong><span>Users</span></div>
              </button>
              <button className="quick-action-card" onClick={() => { setActiveTab("users"); setSearch(""); }}>
                <div className="quick-action-icon"><ShieldCheck size={22} /></div>
                <div><strong>{stats?.admins ?? 0}</strong><span>Admins</span></div>
              </button>
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="quick-action-card" onClick={() => { setActiveTab("users"); }} style={{ width: "100%" }}>
                <div className="quick-action-icon"><CheckCircle2 size={22} /></div>
                <div><strong>{stats?.inactive ?? 0} inactive accounts</strong><span>Review user status</span></div>
              </button>
            </div>
          </div>
        )}

        {/* ============ PATIENTS TAB ============ */}
        {!loading && !error && activeTab === "patients" && (
          <div className="doctor-list">
            {filteredPatients.map((user) => (
              <div key={user.id} className="hospital-card" style={{ display: "flex" }}>
                <div className="hospital-icon"><UserRound size={22} /></div>
                <div className="hospital-info" style={{ flex: 1 }}>
                  <h3>{user.firstName} {user.lastName}</h3>
                  <div className="hospital-location"><Mail size={12} /><span>{user.email}</span></div>
                  <div className="hospital-location"><Phone size={12} /><span>{user.phone}</span></div>
                  <div className="hospital-meta">
                    <span><CalendarDays size={12} style={{ marginRight: 4 }} />Joined {formatDate(user.createdAt)}</span>
                    {user.patient?.region && <span>{user.patient.region}</span>}
                  </div>
                  <div className="card-badge-row">
                    <Badge tone={user.isActive ? "success" : "warning"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                  <div className="admin-card-actions">
                    <button className="admin-btn edit" onClick={() => openEditPatient(user)} disabled={actionLoading === user.id}><Pencil size={14} /> Edit</button>
                    <button className="admin-btn status" onClick={() => handleToggleStatus(user.id, user.isActive)} disabled={actionLoading === user.id}>{user.isActive ? <><XCircle size={14} /> Deactivate</> : <><CheckCircle2 size={14} /> Activate</>}</button>
                    <button className="admin-btn delete" onClick={() => setConfirmDelete({ id: user.id, type: "patient", name: `${user.firstName} ${user.lastName}` })} disabled={actionLoading === user.id}><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {filteredPatients.length === 0 && <div className="no-results"><Search size={25} /><p>No patients found.</p></div>}
          </div>
        )}

        {/* ============ DOCTORS TAB ============ */}
        {!loading && !error && activeTab === "doctors" && (
          <div className="doctor-list">
            {filteredDoctors.map((user) => (
              <div key={user.id} className="hospital-card" style={{ display: "flex" }}>
                <div className="hospital-icon"><Stethoscope size={22} /></div>
                <div className="hospital-info" style={{ flex: 1 }}>
                  <h3>Dr. {user.firstName} {user.lastName}</h3>
                  {user.doctor?.specialty && <div className="hospital-location"><Stethoscope size={12} /><span>{user.doctor.specialty}</span></div>}
                  <div className="hospital-location"><Mail size={12} /><span>{user.email}</span></div>
                  <div className="hospital-location"><Phone size={12} /><span>{user.phone}</span></div>
                  <div className="hospital-meta">
                    {user.doctor?.consultationFee !== undefined && <span>Fee: {formatCurrency(user.doctor.consultationFee)}</span>}
                    {user.doctor?.experience ? <span>{user.doctor.experience} yrs exp</span> : null}
                    {user.doctor?.homeService && <span>Home</span>}
                    {user.doctor?.onlineConsultation && <span>Online</span>}
                  </div>
                  <div className="card-badge-row">
                    <Badge tone={roleBadgeTone(user.role)}>{user.role.replace("_", " ")}</Badge>
                    <Badge tone={user.isActive ? "success" : "warning"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                  <div className="admin-card-actions">
                    <button className="admin-btn edit" onClick={() => openEditDoctor(user)} disabled={actionLoading === user.id}><Pencil size={14} /> Edit</button>
                    <button className="admin-btn status" onClick={() => handleToggleStatus(user.id, user.isActive)} disabled={actionLoading === user.id}>{user.isActive ? <><XCircle size={14} /> Deactivate</> : <><CheckCircle2 size={14} /> Activate</>}</button>
                    <button className="admin-btn delete" onClick={() => setConfirmDelete({ id: user.id, type: "doctor", name: `Dr. ${user.firstName} ${user.lastName}` })} disabled={actionLoading === user.id}><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {filteredDoctors.length === 0 && <div className="no-results"><Search size={25} /><p>No doctors found.</p></div>}
          </div>
        )}

        {/* ============ USERS TAB (CONFIRM/MANAGE) ============ */}
        {!loading && !error && activeTab === "users" && (
          <div className="doctor-list">
            {filteredUsers.map((user) => (
              <div key={user.id} className="hospital-card" style={{ display: "flex" }}>
                <div className="hospital-icon">
                  <UserRound size={22} />
                </div>
                <div className="hospital-info" style={{ flex: 1 }}>
                  <h3>{user.firstName} {user.lastName}</h3>
                  <div className="hospital-location"><Mail size={12} /><span>{user.email}</span></div>
                  <div className="hospital-location"><Phone size={12} /><span>{user.phone}</span></div>
                  <div className="hospital-meta">
                    <span><CalendarDays size={12} style={{ marginRight: 4 }} />Joined {formatDate(user.createdAt)}</span>
                    {user.patient && <span>Patient profile</span>}
                    {user.doctor && <span>Doctor &middot; {user.doctor.specialty || "N/A"}</span>}
                  </div>
                  <div className="card-badge-row">
                    <Badge tone={roleBadgeTone(user.role)}>{user.role.replace("_", " ")}</Badge>
                    <Badge tone={user.isActive ? "success" : "warning"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                  <div className="admin-card-actions">
                    <button className={`admin-btn status ${user.isActive ? "deactivate" : "activate"}`} onClick={() => handleToggleStatus(user.id, user.isActive)} disabled={actionLoading === user.id || user.role === "ADMIN"}>
                      {user.isActive ? <><XCircle size={14} /> Deactivate</> : <><CheckCircle2 size={14} /> Activate</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && <div className="no-results"><Search size={25} /><p>No users found.</p></div>}
          </div>
        )}
      </main>

      {/* ============ CREATE PATIENT MODAL ============ */}
      {showModal === "create-patient" && (
        <Modal onClose={() => setShowModal(null)} title="Add Patient">
          <UserForm type="patient" onSubmit={handleCreatePatient} onCancel={() => setShowModal(null)} loading={saving} />
        </Modal>
      )}

      {/* ============ EDIT PATIENT MODAL ============ */}
      {showModal === "edit-patient" && editTarget && (
        <Modal onClose={() => { setShowModal(null); setEditTarget(null); }} title="Edit Patient">
          <UserForm type="patient" initial={editTarget} onSubmit={(p) => handleUpdatePatient(editTarget.id, p)} onCancel={() => { setShowModal(null); setEditTarget(null); }} loading={saving} />
        </Modal>
      )}

      {/* ============ CREATE DOCTOR MODAL ============ */}
      {showModal === "create-doctor" && (
        <Modal onClose={() => setShowModal(null)} title="Add Doctor">
          <UserForm type="doctor" onSubmit={handleCreateDoctor} onCancel={() => setShowModal(null)} loading={saving} />
        </Modal>
      )}

      {/* ============ EDIT DOCTOR MODAL ============ */}
      {showModal === "edit-doctor" && editTarget && (
        <Modal onClose={() => { setShowModal(null); setEditTarget(null); }} title="Edit Doctor">
          <UserForm type="doctor" initial={editTarget} onSubmit={(p) => handleUpdateDoctor(editTarget.id, p)} onCancel={() => { setShowModal(null); setEditTarget(null); }} loading={saving} />
        </Modal>
      )}

      {/* ============ CONFIRM DELETE MODAL ============ */}
      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)} title="Confirm Delete">
          <p>Are you sure you want to permanently delete <strong>{confirmDelete.name}</strong>?</p>
          <p style={{ fontSize: 13, color: "#666" }}>This action cannot be undone.</p>
          <div className="modal-actions">
            <button className="secondary-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="danger-btn" onClick={() => handleDeleteConfirm(confirmDelete.id, confirmDelete.type)} disabled={actionLoading === confirmDelete.id}>
              {actionLoading === confirmDelete.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Admin;
