import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, LogOut } from "lucide-react";

import { getUser, logoutUser } from "../utils/auth";

const PROFILE_KEY = "afyanowProfile";

function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const user = getUser();
  return {
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    dateOfBirth: "",
    gender: "",
    location: "Dar es Salaam, Tanzania",
  };
}

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getProfile());
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!profile.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!profile.phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setEditing(false);
    setMessage("Profile updated successfully");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const initials = (profile.fullName || "AfyaNow User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mobile-app">
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>My Profile</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="appointments-content">
        {message && <div className="success-banner">{message}</div>}
        {error && <div className="booking-error">{error}</div>}

        <div className="doctor-profile-card" style={{ marginBottom: 20 }}>
          <div className="doctor-large-avatar">
            {profile.fullName ? initials : <UserRound size={32} />}
          </div>
          <h2>{profile.fullName || "Your Name"}</h2>
          <p className="profile-specialty">{profile.email || "No email set"}</p>
        </div>

        <div className="booking-form-card">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="+255 7XX XXX XXX"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!editing}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  border: "1px solid #d5dfe2",
                  borderRadius: "9px",
                  fontFamily: "inherit",
                  fontSize: "15px",
                }}
              >
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              disabled={!editing}
              placeholder="City, Region"
            />
          </div>

          {editing ? (
            <button className="confirm-booking-btn" onClick={handleSave}>
              Save Changes
            </button>
          ) : (
            <button className="primary-button full-width" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <button
          className="danger-btn full-width"
          style={{ marginTop: 15, padding: 13 }}
          onClick={handleLogout}
        >
          <LogOut size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Logout
        </button>
      </main>
    </div>
  );
}

export default Profile;
