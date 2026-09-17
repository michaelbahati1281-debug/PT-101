import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  UserRound,
  Hospital,
  CalendarDays,
  MapPin,
  Clock3,
  Bell,
  CheckCircle2,
} from "lucide-react";

import { getAppointment } from "../data/appointments";
import { getUser } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const user = getUser();
  const { t } = useLanguage();

  useEffect(() => {
    setAppointment(getAppointment());
  }, []);

  const activity = [
    { id: 1, text: t("dashboard.appointmentBooked"), icon: CalendarDays },
    { id: 2, text: t("dashboard.appointmentConfirmed"), icon: CheckCircle2 },
    { id: 3, text: t("dashboard.appointmentRescheduled"), icon: Clock3 },
  ];

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
        <h1>Dashboard</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="home-content">
        <section className="welcome-card">
          <div>
            <span className="welcome-label">{t("dashboard.greeting")}</span>
            <h2>
              {t("dashboard.welcomeBack")}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              <br />
              {t("dashboard.toAfyaNow")}
            </h2>
            <p>{t("dashboard.activity")}</p>
          </div>
          <div className="welcome-card-icon">
            <UserRound size={42} />
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <h2>{t("dashboard.upcomingAppointment")}</h2>
              <p>{t("dashboard.nextScheduled")}</p>
            </div>
          </div>

          {appointment ? (
            <div className="appointment-card">
              <div className="appointment-card-top">
                <div className="doctor-large-avatar" style={{ width: 54, height: 54 }}>
                  <CalendarDays size={22} />
                </div>
                <div className="appointment-card-info">
                  <h3>{appointment.doctorName}</h3>
                  <p>{appointment.specialty}</p>
                </div>
              </div>

              <div className="appointment-card-meta">
                <span>
                  <MapPin size={13} />
                  {appointment.hospital}
                </span>
                <span>
                  <Clock3 size={13} />
                  {appointment.date} · {appointment.time}
                </span>
              </div>

              <div className="appointment-card-actions">
                <Link to="/appointments/current" className="secondary-btn small-btn">
                  {t("dashboard.viewAppointment")}
                </Link>
                {appointment.status === "Confirmed" && (
                  <>
                    <Link
                      to="/appointments/current/reschedule"
                      className="secondary-btn small-btn"
                    >
                      {t("dashboard.reschedule")}
                    </Link>
                    <button
                      className="danger-btn small-btn"
                      onClick={() => navigate("/appointments/current")}
                    >
                      {t("dashboard.cancel")}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CalendarDays size={30} />
              </div>
              <h3>{t("dashboard.noUpcoming")}</h3>
              <p>{t("dashboard.bookNext")}</p>
              <Link to="/specialists" className="primary-button">
                {t("dashboard.findSpecialist")}
              </Link>
            </div>
          )}
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <h2>{t("dashboard.quickActions")}</h2>
            </div>
          </div>

          <section className="quick-actions">
            <button onClick={() => navigate("/specialists")} className="quick-action-card">
              <div className="quick-action-icon">
                <UserRound size={22} />
              </div>
              <div>
                <strong>{t("dashboard.findDoctor")}</strong>
                <span>{t("dashboard.browseSpecialists")}</span>
              </div>
            </button>

            <button onClick={() => navigate("/specialists")} className="quick-action-card">
              <div className="quick-action-icon">
                <CalendarDays size={22} />
              </div>
              <div>
                <strong>{t("dashboard.bookAppointment")}</strong>
                <span>{t("dashboard.scheduleVisit")}</span>
              </div>
            </button>

            <button onClick={() => navigate("/services")} className="quick-action-card">
              <div className="quick-action-icon">
                <Stethoscope size={22} />
              </div>
              <div>
                <strong>{t("dashboard.healthcareServices")}</strong>
                <span>{t("dashboard.exploreServices")}</span>
              </div>
            </button>

            <button onClick={() => navigate("/appointments")} className="quick-action-card">
              <div className="quick-action-icon">
                <Hospital size={22} />
              </div>
              <div>
                <strong>{t("dashboard.myAppointments")}</strong>
                <span>{t("dashboard.manageBookings")}</span>
              </div>
            </button>
          </section>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <h2>{t("dashboard.recentActivity")}</h2>
            </div>
          </div>

          <div className="past-appointments-list">
            {activity.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="past-appointment-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon size={18} color="var(--primary)" />
                    <h4 style={{ margin: 0 }}>{item.text}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <nav className="bottom-navigation">
        <Link to="/home" className="bottom-nav-item">
          <span className="nav-symbol">⌂</span>
          <span>Home</span>
        </Link>
        <Link to="/appointments" className="bottom-nav-item">
          <CalendarDays size={19} />
          <span>Appointments</span>
        </Link>
        <Link to="/dashboard" className="bottom-nav-item active">
          <Bell size={19} />
          <span>Dashboard</span>
        </Link>
        <Link to="/profile" className="bottom-nav-item">
          <UserRound size={19} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default Dashboard;
