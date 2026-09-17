import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserRound,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

import Badge from "../components/common/Badge";
import { getUsers } from "../services/userService";

const ROLE_OPTIONS = ["All", "PATIENT", "DOCTOR", "HOSPITAL_STAFF"];

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Users API error:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const total = users.length;
    const patients = users.filter((u) => u.role === "PATIENT").length;
    const doctors = users.filter((u) => u.role === "DOCTOR").length;
    const staff = users.filter((u) => u.role === "HOSPITAL_STAFF").length;
    return { total, patients, doctors, staff };
  }, [users]);

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchesSearch =
        !text ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(text) ||
        u.email?.toLowerCase().includes(text) ||
        u.phone?.includes(text);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  function roleBadgeTone(role) {
    switch (role) {
      case "DOCTOR":
        return "success";
      case "HOSPITAL_STAFF":
        return "default";
      default:
        return "default";
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="mobile-app">
      <header className="page-header">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>System Users</h1>
          <p>All registered users in the system</p>
        </div>
        <div className="header-spacer"></div>
      </header>

      <main className="specialists-content">
        {/* Stats */}
        <div className="hospital-stats-simple">
          <div>
            <strong>{stats.total}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{stats.patients}</strong>
            <span>Patients</span>
          </div>
          <div>
            <strong>{stats.doctors}</strong>
            <span>Doctors</span>
          </div>
        </div>

        {/* Search */}
        <div className="specialists-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Role filter */}
        <div className="category-scroll">
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              className={`category-button${roleFilter === role ? " active" : ""}`}
              onClick={() => setRoleFilter(role)}
            >
              {role === "All" ? "All Roles" : role.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="specialists-heading">
          <div>
            <h2>
              {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
            </h2>
            <p>Real data from the AfyaNow database</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="no-results">
            <RefreshCw size={25} className="loading-icon" />
            <p>Loading users...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="no-results">
            <UserRound size={25} />
            <p>{error}</p>
            <button
              type="button"
              className="category-button active"
              onClick={loadUsers}
            >
              Try again
            </button>
          </div>
        )}

        {/* User list */}
        {!loading && !error && (
          <div className="doctor-list">
            {filtered.map((user) => (
              <div key={user.id} className="hospital-card" style={{ display: "flex" }}>
                <div className="hospital-icon">
                  <UserRound size={22} />
                </div>

                <div className="hospital-info">
                  <h3>
                    {user.firstName} {user.lastName}
                  </h3>

                  <div className="hospital-location">
                    <Mail size={12} />
                    <span>{user.email}</span>
                  </div>

                  <div className="hospital-location">
                    <Phone size={12} />
                    <span>{user.phone}</span>
                  </div>

                  <div className="hospital-meta">
                    <span>
                      <CalendarDays size={12} style={{ marginRight: 4 }} />
                      Joined {formatDate(user.createdAt)}
                    </span>

                    {user.patient && <span>Patient profile</span>}

                    {user.doctor && (
                      <span>
                        Doctor &middot; {user.doctor.specialty}
                      </span>
                    )}
                  </div>

                  <div className="card-badge-row">
                    <Badge tone={roleBadgeTone(user.role)}>
                      {user.role.replace("_", " ")}
                    </Badge>

                    <Badge tone={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="no-results">
                <Search size={25} />
                <p>No users found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Users;
