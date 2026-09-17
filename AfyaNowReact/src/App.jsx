import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  HeartPulse,
  Search,
  CalendarDays,
  Bell,
  UserRound,
  MapPin,
  ChevronRight,
  Stethoscope,
  Hospital,
  ShieldCheck,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Specialists from "./pages/Specialists";
import DoctorDetails from "./pages/DoctorDetails";
import SearchBar from "./components/SearchBar";
import BookAppointment from "./pages/BookAppointment";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyAppointments from "./pages/MyAppointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import RescheduleAppointment from "./pages/RescheduleAppointment";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Users from "./pages/Users";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import { isLoggedIn, saveSession, getUser, clearSession } from "./utils/auth";
import { login as apiLogin } from "./services/authService";
import { hospitals, getHospitalStats } from "./data/hospitals";
import { services } from "./data/services";
import { sortHospitals } from "./utils/sort";

import Badge from "./components/common/Badge";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useLanguage } from "./context/LanguageContext";

import "./App.css";

/* =========================================================
   SAMPLE DATA
========================================================= */

const featuredServiceNames = [
  "General Medicine",
  "Maternity",
  "Surgery",
  "Laboratory",
];

const popularServices = featuredServiceNames
  .map((name) =>
    services.find((service) => service.name === name)
  )
  .filter(Boolean);

const nearbyHospitals = sortHospitals(hospitals, "rating").slice(0, 3);

/* =========================================================
   PLACEHOLDER PAGE
========================================================= */

