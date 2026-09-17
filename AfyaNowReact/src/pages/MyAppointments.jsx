import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock3,
} from "lucide-react";

import { getAppointment, pastAppointments } from "../data/appointments";

function StatusPill({ status }) {
  const cls = status === "Cancelled"
    ? "status-pill status-cancelled"
    : status === "Completed"
    ? "status-pill status-completed"
    : "status-pill status-confirmed";

  return <span className={cls}>{status}</span>;
}

function MyAppointments() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    setAppointment(getAppointment());
  }, []);

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
        <h1>My Appointments</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="appointments-content">
        <section className="home-section">
          <div className="section-heading">
            <div>
              <h2>Upcoming Appointment</h2>
              <p>Your next scheduled visit</p>
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
                <StatusPill status={appointment.status} />
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
                <Link
                  to="/appointments/current"
                  className="secondary-btn small-btn"
                >
                  View Details
                </Link>

                {appointment.status === "Confirmed" && (
                  <>
                    <Link
                      to="/appointments/current/reschedule"
                      className="secondary-btn small-btn"
                    >
                      Reschedule
                    </Link>
                    <button
                      className="danger-btn small-btn"
                      onClick={() => navigate("/appointments/current")}
                    >
                      Cancel
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
              <h3>No appointments yet</h3>
              <p>Book your first healthcare appointment with AfyaNow.</p>
              <Link to="/specialists" className="primary-button">
                Find a Specialist
              </Link>
            </div>
          )}
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <h2>Past Appointments</h2>
              <p>Your appointment history</p>
            </div>
          </div>

          <div className="past-appointments-list">
            {pastAppointments.map((item) => (
              <div key={item.id} className="past-appointment-row">
                <div>
                  <h4>{item.doctorName}</h4>
                  <p>{item.specialty} · {item.hospital}</p>
                  <span className="past-appointment-date">{item.date}</span>
                </div>
                <StatusPill status={item.status} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MyAppointments;