function Placeholder({ title, description }) {
  const navigate = useNavigate();

  return (
    <div className="mobile-app">

      <header className="simple-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1>{title}</h1>

        <div className="header-spacer"></div>

      </header>

      <main className="placeholder-page">

        <div className="placeholder-icon">
          <HeartPulse size={38} />
        </div>

        <h2>{title}</h2>

        <p>
          {description ||
            "This section will be completed in the next development step."}
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>

      </main>

    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================================================
   ADMIN ROUTE
========================================================= */

function AdminRoute({ children }) {
  const user = getUser();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!user || user.role !== "ADMIN") return <Navigate to="/home" replace />;
  return children;
}

/* =========================================================
   SPLASH SCREEN
========================================================= */

function Splash() {

  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="splash-screen">

      <div className="splash-content">

        <div className="app-logo large-logo">
          <HeartPulse
            size={42}
            strokeWidth={2.4}
          />
        </div>

        <h1>AfyaNow</h1>

        <p>
          {t("splash.tagline")}
        </p>

        <button
          className="primary-button splash-button"
          onClick={() => navigate("/login")}
        >
          {t("splash.start")}
        </button>

      </div>

      <div className="splash-footer">

        <ShieldCheck size={15} />

        <span>
          Safe • Simple • Accessible
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function Login() {

  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const preferredRole = searchParams.get("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(
    ["PATIENT", "DOCTOR", "ADMIN"].includes(preferredRole) ? preferredRole : "PATIENT"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleErrors = {
    PATIENT: t("auth.accountNotFound"),
    DOCTOR: t("auth.doctorNotFound"),
    ADMIN: "Admin account not found",
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email/phone and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiLogin({ identifier: email.trim(), password });
      const sessionUser = data?.user;

      if (!sessionUser) {
        setError(roleErrors[role]);
        return;
      }

      if (!sessionUser.isActive) {
        setError("Your account is deactivated. Please contact the administrator.");
        clearSession();
        return;
      }

      if (sessionUser.role !== role) {
        setError(roleErrors[role]);
        return;
      }

      saveSession(sessionUser, data.accessToken);
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || roleErrors[role]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <HeartPulse size={31} />
        </div>

        <h1>
          {t("auth.welcome")}
        </h1>

        <p className="auth-subtitle">
          {t("auth.loginPrompt")}
        </p>

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              {t("auth.iam")}
            </label>

            <div className="role-toggle">
              <button
                type="button"
                className={`role-toggle-option${role === "PATIENT" ? " active" : ""}`}
                onClick={() => setRole("PATIENT")}
              >
                {t("auth.patient")}
              </button>
              <button
                type="button"
                className={`role-toggle-option${role === "DOCTOR" ? " active" : ""}`}
                onClick={() => setRole("DOCTOR")}
              >
                {t("auth.doctor")}
              </button>
              <button
                type="button"
                className={`role-toggle-option${role === "ADMIN" ? " active" : ""}`}
                onClick={() => setRole("ADMIN")}
              >
                Admin
              </button>
            </div>

          </div>

          <div className="form-group">

            <label>
              {t("auth.emailOrPhone")}
            </label>

            <input
              type="text"
              placeholder="Enter your email or phone number"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              {t("auth.password")}
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

          </div>

          <div className="forgot-row">

            <button
              type="button"
              className="forgot-password"
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Signing in..." : t("auth.login")}
          </button>

        </form>

      </div>

    </div>
  );
}

/* =========================================================
   REGISTER PAGE
========================================================= */

function Register() {

  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <HeartPulse size={31} />
        </div>

        <h1>
          {t("auth.create")}
        </h1>

        <p className="auth-subtitle">
          {t("auth.createPrompt")}
        </p>

        <div className="booking-error">
          Accounts are created by the system administrator only.
          Please contact the AfyaNow administrator.
        </div>

        <button
          type="button"
          className="primary-button full-width"
          onClick={() => navigate("/login")}
        >
          {t("auth.login")}
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function Home() {

  const navigate = useNavigate();
  const { t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);

  const stats = getHospitalStats();

  return (
    <div className="mobile-app">

      {/* HEADER */}

      <header className="home-header">

        <div className="header-left">

          <button
            className="icon-button menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menuOpen}
            aria-controls="home-navigation"
          >

            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}

          </button>

          <div className="brand-section">

            <div className="small-logo">
              <HeartPulse size={22} />
            </div>

            <div>

              <p className="welcome-small">
                {t("home.welcome")}
              </p>

              <h1>
                AfyaNow
              </h1>

            </div>

          </div>

        </div>

        <div className="header-actions">

          <button
            className="icon-button"
            onClick={() =>
              navigate("/notifications")
            }
            aria-label="Notifications"
          >

            <Bell size={20} />

            <span className="notification-dot"></span>

          </button>

        </div>

      </header>

      {/* MOBILE MENU */}

      {menuOpen && (

        <nav
          id="home-navigation"
          className="mobile-menu"
          aria-label="Main navigation"
        >

          <LanguageSwitcher />

          <Link
            to="/dashboard"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <CalendarDays size={17} />

            {t("nav.dashboard")}

          </Link>

          <Link
            to="/profile"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <UserRound size={17} />

            {t("nav.profile")}

          </Link>

          <Link
            to="/appointments"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <CalendarDays size={17} />

            {t("nav.appointments")}

          </Link>

          <Link
            to="/notifications"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <Bell size={17} />

            {t("nav.notifications")}

          </Link>

          <Link
            to="/users"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <UserRound size={17} />

            System Users

          </Link>

          {getUser()?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <ShieldCheck size={17} />
              Admin Panel
            </Link>
          )}

          <Link
            to="/hospitals"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <Hospital size={17} />

            {t("nav.hospitals")}

          </Link>

          <Link
            to="/help"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <ShieldCheck size={17} />

            {t("nav.help")}

          </Link>

          <Link
            to="/about"
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <HeartPulse size={17} />

            {t("nav.about")}

          </Link>

        </nav>

      )}

      <main className="home-content">

        {/* WELCOME CARD */}

        <section className="welcome-card">

          <div>

            <span className="welcome-label">
              {t("home.healthMatters")}
            </span>

            <h2>
              {t("home.heading")}
            </h2>

            <p>
              {t("home.description")}
            </p>

          </div>

          <div className="welcome-card-icon">
            <HeartPulse size={42} />
          </div>

        </section>

        {/* NATIONAL COVERAGE STAT */}

        <section className="home-stats-strip">

          <div>

            <strong>
              {stats.total}
            </strong>

            <span>
              Health centres
            </span>

          </div>

          <div>

            <strong>
              {stats.totalRegions}
            </strong>

            <span>
              Regions in Tanzania
            </span>

          </div>

          <div>

            <strong>
              {stats.homeServiceCount}
            </strong>

            <span>
              Home service
            </span>

          </div>

        </section>

        {/* SEARCH */}

        <section className="home-search-section">

          <SearchBar />

        </section>

        {/* QUICK ACTIONS */}

        <section className="quick-actions">

          <button
            onClick={() =>
              navigate("/services")
            }
            className="quick-action-card"
          >

            <div className="quick-action-icon">
              <Stethoscope size={22} />
            </div>

            <div>

              <strong>
                Services
              </strong>

              <span>
                Healthcare services
              </span>

            </div>

          </button>

          <button
            onClick={() =>
              navigate("/specialists")
            }
            className="quick-action-card"
          >

            <div className="quick-action-icon">
              <UserRound size={22} />
            </div>

            <div>

              <strong>
                Specialists
              </strong>

              <span>
                Find a specialist
              </span>

            </div>

          </button>

          <button
            onClick={() =>
              navigate("/hospitals")
            }
            className="quick-action-card"
          >

            <div className="quick-action-icon">
              <Hospital size={22} />
            </div>

            <div>

              <strong>
                Hospitals
              </strong>

              <span>
                Nearby hospitals
              </span>

            </div>

          </button>

          <button
            onClick={() =>
              navigate("/appointments")
            }
            className="quick-action-card"
          >

            <div className="quick-action-icon">
              <CalendarDays size={22} />
            </div>

            <div>

              <strong>
                Appointments
              </strong>

              <span>
                Manage bookings
              </span>

            </div>

          </button>

        </section>

        {/* SERVICES */}

        <section className="home-section">

          <div className="section-heading">

            <div>

              <h2>
                Healthcare Services
              </h2>

              <p>
                Choose what you need
              </p>

            </div>

            <Link
              to="/services"
              className="see-all"
            >
              See all
            </Link>

          </div>

          <div className="popular-services">

            {popularServices.map(
              (service) => {

                const Icon =
                  service.icon;

                return (

                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    className="popular-service-card"
                  >

                    <div className="popular-service-icon">

                      <Icon size={23} />

                    </div>

                    <h3>
                      {service.name}
                    </h3>

                    <p>
                      {service.description}
                    </p>

                    <ChevronRight
                      size={15}
                      className="service-card-arrow"
                    />

                  </Link>

                );
              }
            )}

          </div>

        </section>

        {/* NEARBY HOSPITALS */}

        <section className="home-section">

          <div className="section-heading">

            <div>

              <h2>
                Nearby Hospitals
              </h2>

              <p>
                Healthcare facilities around you
              </p>

            </div>

            <Link
              to="/hospitals"
              className="see-all"
            >
              See all
            </Link>

          </div>

          <div className="hospital-list">

            {nearbyHospitals.map(
              (hospital) => (

                <Link
                  key={hospital.id}
                  to={`/hospitals/${hospital.id}`}
                  className="hospital-card"
                >

                  <div className="hospital-icon">

                    <Hospital size={22} />

                  </div>

                  <div className="hospital-info">

                    <h3>
                      {hospital.name}
                    </h3>

                    <div className="hospital-location">

                      <MapPin size={12} />

                      <span>
                        {hospital.location}
                      </span>

                    </div>

                    <div className="hospital-meta">

                      <span>
                        ★ {hospital.rating} (
                        {hospital.reviews}
                        )
                      </span>

                      <span>
                        {hospital.type}
                      </span>

                    </div>

                    <div className="card-badge-row">

                      <Badge
                        tone={
                          hospital.category ===
                          "priority"
                            ? "warning"
                            : "default"
                        }
                      >
                        {hospital.category ===
                        "priority"
                          ? "Priority/Convenience"
                          : "Standard"}
                      </Badge>

                      {hospital.homeService && (
                        <Badge tone="success">
                          Home service
                        </Badge>
                      )}

                    </div>

                  </div>

                  <ChevronRight size={18} />

                </Link>

              )
            )}

            {nearbyHospitals.length === 0 && (

              <div className="no-results">

                <Search size={25} />

                <p>
                  No hospitals found.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* TRUST SECTION */}

        <section className="trust-card">

          <ShieldCheck size={25} />

          <div>

            <h3>
              Your health information is important
            </h3>

            <p>
              AfyaNow is designed to make healthcare
              access simple, organized and convenient.
            </p>

          </div>

        </section>

      </main>

      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-navigation">

        <Link
          to="/home"
          className="bottom-nav-item active"
        >

          <span>
            <span className="nav-symbol">
              ⌂
            </span>
          </span>

          <span>
            Home
          </span>

        </Link>

        <Link
          to="/services"
          className="bottom-nav-item"
        >

          <span>
            <Stethoscope size={19} />
          </span>

          <span>
            Services
          </span>

        </Link>

        <Link
          to="/appointments"
          className="bottom-nav-item"
        >

          <span>
            <CalendarDays size={19} />
          </span>

          <span>
            Appointments
          </span>

        </Link>

        <Link
          to="/profile"
          className="bottom-nav-item"
        >

          <span>
            <UserRound size={19} />
          </span>

          <span>
            Profile
          </span>

        </Link>

      </nav>

    </div>
  );
}

/* =========================================================
   APP ROUTER
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =================================================
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/"
          element={<Splash />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            MAIN APP
        ================================================= */}

        <Route
          path="/home"
          element={<Home />}
        />

        {/* =================================================
            SERVICES
        ================================================= */}

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/services/:id"
          element={<ServiceDetails />}
        />

        {/* =================================================
            SPECIALISTS
        ================================================= */}

        <Route
          path="/specialists"
          element={<Specialists />}
        />

        <Route
          path="/specialists/:id"
          element={<DoctorDetails />}
        />

        {/* =================================================
            BOOKING & APPOINTMENTS
        ================================================= */}

        <Route
          path="/booking/:doctorId"
          element={<BookAppointment />}
        />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        <Route
          path="/appointments"
          element={<MyAppointments />}
        />

        <Route
          path="/appointments/current"
          element={<AppointmentDetails />}
        />

        <Route
          path="/appointments/current/reschedule"
          element={<RescheduleAppointment />}
        />

        {/* =================================================
            HOSPITALS
        ================================================= */}

        <Route
          path="/hospitals"
          element={<Hospitals />}
        />

        <Route
          path="/hospitals/:id"
          element={<HospitalDetails />}
        />

        {/* =================================================
            PROTECTED PATIENT PAGES
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* =================================================
            STATIC / INFORMATION PAGES
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        {/* =================================================
            UNKNOWN ROUTES
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;